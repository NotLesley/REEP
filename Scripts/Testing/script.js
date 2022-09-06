// Three.js - Align HTML Elements w/hiding
// from https://threejs.org/manual/examples/align-html-to-3d-w-hiding.html

import * as THREE from 'three';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({
    canvas
  });


  const labelContainerElem = document.querySelector('#labels');


    const elem = document.createElement('div');
    elem.textContent = name;
    labelContainerElem.appendChild(elem);


  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  const tempV = new THREE.Vector3();
  const raycaster = new THREE.Raycaster();

  function render(time) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    cubes.forEach((cubeInfo, ndx) => {
      const {
        cube,
        elem
      } = cubeInfo;
      const speed = 1 + ndx * .1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;

      // get the position of the center of the cube
      cube.updateWorldMatrix(true, false);
      cube.getWorldPosition(tempV);

      // get the normalized screen coordinate of that position
      // x and y will be in the -1 to +1 range with x = -1 being
      // on the left and y = -1 being on the bottom
      tempV.project(camera);

      // ask the raycaster for all the objects that intersect
      // from the eye toward this object's position
      raycaster.setFromCamera(tempV, camera);
      const intersectedObjects = raycaster.intersectObjects(scene.children);
      // We're visible if the first intersection is this object.
      const show = intersectedObjects.length && cube === intersectedObjects[0].object;

      if (!show || Math.abs(tempV.z) > 1) {
        // hide the label
        elem.style.display = 'none';
      } else {
        // unhide the label
        elem.style.display = '';

        // convert the normalized position to CSS coordinates
        const x = (tempV.x * .5 + .5) * canvas.clientWidth;
        const y = (tempV.y * -.5 + .5) * canvas.clientHeight;

        // move the elem to that position
        elem.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
      }
    });

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
