// #import bevy_pbr::mesh_view_types
#import bevy_pbr::mesh_view_bindings
// #import bevy_pbr::mesh_types
#import bevy_pbr::mesh_bindings

#import bevy_pbr::pbr_types
#import bevy_pbr::utils
#import bevy_pbr::clustered_forward
#import bevy_pbr::lighting
#import bevy_pbr::shadows
#import bevy_pbr::pbr_functions

struct VertexOutput {
    @builtin(position) clip_position: vec4<f32>,
    @location(0) world_position: vec4<f32>,
    @location(1) world_normal: vec3<f32>,
    @location(2) uv: vec2<f32>,
};

struct CellMat {
    color: vec4<f32>,
    strength: f32,
    amp: f32,
    sun_dir: vec3<f32>,
    atmos_color: vec4<f32>
};

@group(1) @binding(0)
var<uniform> material: CellMat;

@group(1) @binding(1)
var texture: texture_2d<f32>;

@group(1) @binding(2)
var my_sampler: sampler;

@fragment
fn fragment(in: VertexOutput) -> @location(0) vec4<f32> {
    
    // consts
    let TEXTURE_SIZE: f32 = 16.0;
    let TEXTURE_STEP: f32 = 1.0 / TEXTURE_SIZE;
    let sun_dir = material.sun_dir;
    
    // inputs
    let view_pos = view.world_position.xyz;
    let pos = in.world_position.xyz;
    let normal = normalize(in.world_normal);
    let color = material.color;
    let view_dir = normalize(view_pos - pos);

    // ambient
    let view_dis = distance(view_pos, pos);
    let depth = 1.0 - view_dis * 0.001;

    // shaded
    let shade = max(0.0, dot(normal, sun_dir));
    let floor_shade = smoothstep(0.0, 0.01, shade);
    let floor_shade_2 = smoothstep(0.50, 0.51, shade);

    // specular
    let ref_light = reflect(-sun_dir, normal);
    var reflection = max(0.0, dot(ref_light, view_dir));
    reflection = smoothstep(0.0, 0.0001, pow(reflection, 50.));

    // shadow 
    var shadow: f32 = fetch_directional_shadow(0u, in.world_position, material.color.xyz);
    shadow = floor(smoothstep(0., 1., shadow) + 0.5);

    var rounded_uv = (floor(in.uv * TEXTURE_SIZE) + 0.5) * TEXTURE_STEP;

    // fresnel
    let view_dot = dot(view_dir, normal);
    var fresnel = 1.0 - view_dot;
    fresnel = fresnel * (1.0 - floor_shade) * shadow;
    let fresnel_pow = pow(fresnel, material.strength) * material.amp; 

    // shade
    rounded_uv = rounded_uv + vec2(-TEXTURE_STEP, 0.0);
    // rounded_uv = rounded_uv + vec2(TEXTURE_STEP * floor_shade, 0.0);
    // rounded_uv = rounded_uv + vec2(TEXTURE_STEP * floor_shade_2, 0.0);
    rounded_uv = rounded_uv + vec2(TEXTURE_STEP * shadow, 0.0);
    // rounded_uv = rounded_uv + vec2(TEXTURE_STEP * reflection, 0.0); // add fresnel and reflection together for a rim

    if fresnel_pow > 0.5 {
        rounded_uv = rounded_uv + vec2(TEXTURE_STEP, 0.0);
    }


    var color = textureSample(texture, my_sampler, rounded_uv);

    color = mix(material.atmos_color, color, pow(depth, 3.0));
    // color = vec4(shadow);
    return vec4(color.xyz, 1.0);


    // calc distance
    // let dis = distance(view_pos, pos) * 0.1;
    // let away = 1.0 -dis;
    // return vec4(fresnel, fresnel, fresnel, away);

    
    // let output_color = normalize(vec4<f32>(in.uv, 0.0,1.0) + vec4<f32>(1.0,1.0,1.0,0.0)) * vec4<f32>(0.5,0.5,0.5,1.0);
    // let score = mock_fresnel(view.world_position.xyz, in.world_position.xyz, in.world_normal, 2.0, 2.0);
    // return vec4(score);
}

