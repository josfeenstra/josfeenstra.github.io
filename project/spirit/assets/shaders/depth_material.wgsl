#import bevy_render::view::View

@group(0) @binding(0)
var<uniform> view: View;

struct DepthMat {
    max_depth: f32,
};


struct VertexOutput {
    @builtin(position) clip_position: vec4<f32>,
    @location(0) world_position: vec4<f32>,
};
@fragment
fn fragment(in: VertexOutput) -> @location(0) vec4<f32> {

    let view_pos = view.world_position.xyz;
    let pos = in.world_position.xyz;
    let distance = in.clip_position.w

    return vec4(vec3(), 1.0);
}

// true depth, the above distance will not work apparently
// p_ndc = vec4<f32>(uv * vec2<f32>(2.0, -2.0) + vec2<f32>(-1,0, 1.0), depth, 1.0);
// p_view_homogeneous = view.inverse_projection * p_ndc;
// p_view = p_view_homogeneous.xyz / p_view_homogeneous.w;

// And then what you want is length(p_view) I guess