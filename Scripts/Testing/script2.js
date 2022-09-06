var scene, camera, renderer, raycaster;
        var geometry, material;
        var controls;
        var mouse;
        var state, substate;

        function init()
        {
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xdddddd);
            camera = new THREE.PerspectiveCamera(100, window.innerWidth/window.innerHeight, 0.01, 10000);
            raycaster = new THREE.Raycaster(); //Raycaster tracks the loacation of the cursor and which object reacts to the event
            canvas = document.querySelector('#c');
            renderer = new THREE.WebGLRenderer({canvas});
            mouse = new THREE.Vector2();
           
            renderer.setClearColor("#e5e8e5");
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(renderer.domElement);

            controls = new THREE.OrbitControls(camera, renderer.domElement);   
            controls.target.set(0, 0, 0);
            controls.update();        
            camera.position.set(0, 0, 15);
            
            //adjust canvas size when resizing the window
            window.addEventListener('resize', ()=>
            {
                renderer.setSize(window.innerWidth, window.innerHeight);
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
            })

            light = new THREE.PointLight(0xFFFFFF, 1, 500);
            light.position.set(10, 0, -25);
            //scene.add(light);

            light_1 = new THREE.PointLight(0xFFFFFF, 1, 500);
            light_1.position.set(10, 0, 25);
            scene.add(light_1);

            state = 0;
            substate = 0;

 
        }
        function Geometry_setup()
        {
            sphere_geometry = new THREE.SphereGeometry(1, 100, 100);
            sphere_material = new THREE.MeshLambertMaterial({color: 0xededed});

            //Instantitaion
            mesh_sun = new THREE.Mesh(sphere_geometry, sphere_material);
            mesh_sun.scale.set(3, 3 ,3);
            mesh_sun.position.set(0, 0, 0);
            scene.add(mesh_sun);
        
        }

        function main()
        {
            const labelContainerElem = document.querySelector('#labels');
            const elem = document.createElement('div');
            elem.textContent = 'Bitch';
            labelContainerElem.appendChild(elem);

            const tempV = new THREE.Vector3();

            function render(time)
            {
                time *= 0.0001;
            
                if (resizeRendererToDisplaySize(renderer)) {
                  const canvas = renderer.domElement;
                  camera.aspect = canvas.clientWidth / canvas.clientHeight;
                  camera.updateProjectionMatrix();
                }

                mesh_sun.updateWorldMatrix(true, false);
                mesh_sun.getWorldPosition(tempV);

                //tempV.project(camera);

                // convert the normalized position to CSS coordinates
                const x = (tempV.x *  .5 + .5) * canvas.clientWidth;
                const y = (tempV.y * -.5 + .5) * canvas.clientHeight;
        
                // move the elem to that position
                elem.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;

                requestAnimationFrame(render);
                renderer.render(scene, camera);
            }
            requestAnimationFrame(render);
        }
        function resizeRendererToDisplaySize(renderer) 
        {
            const canvas = renderer.domElement;
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            const needResize = canvas.width !== width || canvas.height !== height;
            if (needResize) {
                renderer.setSize(width, height, false);
            }
            return needResize;
        }

        main()
        init();
        Geometry_setup();