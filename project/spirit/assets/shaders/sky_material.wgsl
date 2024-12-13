#import bevy_render::view::View
#import bevy_pbr::forward_io::VertexOutput

@group(0) @binding(0)
var<uniform> view: View;

struct SkyboxMat {
    color: vec4<f32>,
    top: vec4<f32>,
    bottom: vec4<f32>,
    sun: vec3<f32>,
};

@group(1) @binding(0)
var<uniform> material: SkyboxMat;

const top = vec3<f32>(0., 0., 1.);
const bottom = vec3<f32>(0., 0., -1.);


@fragment
fn fragment(in: VertexOutput) -> @location(0) vec4<f32> {

    let sun_color: vec4<f32> = vec4(1.0);
    let sun_dir = normalize(material.sun);
    let view_pos = view.world_position.xyz;
    let pos = in.world_position.xyz;
    let view_dir = normalize(view_pos - pos);
    let pos_as_normal = normalize(pos);

    let sun_alignment = dot(sun_dir, view_dir);
    let sun_range = smoothstep(0.997, 0.9975, sun_alignment);

    let topness = dot(pos_as_normal, top);
    let bottomness = smoothstep(0.0, 0.4, dot(pos_as_normal, bottom));

    var col = material.color;
    col = mix(col, material.top, topness);
    col = mix(col, material.bottom, bottomness);
    col = mix(col, sun_color, sun_range);

    return col;
}

