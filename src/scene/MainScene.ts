import { Scene, Engine, AssetsManager, MeshBuilder, Vector3, HemisphericLight, ArcRotateCamera, Color4, Matrix } from '@babylonjs/core';
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import JoysticksControl from './JoysticksControl';

export default class MainScene {
  scene: Scene;
  engine: Engine;
  el: HTMLCanvasElement;
  assetsManager: AssetsManager;
  camera: ArcRotateCamera;
  constructor() {
    const canvasEl = this._createCanvas();
    this.el = canvasEl;
    this.engine = new Engine(canvasEl);
    this.scene =  new Scene(this.engine);
    this.assetsManager = new AssetsManager(this.scene);
    new HemisphericLight('light', new Vector3(1, 1, 0), this.scene);
    this.camera = new ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2.5, 10, Vector3.Zero());
    MeshBuilder.CreateGround('ground', {width: 10, height: 10}, this.scene);
    this._createBox();
  }

  private _createBox() {
    const box = MeshBuilder.CreateBox('box', {size: 1, faceColors: [new Color4(0,0,0,0), new Color4(0,0,0,0), new Color4(0,0,0,0), new Color4(0,0,0,0)]})
    const joystick = new JoysticksControl();
    // this.scene.onBeforeRenderObservable.add(() => {
    //   if (joystick.xAddPos !== 0 && joystick.yAddPos !== 0) {
    //     const y = Matrix.RotationY(this.camera.rotation.y);
    //     const b = Vector3.TransformCoordinates(new Vector3(joystick.xAddPos / 500, 0, joystick.yAddPos / 500), y);
    //     box.moveWithCollisions(new Vector3(b.x, 0, b.z))
    //   }
    // })
  }

  private _createCanvas() {
    const el = document.createElement('canvas');
    el.id = 'babylonjs-render';
    el.style.width = '100vh';
    el.style.height = '100vw';
    el.style.transformOrigin = 'left top';
    el.style.transform = 'rotate(90deg) translateY(-100%)';
    el.style.transformStyle = 'preserve-3d';
    el.style.position = 'fixed';
    el.style.top = '0';
    el.style.left = '0';
    el.width = document.body.clientHeight;
    el.height = document.body.clientWidth;
    return el;
  }

  

  removeCanvas() {
    const el = document.getElementById('babylonjs-render');
    if (el) {
      document.body.removeChild(el);
    }
  }

  render() {
    const divEl = document.getElementById('app');
    if (divEl) {
      divEl.appendChild(this.el);
    }
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
    // this.debuger();
  }
  debuger() {
    this.scene.debugLayer.show();
  }
}