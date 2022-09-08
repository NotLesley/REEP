var scene, camera, renderer, raycaster;
var geometry, material;
var controls;
var mouse;
var state, substate;
var tl = new TimelineMax();

function init()
{
    scene = new THREE.Scene();
    const loader = new THREE.TextureLoader();
    const bgTexture = loader.load('media/background01.jpg');
    scene.background = new THREE.Color(0xdddddd);
    camera = new THREE.PerspectiveCamera(85, window.innerWidth/window.innerHeight, 0.001, 1000);
    raycaster = new THREE.Raycaster(); //Raycaster tracks the loacation of the cursor and which object reacts to the event
    var canvas = document.querySelector('#c');
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
        pos[i].multiplyScalar(0.8);
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

function Text_Setup()
{
    var ctx = document.createElement('canvas').getContext('2d'); 
    ctx.canvas.width = 256;
    ctx.canvas.height = 256;
    ctx.font = '44pt Bartkey';
    ctx.fillStyle = "black";
    ctx.textBaseline = 'middle';
    ctx.fillText("Teaching", 0, 45);
    ctx.fillText("    &",0 , 90);
    ctx.fillText("Learning", 0, 135);
    
    var tex = new THREE.CanvasTexture(ctx.canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;

    labelMaterial = new THREE.SpriteMaterial({ map: tex, transparent: true});
    label = new THREE.Sprite(labelMaterial);

    label.scale.set(3, 3, 1)
    tex.needsUpdate = true;

    mesh_primary[0].add(label);

    label.position.y =  1;
    label.position.x =  3;
    label.position.z =  1;
}

function SecondaryTextSetup()
{
    var ctx_tl = new Array(8);
    var tex_tl = new Array(8);
    var labelMat_tl = new Array(8);
    var label_tl = new Array(8);
    for (let i = 0; i < 8; i++)
    {
        ctx_tl[i] = document.createElement('canvas').getContext('2d'); 
        ctx_tl[i].canvas.width = 256;
        ctx_tl[i].canvas.height = 256;
        ctx_tl[i].font = '44pt Bartkey';
        ctx_tl[i].fillStyle = "black";
        ctx_tl[i].textBaseline = 'middle';
    } 
    Fill(ctx_tl[0], "Conceptual", "Engagement", "");
    Fill(ctx_tl[1], "Fliped", "Classroom", "");
    Fill(ctx_tl[2], "Project", "Based", "Learning");
    Fill(ctx_tl[3], "CAS", "", "");
    Fill(ctx_tl[4], "COP", "", "");
    Fill(ctx_tl[5], "FYE", "", "");
    Fill(ctx_tl[6], "LEA", "", "");
    Fill(ctx_tl[7], "SUP", "", "");

    for (let i = 0; i < 8; i++)
    {
        tex_tl[i] = new THREE.CanvasTexture(ctx_tl[i].canvas);
        tex_tl[i].minFilter = THREE.LinearFilter;
        tex_tl[i].wrapS = THREE.ClampToEdgeWrapping;
        tex_tl[i].wrapT = THREE.ClampToEdgeWrapping;

        labelMat_tl[i] = new THREE.SpriteMaterial({ map: tex_tl[i], transparent: true});
        label_tl[i] = new THREE.Sprite(labelMat_tl[i]);
        
        label_tl[i].scale.set(3, 3, 1);

        label_tl[i].position.y =  1;
        label_tl[i].position.x =  3;
        label_tl[i].position.z =  1;

        tl_secondary[i].add(label_tl[i]);

    }

}

function Fill(tx, text1, text2, text3)
{
    tx.fillText(text1, 0, 45);
    tx.fillText(text2,0 , 90);
    tx.fillText(text3, 0, 135);
}

function resizeRendererToDisplaySize(renderer) 
{
    canvas = renderer.domElement;
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}
