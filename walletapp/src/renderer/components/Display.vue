<template>
  <div id="container"></div>
</template>

<script>
/* eslint-disable */
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Object3D,
  SphereGeometry,
  TextureLoader,
  LinearFilter,
  MeshBasicMaterial,
  DoubleSide,
  Mesh
} from "three";

import earthmap from "../assets/earthmap.jpg";
import earthspec from "../assets/earthspec.jpg";
import earthbump from "../assets/earthbump.jpg";

export default {
  name: "display",
  data() {
    return {
      id: null,
      earth: null,
      renderer: null,
      scene: null,
      camera: null
    };
  },
  mounted() {
    let scene = new Scene();
    let camera = new PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    let renderer = new WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth / 3, window.innerHeight / 3);
    renderer.setClearColor(0xfcfcfc, 1);
    document.getElementById("container").appendChild(renderer.domElement);

    //CONTAINER
    let container = new Object3D();
    container.rotateZ((-23.4 * Math.PI) / 180);
    container.position.z = 0;
    scene.add(container);

    //EARTH
    let geometry = new SphereGeometry(2.0, 64, 64);

    let loader = new TextureLoader();
    let colorMap = loader.load(earthmap);
    let specMap = loader.load(earthspec);
    let normalMap = loader.load(earthbump);
    colorMap.minFilter = LinearFilter;
    specMap.minFilter = LinearFilter;
    normalMap.minFilter = LinearFilter;

    let material = new MeshBasicMaterial({
      color: 0xffffff,
      specular: 0x333333,
      shininess: 15,
      side: DoubleSide,
      map: colorMap,
      specularMap: specMap,
      normalMap: normalMap
    });

    let earth = new Mesh(geometry, material);

    scene.add(earth);

    camera.position.z = 5;

    let id = requestAnimationFrame(this.render);
    earth.rotation.y = 0.01;
    renderer.render(scene, camera);

    this.id = id;
    this.earth = earth;
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
  },
  methods: {
    render() {
      this.id = requestAnimationFrame(this.render);
      this.earth.rotation.y += 0.01;
      this.renderer.render(this.scene, this.camera);
    },
    stop() {
      if (id !== null) {
        cancelAnimationFrame(id);
        id = null;
      }
    }
  }
};
</script>

<style scoped>
#container {
  background: #fcfcfc;
}
</style>


