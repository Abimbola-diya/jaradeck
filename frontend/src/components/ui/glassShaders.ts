/**
 * WGSL shader sources for the liquid-glass WebGPU renderer.
 *
 * Entry points expected by `useLiquidGlassRenderer`:
 *   - vs_fullscreen  : fullscreen triangle shared by both passes
 *   - fs_downsample  : 9-tap downsample/blur of the sharp backdrop
 *   - fs_glass       : refractive, dispersive rounded-rect glass panel
 *
 * Uniform layout (glass buffer, 24 x f32 = 96 bytes):
 *   [0..1]   resolution.xy
 *   [2..3]   mouse.xy
 *   [4..7]   panel.xyzw
 *   [8]      bevelRadius
 *   [9]      ior
 *   [10]     dispersion
 *   [11]     maxThickness
 *   [12..14] sigmaA (rgb extinction)
 *   [15]     scatterDensity
 *   [16..18] lightColor (rgb)
 *   [19]     steps (bitcast u32)
 *   [20..22] padding
 *   [23]     steps (bitcast u32, mirrored)
 */

const COMMON = /* wgsl */ `
struct VSOut {
  @builtin(position) position : vec4<f32>,
  @location(0) uv : vec2<f32>,
}

@vertex
fn vs_fullscreen(@builtin(vertex_index) vertexIndex : u32) -> VSOut {
  var positions = array<vec2<f32>, 3>(
    vec2<f32>(-1.0, -3.0),
    vec2<f32>(-1.0,  1.0),
    vec2<f32>( 3.0,  1.0),
  );

  let xy = positions[vertexIndex];

  var out : VSOut;
  out.position = vec4<f32>(xy, 0.0, 1.0);
  out.uv = vec2<f32>((xy.x + 1.0) * 0.5, (1.0 - xy.y) * 0.5);
  return out;
}
`;

const DOWNSAMPLE = /* wgsl */ `
struct BlurUniforms {
  texel : vec4<f32>,
}

@group(0) @binding(0) var<uniform> blur : BlurUniforms;
@group(0) @binding(1) var linearSampler : sampler;
@group(0) @binding(2) var sharpTexture : texture_2d<f32>;

@fragment
fn fs_downsample(in : VSOut) -> @location(0) vec4<f32> {
  let t = blur.texel.xy;

  var sum = vec4<f32>(0.0);
  sum = sum + textureSample(sharpTexture, linearSampler, in.uv + vec2<f32>(-t.x, -t.y));
  sum = sum + textureSample(sharpTexture, linearSampler, in.uv + vec2<f32>( 0.0, -t.y));
  sum = sum + textureSample(sharpTexture, linearSampler, in.uv + vec2<f32>( t.x, -t.y));
  sum = sum + textureSample(sharpTexture, linearSampler, in.uv + vec2<f32>(-t.x,  0.0));
  sum = sum + textureSample(sharpTexture, linearSampler, in.uv);
  sum = sum + textureSample(sharpTexture, linearSampler, in.uv + vec2<f32>( t.x,  0.0));
  sum = sum + textureSample(sharpTexture, linearSampler, in.uv + vec2<f32>(-t.x,  t.y));
  sum = sum + textureSample(sharpTexture, linearSampler, in.uv + vec2<f32>( 0.0,  t.y));
  sum = sum + textureSample(sharpTexture, linearSampler, in.uv + vec2<f32>( t.x,  t.y));

  return sum / 9.0;
}
`;

const GLASS = /* wgsl */ `
struct GlassUniforms {
  resolution : vec2<f32>,
  mouse : vec2<f32>,
  panel : vec4<f32>,
  bevelRadius : f32,
  ior : f32,
  dispersion : f32,
  maxThickness : f32,
  sigmaA : vec3<f32>,
  scatterDensity : f32,
  lightColor : vec3<f32>,
  steps : u32,
  pad0 : f32,
  pad1 : f32,
  pad2 : f32,
  stepsMirror : u32,
}

@group(0) @binding(0) var<uniform> u : GlassUniforms;
@group(0) @binding(1) var glassSampler : sampler;
@group(0) @binding(2) var sharpTex : texture_2d<f32>;
@group(0) @binding(3) var blurTex : texture_2d<f32>;

fn sdRoundBox(p : vec2<f32>, halfSize : vec2<f32>, radius : f32) -> f32 {
  let q = abs(p) - halfSize + vec2<f32>(radius);
  return length(max(q, vec2<f32>(0.0))) + min(max(q.x, q.y), 0.0) - radius;
}

fn panelSdf(screenPos : vec2<f32>) -> f32 {
  let halfSize = u.panel.zw * 0.5;
  let center = u.panel.xy + halfSize;
  let maxRadius = min(halfSize.x, halfSize.y);
  return sdRoundBox(screenPos - center, halfSize, min(u.bevelRadius, maxRadius));
}

@fragment
fn fs_glass(in : VSOut) -> @location(0) vec4<f32> {
  let screenPos = in.uv * u.resolution;
  let d = panelSdf(screenPos);

  // Outside the glass panel: fully transparent.
  if (d > 0.0) {
    return vec4<f32>(0.0, 0.0, 0.0, 0.0);
  }

  let maxRadius = min(u.panel.z * 0.5, u.panel.w * 0.5);
  let bevel = max(min(u.bevelRadius, maxRadius), 1.0);

  // Normal from the gradient of the rounded-rect distance field.
  let eps = 1.0;
  let ndx = panelSdf(screenPos + vec2<f32>(eps, 0.0)) - panelSdf(screenPos - vec2<f32>(eps, 0.0));
  let ndy = panelSdf(screenPos + vec2<f32>(0.0, eps)) - panelSdf(screenPos - vec2<f32>(0.0, eps));
  var normal = normalize(vec2<f32>(ndx, ndy) + vec2<f32>(1e-6, 1e-6));

  // Thickness: lens-like dome, thickest at the center of the panel.
  let normalized = clamp(-d / bevel, 0.0, 1.0);
  let dome = sqrt(1.0 - normalized * normalized);
  let thickness = min(u.maxThickness, u.maxThickness * dome);
  let thicknessNorm = thickness / max(u.maxThickness, 1e-4);

  let refractStrength = (u.ior - 1.0) * thicknessNorm;

  // Chromatic dispersion: sample the backdrop at slightly different offsets.
  let dispersion = u.dispersion * thicknessNorm;
  let baseOffset = normal * refractStrength;

  let uvR = in.uv + baseOffset * (1.0 + dispersion) / u.resolution;
  let uvG = in.uv + baseOffset / u.resolution;
  let uvB = in.uv + baseOffset * (1.0 - dispersion) / u.resolution;

  var color = vec3<f32>(
    textureSample(blurTex, glassSampler, uvR).r,
    textureSample(blurTex, glassSampler, uvG).g,
    textureSample(blurTex, glassSampler, uvB).b,
  );

  // Sharper backdrop read through the very edge of the bevel.
  let edgeColor = textureSample(sharpTex, glassSampler, in.uv + baseOffset / u.resolution);
  color = mix(color, edgeColor.rgb, pow(normalized, 4.0) * 0.35);

  // Beer-Lambert absorption through the glass volume.
  let absorb = exp(-u.sigmaA * thickness);
  color = color * absorb;

  // Subtle internal scattering.
  let scatter = u.scatterDensity * (1.0 - thicknessNorm);
  color = color + u.lightColor * scatter * 0.15;

  // Fresnel rim highlight.
  let viewDir = normalize(u.mouse - screenPos);
  let facing = clamp(dot(normal, viewDir), 0.0, 1.0);
  let fresnel = pow(1.0 - facing, 3.0);
  let rim = pow(1.0 - normalized, 2.0);
  color = color + u.lightColor * (fresnel * 0.35 + rim * 0.25);

  // Edge alpha so the panel fades out smoothly at its border.
  let alpha = 1.0 - smoothstep(-2.0, 0.0, d);

  return vec4<f32>(color, alpha);
}
`;

export const GLASS_SHADERS = `${COMMON}${DOWNSAMPLE}${GLASS}`;

export default GLASS_SHADERS;
