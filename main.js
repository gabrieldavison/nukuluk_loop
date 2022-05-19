import p5 from "p5";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Timer } from "./timer.js";
import logoURL from "./logo.glb";

const p5Sketch = (p) => {
  p.setup = () => {
    let cnv = p.createCanvas(p.windowWidth, p.windowHeight);
    cnv.id("p5-canvas");
    p.background(0);
    p.pixelDensity(1);
  };
  p.draw = () => {
    p.background(0);
    p.circle(p.windowWidth / 2, p.windowHeight / 2, 200);
  };
};

const threeSketch = (renderer) => {
  //// CONSTANTS
  const rotSpeed = 0.0025;

  //// SETUP SCENE AND CAMERA
  const scene = new THREE.Scene();
  renderer.setClearColor(0x000000, 0);
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  let camPos;
  const canvasWidth = renderer.domElement.width;

  if (canvasWidth > 600) {
    camPos = 150;
  } else {
    camPos = 350;
  }
  camera.position.set(0, 0, camPos);

  //// LIGHTING
  const pLight = new THREE.PointLight(0xff0000, 3, 200);
  pLight.position.set(50, 50, 50);
  scene.add(pLight);
  const aLight = new THREE.AmbientLight(0x404040, 1);
  scene.add(aLight);

  const m = THREE.MathUtils;
  const rand = (min, max) => m.mapLinear(Math.random(), 0, 1, min, max);

  // Load Model
  const gltfLoader = new GLTFLoader();
  let logo;
  gltfLoader.load(
    logoURL,
    function (gltf) {
      scene.add(gltf.scene);
      gltf.scene.scale.set(10, 10, 10);
      logo = gltf;
    },
    undefined,
    undefined
  );

  //// ANIMATION LOOP
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    if (logo !== undefined) {
      logo.scene.rotation.y += rotSpeed;
    }
  }
  animate();
};

const hydraSketch = () => {
  src(o1).out(o0);
};

const setup = () => {
  const sketchNode = document.getElementById("sketch");

  //// HYDRA SETUP
  const hydraCanvas = document.getElementById("hydra-canvas");
  const hydra = new Hydra({
    canvas: hydraCanvas,
    detectAudio: false,
    enableStreamCapture: false,
  });
  hydra.setResolution(sketchNode.offsetWidth, sketchNode.offsetHeight);

  //// P5 SETUP
  const p5Wrapper = document.getElementById("p5-wrapper");
  sketchNode.appendChild(p5Wrapper);
  const p5SketchObject = new p5(p5Sketch, "p5-wrapper");

  //// THREE SETUP
  const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("three-canvas"),
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  threeSketch(renderer);
  //// SETUP P5 AS HYDRA INPUT
  s0.init({ src: document.getElementById("p5-canvas") });
  s1.init({ src: document.getElementById("three-canvas") });
  src(s1).saturate(0).brightness(0.4).contrast(1.4).out(o1);
  hydraSketch();
};

const mod1 = () => src(o1).modulate(voronoi(3)).out();
const mod2 = () => src(o1).modulate(voronoi(10)).out();

const pix1 = () => src(o1).pixelate(80, 80).out();
const pix2 = () => src(o1).pixelate(200, 200).out();

const fb1 = () => src(o1).diff(src(o0)).out(o0);
const fb2 = () => src(o1).modulate(src(o0), 0.2).out(o0);

const nMod1 = () => src(o1).modulate(noise(10), 0.04).out();

// Needs to be combined with something else
const repeat1 = () => src(o1).repeatX(2).repeatY(2).modulate(o0).out();
const repeat2 = () => src(o1).repeatX(4).repeatY(2).modulate(o0).out();

window.onload = () => {
  setup();
  const t = new Timer(3000);
  t.every(2, fb1, 0.6);
  t.every(3, fb2, 0.5);
  t.every(19, mod1);
  t.every(10, mod2);
  t.every(30, pix1);
  t.every(15, pix2);
  t.every(37, fb1);
  t.every(25, fb2);
  t.every(51, nMod1);
  t.every(59, repeat1);
  t.every(35, repeat2);
  t.every(30, () => t.setTickLength(100));
  t.every(70, () => t.setTickLength(1000));
  t.start();
};
