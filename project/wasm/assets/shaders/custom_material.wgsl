#import bevy_render::view View
#import bevy_pbr::mesh_bindings

@group(0) @binding(0)
var<uniform> view: View;

struct VertexOutput {
    @builtin(position) clip_position: vec4<f32>,
    @location(0) world_position: vec4<f32>,
    @location(1) world_normal: vec3<f32>,
    @location(2) uv: vec2<f32>,
};

struct CustomMaterial {
    color: vec4<f32>,
    strength: f32,
    amp: f32,
};

@group(1) @binding(0)
var<uniform> material: CustomMaterial;

@fragment
fn fragment(in: VertexOutput) -> @location(0) vec4<f32> {
    
    // inputs
    let view_pos = view.world_position.xyz;
    let pos = in.world_position.xyz;
    let normal = normalize(in.world_normal);
    let color = material.color;

    // fresnel
    let view_dir = normalize(view_pos - pos);
    let view_dot = dot(view_dir, normal);
    let fresnel = 1.0 - view_dot;
    let fresnel_pow = pow(fresnel, material.strength) * material.amp;

    let RED = vec3(0.0,0.0,1.0);

    let col = color.xyz * fresnel_pow;

    return vec4(col, 1.0);


    // calc distance
    // let dis = distance(view_pos, pos) * 0.1;
    // let away = 1.0 -dis;
    // return vec4(fresnel, fresnel, fresnel, away);

    
    // let output_color = normalize(vec4<f32>(in.uv, 0.0,1.0) + vec4<f32>(1.0,1.0,1.0,0.0)) * vec4<f32>(0.5,0.5,0.5,1.0);
    // let score = mock_fresnel(view.world_position.xyz, in.world_position.xyz, in.world_normal, 2.0, 2.0);
    // return vec4(score);
}

