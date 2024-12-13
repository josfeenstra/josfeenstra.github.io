#import bevy_render::view::View
#import bevy_pbr::shadows as shadows
#import bevy_pbr::prepass_utils as prepass
#import bevy_pbr::forward_io::VertexOutput

@group(0) @binding(0)
var<uniform> view: View;

//////////////////////////////////////////// Prepass business

#ifdef USE_EDGE_DETECTION
    
var<private> sobel_x: array<f32, 9> = array<f32, 9>(
    1.0,
    0.0,
   -1.0,
    2.0,
    0.0,
   -2.0,
    1.0,
    0.0,
   -1.0,
);
var<private> sobel_y: array<f32, 9> = array<f32, 9>(
    1.0,
    2.0,
    1.0,
    0.0,
    0.0,
    0.0,
   -1.0,
   -2.0,
   -1.0,
);

var<private> edge_depth_threshold: f32 = 0.001;
var<private> edge_normal_threshold: f32 = 0.05;
var<private> edge_color_threshold: f32 = 0.2;

var<private> neighbours: array<vec2<f32>, 9> = array<vec2<f32>, 9>(
    vec2<f32>(-1.0, 1.0),  // 0. top left
    vec2<f32>(0.0, 1.0),   // 1. top center
    vec2<f32>(1.0, 1.0),   // 2. top right
    vec2<f32>(-1.0, 0.0),  // 3. center left
    vec2<f32>(0.0, 0.0),   // 4. center center
    vec2<f32>(1.0, 0.0),   // 5. center right
    vec2<f32>(-1.0, -1.0), // 6. bottom left
    vec2<f32>(0.0, -1.0),  // 7. bottom center
    vec2<f32>(1.0, -1.0),  // 8. bottom right
);

fn detect_edge_depth(frag_coord: vec4<f32>, sample_index: u32) -> f32 {
    let depth_modulation = 0.001;
    var samples = array<f32, 9>();
    for (var i = 0; i < 9; i++) {
        let depth = prepass::prepass_depth(frag_coord + neighbours[i].xyxy, sample_index);
        samples[i] = depth_modulation / depth;
    }

    var horizontal = vec4<f32>(0.0);
    for (var i = 0; i < 9; i++) {
        horizontal += samples[i] * sobel_x[i];
    }

    var vertical = vec4<f32>(0.0);
    for (var i = 0; i < 9; i++) {
        vertical += samples[i] * sobel_y[i];
    }

    var edge = sqrt(dot(horizontal, horizontal) + dot(vertical, vertical));
    if edge < edge_depth_threshold {
        return 0.0;
    }
    return edge * 2.0;
}

fn detect_edge_normal(frag_coord: vec4<f32>, sample_index: u32) -> f32 {
    var samples = array<vec3<f32>, 9>();
    for (var i = 0; i < 9; i++) {
        samples[i] = prepass::prepass_normal(frag_coord + (neighbours[i].xyxy * 1.0), sample_index);
    }

    var horizontal = vec3<f32>(0.0);
    for (var i = 0; i < 9; i++) {
        horizontal += samples[i].xyz * sobel_x[i];
    }

    var vertical = vec3<f32>(0.0);
    for (var i = 0; i < 9; i++) {
        vertical += samples[i].xyz * sobel_y[i];
    }

    var edge = sqrt(dot(horizontal, horizontal) + dot(vertical, vertical));
    if edge < edge_normal_threshold {
        return 0.0;
    }
    return edge;
}

fn detect_edge(frag_coord: vec4<f32>, sample_index: u32) -> f32 {
    let sobel1 = detect_edge_normal(frag_coord, sample_index);
    var sobel2 = detect_edge_depth(frag_coord, sample_index);

    return max(sobel1, sobel2);
}

#endif

/////////////////////////////////////////////

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
fn fragment(
    in: VertexOutput,
    ) -> @location(0) vec4<f32> {
    let sample_index = 0u;

    var edge_detection = 0.0;

    #ifdef USE_EDGE_DETECTION
    if (in.uv.y < 0.90625) {
        edge_detection = 4.0 * detect_edge(in.position, sample_index);
    } 
    #endif
    
    // return vec4(edge_detection, edge_detection, edge_detection, 1.0);

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

    // shaded
    let shade = max(0.0, dot(normal, sun_dir));
    let floor_shade = smoothstep(0.0, 0.01, shade);
    let floor_shade_2 = smoothstep(0.50, 0.51, shade);

    // specular
    let ref_light = reflect(-sun_dir, normal);
    var reflection = max(0.0, dot(ref_light, view_dir));
    reflection = smoothstep(0.0, 0.0001, pow(reflection, 50.));

    // shadow
    // var shadow: f32 = 1.0; 
    // let view_z = 0.5;
    let view_z = dot(vec4<f32>(
        view.inverse_view[0].z,
        view.inverse_view[1].z,
        view.inverse_view[2].z,
        view.inverse_view[3].z
    ), in.world_position);
    var shadow: f32 = shadows::fetch_directional_shadow(0u, in.world_position, in.world_normal, view_z);
    shadow = floor(smoothstep(0., 1., shadow) + 0.5);

    // return vec4(shadow, shadow, shadow, 1.0);

    var rounded_uv = (floor(in.uv * TEXTURE_SIZE) + 0.5) * TEXTURE_STEP;

    // fresnel
    let view_dot = dot(view_dir, normal);
    var fresnel = 1.0 - view_dot;
    fresnel = fresnel;
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

    var col = textureSample(texture, my_sampler, rounded_uv);

    // let fade = pow(depth * 1.0, 0.5);
    let edge_color = vec4(0.0,0.0,0.0,1.0);
    var fade = 1.7 - pow(view_dis * 0.7, 0.5) * 0.20;
    fade = clamp(fade, 0.0, 1.0);
    col = mix(material.atmos_color, col, fade);
    col = mix(col, mix(col, edge_color, 0.33), edge_detection);
    return vec4(col.xyz, 1.0);

    // calc distance
    // let dis = distance(view_pos, pos) * 0.1;
    // let away = 1.0 -dis;
    // return vec4(fresnel, fresnel, fresnel, away);

    
    // let output_color = normalize(vec4<f32>(in.uv, 0.0,1.0) + vec4<f32>(1.0,1.0,1.0,0.0)) * vec4<f32>(0.5,0.5,0.5,1.0);
    // let score = mock_fresnel(view.world_position.xyz, in.world_position.xyz, in.world_normal, 2.0, 2.0);
    // return vec4(score);
}

