import * as THREE from 'three';
import { easing } from 'popmotion';

import Point from './Point';

export default class Background {
  constructor(container, { threshold, color, duration }) {
    this.container = container;
    this.threshold = threshold;
    this.color = color;
    this.duration = duration;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    this.camera.position.z = 300;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.clock = new THREE.Clock(true);
    this.points = new Point(this);
    this.scene.background = new THREE.Color('rgba(0, 0, 0)');
    this.scene.add(this.points.container);
  }

  init() {
    this.container.appendChild(this.renderer.domElement);
    window.addEventListener('resize', this.resize.bind(this));
    this.resize();
  }

  update() {
    const delta = this.clock.getDelta();

    if (this.points) this.points.update(delta);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  play() {
    this.renderer.setAnimationLoop(() => {
      this.update();
      this.render();
    });
  }

  updateDepth(value) {
    this.points.updateDepth(this.points.getDepth() + value * 30);
  }

  draw(image, animation, complete = () => {}) {
    this.container.dataset.image = image;
    this.points.init(image, this.threshold, this.color, animation, complete);
  }

  show(image, complete = () => {}) {
    this.points.hide(true).then(() => {
      this.draw(image, {}, complete);
    });
  }

  hide(complete = () => {}) {
    this.points.hide(true).then(() => {
      complete();
    });
  }

  change(image) {
    this.points.hide(true).then(() => {
      this.draw(image, {
        depth: {
          from: this.points.getDepth(),
          to: 10.0,
        },
        original: {
          from: this.points.getOriginal(),
          to: 1.0,
        },
        custom: {
          from: this.points.getCustom(),
          to: 0.0,
        },
      });
    });
  }

  drop() {
    const duration = this.duration * 0.3;

    this.points.show({
      size: {
        duration,
      },
      depth: {
        duration,
      },
      original: {
        duration,
      },
      custom: {
        duration: duration * 0.9,
      },
    });
  }

  paint() {
    const duration = this.duration * 0.3;

    this.points.show({
      size: {
        from: this.points.getSize(),
        to: 0.5,
        duration,
        ease: easing.cubicBezier(0, 0.42, 0, 1),
      },
      depth: {
        from: this.points.getDepth(),
        to: 10.0,
        duration,
        ease: easing.cubicBezier(0, 0.42, 0, 1),
      },
      original: {
        from: this.points.getOriginal(),
        to: 1.0,
        duration,
        ease: easing.easeOut,
      },
      custom: {
        from: this.points.getCustom(),
        to: 0.0,
        duration: duration * 0.9,
        ease: easing.easeIn,
      },
    });
  }

  reversePaint() {
    const duration = this.duration * 0.3;

    this.points.show({
      size: {
        from: this.points.getSize(),
      },
      depth: {
        from: this.points.getDepth(),
        duration,
      },
      original: {
        from: this.points.getOriginal(),
        duration,
      },
      custom: {
        from: this.points.getCustom(),
        duration: duration * 0.9,
      },
    });
  }

  resize() {
    if (!this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.fovHeight =
      2 *
      Math.tan((this.camera.fov * Math.PI) / 180 / 2) *
      this.camera.position.z;

    this.renderer.setSize(window.innerWidth, window.innerHeight);

    if (this.points) this.points.resize();
  }
}
