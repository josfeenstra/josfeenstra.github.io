#import bevy_render::view View
#import bevy_pbr::mesh_bindings

@group(0) @binding(0)
var<uniform> view: View;

struct CustomMaterial {
    color: vec4<f32>,
};
@group(1) @binding(0)
var<uniform> material: CustomMaterial;

// NOTE: Bindings must come before functions that use them!
#import bevy_pbr::mesh_functions

struct Vertex {
    @location(0) position: vec3<f32>,
    @location(1) blend_color: vec4<f32>,
};

struct VertexOutput {
    @builtin(position) clip_position: vec4<f32>,
    @location(0) blend_color: vec4<f32>,
};

@vertex
fn vertex(vertex: Vertex) -> VertexOutput {
    var out: VertexOutput;
    out.clip_position = mesh_position_local_to_clip(mesh.model, vec4<f32>(vertex.position, 1.0));
    out.blend_color = vertex.blend_color;
    return out;
}

struct FragmentInput {
    @location(0) blend_color: vec4<f32>,
};

@fragment
fn fragment(input: FragmentInput) -> @location(0) vec4<f32> {
    return material.color * input.blend_color;
}
