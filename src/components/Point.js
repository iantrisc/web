/* eslint-disable prefer-destructuring */
/* eslint-disable no-continue */
/* eslint-disable no-plusplus */
import * as THREE from 'three';
import { tween, easing, parallel } from 'popmotion';

import { fragment, vertex } from './Shaders';

function getAspectRatio(imageWidth, imageHeight, width, height) {
  const iw = imageWidth;
  const ih = imageHeight;
  const r = Math.min(width / iw, height / ih);
  const nw = iw * r; // new prop. width
  // const nh = ih * r; // new prop. height
  let ar = 1;

  // decide which gap to fill
  if (nw < width) ar = width / nw;
  // if (Math.abs(ar - 1) < 1e-14 && nh < height) ar = height / nh;  // updated

  return ar;
}

export default class Point {
  constructor(bg) {
    this.bg = bg;
    this.duration = this.bg.duration;
    this.channel = 0;
    this.initial = {
      size: 1.5,
      depth: 140.0,
      original: 1.0,
      custom: 0.0,
    };
    this.container = new THREE.Object3D();
  }

  init(image, threshold, color, transition = {}, complete = () => {}) {
    const loader = new THREE.TextureLoader();

    loader.load(image, (texture) => {
      this.texture = texture;
      this.texture.minFilter = THREE.LinearFilter;
      this.texture.magFilter = THREE.LinearFilter;
      this.texture.format = THREE.RGBFormat;
      this.imageWidth = texture.image.width;
      this.imageHeight = texture.image.height;
      this.setPoints(threshold, color);
      this.resize();
      this.show(transition, complete);
    });
  }

  updateDepth(value) {
    if (this.updateAnimation) {
      this.updateAnimation.stop();
    }

    this.updateAnimation = tween({
      from: this.object3D.material.uniforms.uDepth.value,
      to: value,
      duration: 300,
      ease: easing.easeOut,
    }).start({
      update: (v) => {
        this.object3D.material.uniforms.uDepth.value = v;
      },
      complete: () => {},
    });
  }

  getSize() {
    if (this.object3D) return this.object3D.material.uniforms.uSize.value;
    return this.initial.size;
  }

  getInitialDepth() {
    return this.initial.depth;
  }

  getDepth() {
    if (this.object3D) return this.object3D.material.uniforms.uDepth.value;
    return this.initial.depth;
  }

  getOriginal() {
    if (this.object3D) return this.object3D.material.uniforms.uOriginal.value;
    return this.initial.original;
  }

  getCustom() {
    if (this.object3D) return this.object3D.material.uniforms.uCustom.value;
    return this.initial.custom;
  }

  setPoints(threshold, color) {
    let points = 0;
    this.totalPoints = this.imageWidth * this.imageHeight;

    const img = this.texture.image;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = this.imageWidth;
    canvas.height = this.imageHeight;
    ctx.scale(1, -1);
    ctx.drawImage(img, 0, 0, this.imageWidth, this.imageHeight * -1);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const imageColors = Float32Array.from(imgData.data);

    for (let i = 0; i < this.totalPoints; i++) {
      if (imageColors[i * 4 + this.channel] > threshold) {
        points++;
      }
    }

    const scale = getAspectRatio(
      this.imageWidth,
      this.imageHeight,
      window.innerWidth,
      window.innerHeight
    );

    const material = new THREE.RawShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uDepth: { value: 140.0 },
        uSize: { value: 1.5 },
        uTextureSize: {
          value: new THREE.Vector2(this.imageWidth, this.imageHeight),
        },
        uTextureScale: { value: scale },
        uTexture: { value: this.texture },
        uColor: {
          value: new THREE.Vector4(color.r, color.b, color.g, color.a),
        },
        uCustom: { value: 0.0 },
        uOriginal: { value: 1.0 },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      depthTest: false,
      transparent: true,
    });

    const geometry = new THREE.InstancedBufferGeometry();

    // positions
    const positions = new THREE.BufferAttribute(new Float32Array(4 * 3), 3);
    positions.setXYZ(0, -0.5, 0.5, 0.0);
    positions.setXYZ(1, 0.5, 0.5, 0.0);
    positions.setXYZ(2, -0.5, -0.5, 0.0);
    positions.setXYZ(3, 0.5, -0.5, 0.0);
    geometry.addAttribute('position', positions);
    // uvs
    const uvs = new THREE.BufferAttribute(new Float32Array(4 * 2), 2);
    uvs.setXYZ(0, 0.0, 0.0);
    uvs.setXYZ(1, 1.0, 0.0);
    uvs.setXYZ(2, 0.0, 1.0);
    uvs.setXYZ(3, 1.0, 1.0);
    geometry.addAttribute('uv', uvs);

    // index
    geometry.setIndex(
      new THREE.BufferAttribute(new Uint16Array([0, 2, 1, 2, 3, 1]), 1)
    );

    const indices = new Uint16Array(points);
    const offsets = new Float32Array(points * 3);

    for (let i = 0, j = 0; i < this.totalPoints; i++) {
      if (imageColors[i * 4 + this.channel] <= threshold) continue;

      offsets[j * 3 + 0] = i % this.imageWidth;
      offsets[j * 3 + 1] = Math.floor(i / this.imageWidth);
      indices[j] = i;
      j++;
    }

    geometry.addAttribute(
      'pindex',
      new THREE.InstancedBufferAttribute(indices, 1, false)
    );
    geometry.addAttribute(
      'offset',
      new THREE.InstancedBufferAttribute(offsets, 3, false)
    );

    this.object3D = new THREE.Mesh(geometry, material);
    this.container.add(this.object3D);
    /*
     */
  }

  update(delta) {
    if (!this.object3D) return;

    this.object3D.material.uniforms.uTime.value += delta;
  }

  show(
    { size = {}, depth = {}, original = {}, custom = {} },
    complete = () => {}
  ) {
    const defaultOpts = {
      size: {
        from: this.object3D.material.uniforms.uSize.value,
        to: 0.5,
        duration: this.duration,
        ease: easing.cubicBezier(0, 0.42, 0, 1),
      },
      depth: {
        from: this.object3D.material.uniforms.uDepth.value,
        to: 1.0,
        duration: this.duration,
        ease: easing.cubicBezier(0, 0.42, 0, 1),
      },
      original: {
        from: this.object3D.material.uniforms.uOriginal.value,
        to: 0.0,
        duration: this.duration * 0.9,
        ease: easing.easeIn,
      },
      custom: {
        from: this.object3D.material.uniforms.uCustom.value,
        to: 0.9,
        duration: this.duration,
        ease: easing.easeOut,
      },
    };

    const options = { size: {}, depth: {}, original: {}, custom: {} };

    if (Object.keys(size).length !== 0 && size.constructor === Object) {
      options.size = { ...defaultOpts.size, ...size };
    } else {
      options.size = defaultOpts.size;
    }

    if (Object.keys(depth).length !== 0 && depth.constructor === Object) {
      options.depth = { ...defaultOpts.depth, ...depth };
    } else {
      options.depth = defaultOpts.depth;
    }

    if (Object.keys(original).length !== 0 && original.constructor === Object) {
      options.original = { ...defaultOpts.original, ...original };
    } else {
      options.original = defaultOpts.original;
    }

    if (Object.keys(custom).length !== 0 && custom.constructor === Object) {
      options.custom = { ...defaultOpts.custom, ...custom };
    } else {
      options.custom = defaultOpts.custom;
    }

    if (this.animation) {
      this.animation.stop();
    }

    const sizeTween = tween(options.size);
    const depthTween = tween(options.depth);
    const originalTween = tween(options.original);
    const customTween = tween(options.custom);

    this.animation = parallel(
      sizeTween,
      depthTween,
      originalTween,
      customTween
    ).start({
      update: (values) => {
        this.object3D.material.uniforms.uSize.value = values[0];
        this.object3D.material.uniforms.uDepth.value = values[1];
        this.object3D.material.uniforms.uOriginal.value = values[2];
        this.object3D.material.uniforms.uCustom.value = values[3];
      },
      complete,
    });
  }

  hide(_destroy) {
    return new Promise((resolve) => {
      if (this.animation) {
        this.animation.stop();
      }

      const duration = this.duration * 0.25;

      const depthTween = tween({
        from: this.object3D.material.uniforms.uDepth.value,
        to: 40.0,
        duration,
        // ease: easing.cubicBezier(0, .42, 0, 1),
      });
      const sizeTween = tween({
        from: this.object3D.material.uniforms.uSize.value,
        to: 0.0,
        duration,
        // ease: easing.cubicBezier(0, .42, 0, 1)
      });
      const originalTween = tween({
        from: this.object3D.material.uniforms.uOriginal.value,
        to: 1.0,
        duration,
        ease: easing.easeOut,
      });
      const customTween = tween({
        from: this.object3D.material.uniforms.uCustom.value,
        to: 0.0,
        duration: duration * 0.9,
        ease: easing.easeIn,
      });
      this.animation = parallel(
        depthTween,
        sizeTween,
        originalTween,
        customTween
      ).start({
        update: (values) => {
          this.object3D.material.uniforms.uDepth.value = values[0];
          this.object3D.material.uniforms.uSize.value = values[1];
          this.object3D.material.uniforms.uOriginal.value = values[2];
          this.object3D.material.uniforms.uCustom.value = values[3];
        },
        complete: () => {
          if (_destroy) this.destroy();
          resolve();
        },
      });
    });
  }

  destroy() {
    if (!this.object3D) return;

    this.object3D.parent.remove(this.object3D);
    this.object3D.geometry.dispose();
    this.object3D.material.dispose();
    this.object3D = null;
  }

  resize() {
    if (!this.object3D) return;

    const scale = this.bg.fovHeight / this.imageHeight;
    const textureScale = getAspectRatio(
      this.imageWidth,
      this.imageHeight,
      window.innerWidth,
      window.innerHeight
    );
    this.object3D.scale.set(scale * 0.6, scale * 0.6, 1);
    this.object3D.material.uniforms.uTextureScale.value = textureScale;
  }
}
