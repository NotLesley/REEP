var scene, camera, renderer, raycaster;
var geometry, material;
var controls;
var mouse;
var state, substate;
'use strict';
function init()
{
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdddddd);
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 100);
    raycaster = new THREE.Raycaster(); //Raycaster tracks the loacation of the cursor and which object reacts to the event
    canvas = document.querySelector('#c');
    renderer = new THREE.WebGLRenderer({canvas});
    renderer.setPixelRatio( window.devicePixelRatio );
    mouse = new THREE.Vector2();
   
    renderer.setClearColor("#e5e8e5");
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);   
    controls.target.set(0, 0, 0);
    controls.update();        
    cam_pos = new THREE.Vector3(0, 0, 30);
    cam_rot = new THREE.Euler(0, 0, 0, 'XYZ');
    camera.position.copy(cam_pos);
    
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
    centroid = new THREE.Vector3(0, 0, 0);

    pos = new Array(6);
    for (let i = 0; i < 6; i++)
    {
        pos[i] = new THREE.Vector3(0, 0, 0);
    }

    //-----------------------Instantitaion--------------------------

    mesh_sun = new THREE.Mesh(sphere_geometry, sphere_material);
    mesh_sun.scale.set(3, 3 ,3);
    mesh_sun.position.copy(centroid);
    scene.add(mesh_sun);
    

    mesh_primary = new Array(6); 
    for (let i = 0; i < 6; i++)
    {
        mesh_primary[i] = new THREE.Mesh(sphere_geometry, sphere_material);
    }

    tl_secondary = new Array();
    for (let i = 0; i < 8; i++)
    {
        tl_secondary[i] = new THREE.Mesh(sphere_geometry, sphere_material); 
    }

    //-------------------------Resizing--------------------------------

    mesh_primary[0].scale.set(0.7, 0.7, 0.7);
    mesh_primary[1].scale.set(0.4, 0.4, 0.4);
    mesh_primary[2].scale.set(0.5, 0.5, 0.5);
    mesh_primary[3].scale.set(0.4, 0.4, 0.4);
    mesh_primary[4].scale.set(0.6, 0.6, 0.6);
    mesh_primary[5].scale.set(0.6, 0.6, 0.6);

    for (let k = 0; k < 8; k++)
    {
        tl_secondary[k].scale.set(0.5, 0.5, 0.5);
    }

    //-----------------------Euler Rotation---------------------------
    rot = new Array(6);
    rot[0] = new THREE.Euler(0, 30*Math.PI/180, 5*Math.PI/180, 'XYZ');
    rot[1] = new THREE.Euler(20*Math.PI/180, 0, -110*Math.PI/180, 'XYZ');
    rot[2] = new THREE.Euler(-40*Math.PI/180, -5*Math.PI/180, 120*Math.PI/180, 'XYZ');
    rot[3] = new THREE.Euler(-80*Math.PI/180, 40*Math.PI/180, -60*Math.PI/180, 'XYZ');
    rot[4] = new THREE.Euler(30*Math.PI/180, 0, 80*Math.PI/180, 'XYZ');
    rot[5] = new THREE.Euler(0, -130*Math.PI/180, 0, 'XYZ');
    
    //------------------------Positioning--------------------------------

    for (let i = 0; i < 6; i++)
    {
        pos[i].add(new THREE.Vector3(3, 0, 0));
        pos[i].applyEuler(rot[i]);
        pos[i].multiplyScalar(0.6);
        mesh_primary[i].position.copy(pos[i])
    }

    for (let i = 0; i < 8; i++)
    {
        mesh_primary[0].add(tl_secondary[i]);
    }

    tl_pos = new Array(8);
    tl_rot = new Array(8);

    for(let i = 0; i < 8; i++)
    {
        tl_pos[i] = new THREE.Vector3(3, 0, 0);
    }
    
    angle = -4*Math.PI/9;
    for (let i = 0; i < 8; i++)
    {
        tl_rot[i] = new THREE.Euler(rot[0].x, rot[0].y, rot[0].z + angle, 'XYZ');
        tl_pos[i].applyEuler(tl_rot[i]);
        tl_pos[i].multiplyScalar(0.1);
        tl_secondary[i].position.copy(tl_pos[i]);
        angle += Math.PI/9;
    }
   
    //----------------------------Adding to scene------------------------            

    for(let i = 0; i< 6; i++)
    {
        mesh_sun.add(mesh_primary[i]);
    }
    
    //----------------------------Naming---------------------------------

    mesh_sun.name = 'sun';

    for (let i = 0; i< 6; i++)
    {
        mesh_primary[i].name = i; 
    }

}

function OnMouseClick(event)
{
    
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(scene.children, true);//returns array of object that mouse in intersecting with
    for(i = 0; i < intersects.length; i++)
    {
        tl = new TimelineMax();
        tl.timeScale(1);

        switch(state)
        {
            case 0:
            if(intersects[i].object.name == 'sun')
            {
                switch(substate)
                {
                    case 0:
                        substate = 1;
                        break;
                    case 1: 
                        substate = 0;
                        break;
                } 
                FSM_Update(state, substate);
            }
            if(substate == 1)
            {
                if(intersects[i].object.name == '0')
                {
                    state = 1;
                    FSM_Update(state, substate);
                }
            }
            break;
        }
        
        console.log(intersects[i].object.name);
    }
}

function FSM_Controller()
{
    document.body.addEventListener('click', OnMouseClick);
    
}
function FSM_Update(zone, subzone)
{
    switch(zone)
    {
        case 0:
            switch(subzone)
            {
                case 0:
                    Primary_tween(2, 1);
                    break;
                case 1:
                    Primary_tween(1, 2);
                    break;
            }
        break;
        case 1:

            centroid = new THREE.Vector3(-0.1, 0, -0.05);
            Orb_Tween(mesh_sun, centroid, 0.1, 100);
            Orb_Tween(mesh_primary[0], pos[0], 2, 4);
            Primary_tween(2, 1, 0);
            
            rotateCamera(new THREE.Vector3(0, 0, 50), new THREE.Vector3(50, 0, 0));
            for (let i = 0; i < 8; i++)
            {
                tl_pos[i].multiplyScalar(20);
                this.tl.to(tl_secondary[i].position, 0.3, {x: (tl_pos[i].x),
                                                            y: (tl_pos[i].y),
                                                            z: (tl_pos[i].z),
                                                            ease: Elastic.easeOut.config(3, 3)
                                                            });
            }
        break;
    }
    
}

function Primary_tween(startScalar, endScalar, orb)
{
    for (let i = 0; i < 6; i++)
    {
        if(i == orb) i++;
        let startPos = {x: pos[i].x*startScalar, 
                        y: pos[i].y*startScalar, 
                        z: pos[i].z*startScalar };  

        let endPos = {x: pos[i].x*endScalar,
                      y: pos[i].y*endScalar,
                      z: pos[i].z*endScalar};    

        tween2 = new TWEEN.Tween(startPos);
        tween2.to(endPos, 500).onUpdate(() =>
        {
            mesh_primary[i].position.copy(startPos);
        });
        tween2.start();
    }
    
}

function Orb_Tween(object, position, startScalar, endScalar)
{
    let initPos = {x: position.x*startScalar,
                   y: position.y*startScalar,
                   z: position.z*startScalar
                    };

    let finalPos = {x: position.x*endScalar,
                   y: position.y*endScalar,
                   z: position.z*endScalar
                  };                
    
    tween_Singular = new TWEEN.Tween(initPos);
    tween_Singular.to(finalPos, 900).onUpdate(() =>
    {
        object.position.copy(initPos);
    });
    tween_Singular.start();
}

function rotateCamera(from, to) 
{
    
    let angle = { value: 0 };
    let angleEnd = { value: 0 };
    let normal = new THREE.Vector3();

    normal.copy(from).cross(to).normalize();
    angleEnd.value = from.angleTo(to);
    angle.value = 0;

    tween = new TWEEN.Tween(angle).to(angleEnd, 2000).onUpdate(() => 
    {
        camera.position.copy(from).applyAxisAngle(normal, angle.value);
        camera.lookAt(0, 0, 0);
    });
    tween.start();
}           
function Animate()
{
    if (resizeRendererToDisplaySize(renderer)) 
    {
        canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }
    renderer.render(scene, camera);
    requestAnimationFrame(Animate);
    TWEEN.update();
}
requestAnimationFrame(Animate);

function Text_Setup()
{
    var ctx = document.createElement('canvas').getContext('2d');
    ctx.font = '60pt Helvetica ';
    ctx.fillStyle = "black";
    ctx.textBaseline = 'middle';
    ctx.textAlign = "center";
    ctx.fillText('Bitch!', 200, 44);
    console.log(ctx);
    canvas = ctx.canvas;
    var tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;

    labelMaterial = new THREE.SpriteMaterial({ map: tex, transparent: true});

    label = new THREE.Sprite(labelMaterial);

    //tex.needsUpdate = true;
    mesh_primary[0].add(label);

    label.position.y =  0.9;
    label.position.x =  1;

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
init();
Geometry_setup();
Text_Setup();
FSM_Controller();
Animate();
