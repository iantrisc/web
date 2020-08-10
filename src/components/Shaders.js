//
// Description : Array and textureless GLSL 2D simplex noise function.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//

const glNoiseSimplex = `
vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}
  
vec2 mod289(vec2 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}
  
vec3 permute(vec3 x) {
    return mod289(((x*34.0)+1.0)*x);
}

float snoise(vec2 v)
{
    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
    // First corner
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);

    // Other corners
    vec2 i1;
    //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
    //i1.y = 1.0 - i1.x;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    // x0 = x0 - 0.0 + 0.0 * C.xx ;
    // x1 = x0 - i1 + 1.0 * C.xx ;
    // x2 = x0 - 1.0 + 2.0 * C.xx ;
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;

    // Permutations
    i = mod289(i); // Avoid truncation effects in permutation
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
            + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;

    // Gradients: 41 points uniformly over a line, mapped onto a diamond.
    // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    // Normalise gradients implicitly by scaling m
    // Approximation of: m *= inversesqrt( a0*a0 + h*h );
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

    // Compute final noise value at P
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

`;

// Vertex and fragment based on brunoimbrizi's (http://brunoimbrizi.com)
// article on codrops (https://tympanus.net/codrops/2019/01/17/interactive-particles-with-three-js/)

const vertex = `
precision highp float;

attribute float pindex;
attribute vec3 position;
attribute vec3 offset;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float uTime;
uniform float uDepth;
uniform float uSize;
uniform vec2 uTextureSize;
uniform sampler2D uTexture;
uniform float uTextureScale;
uniform vec4 uColor;
uniform float uCustom;
uniform float uOriginal;
varying vec2 vPUv;
varying vec2 vUv;

${glNoiseSimplex}

float random(float n) {
 return fract(sin(n) * 43758.5453123);
}

void main() {
  vUv = uv;

  // particle uv
  vec2 puv = offset.xy / uTextureSize;
  vPUv = puv;

  // pixel color
  vec4 textureColor = texture2D(uTexture, puv);
  float grey = textureColor.r * 0.21 + textureColor.g * 0.71 + textureColor.b * 0.07;

  // displacement
  vec3 displaced = offset;
  float rndz = (random(pindex) + snoise(vec2(pindex * 0.1, uTime * 0.1)));
  displaced.z += rndz * (random(pindex) * 2.0 * uDepth);
  // center
  displaced.xy -= uTextureSize * 0.5;
  displaced.xy *= uTextureScale;

  // particle size
  float psize = (snoise(vec2(uTime, pindex) * 0.5) + 2.0);
  psize *= max(grey, 0.2);
  psize *= uSize;

  // final position
  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
  mvPosition.xyz += position * psize;
  vec4 finalPosition = projectionMatrix * mvPosition;

  gl_Position = finalPosition;
}

`;

const fragment = `
precision highp float;

uniform sampler2D uTexture;
uniform vec4 uColor;
uniform float uCustom;
uniform float uOriginal;

varying vec2 vPUv;
varying vec2 vUv;

float applyColor(float customColor, float textureColor) {
  return (((customColor * uCustom) / 255.) + (textureColor * uOriginal));
}

float applyAlpha(float customColor, float textureColor) {
 return ((customColor * uCustom) + (textureColor * uOriginal));
}

void main() {
  //vec4 color = vec4(0.0);
  vec2 uv = vUv;
  vec2 puv = vPUv;

  // pixel color
  vec4 textureColor = texture2D(uTexture, puv);

  // greyscale
  //vec4 colB = vec4( ((uColor.r * custom) + (textureColor.r * uOriginal)) / 255., ((uColor.b * custom) + (textureColor.b * uOriginal)) / 255., ((uColor.g * custom) + (textureColor.g * uOriginal)) / 255., ((uColor.g * custom) + (textureColor.g * uOriginal)));
    
    float read = applyColor(uColor.r, textureColor.r);
    float green = applyColor(uColor.g, textureColor.g);
    float blue = applyColor(uColor.b, textureColor.b);
    float alpha = applyAlpha(uColor.a, textureColor.a);
    //float alpha = uColor.a;

  vec4 pointColor = vec4( read , green, blue, alpha);

  gl_FragColor = pointColor;
}
`;

export { fragment, vertex };
