var scene, camera, renderer, raycaster;
var geometry, material;
var controls;
var mouse;
var state, substate;
var expand = new Array(6);
var tl = new TimelineMax();
var nam = 'x';
var rot_prev = new THREE.Euler(0, 0, 0, 'XYZ');
var wait = 1000;
var start_rot_tween = true

function init()
{
    scene = new THREE.Scene();
    const loader = new THREE.TextureLoader();
    const bgTexture = loader.load('media/background01.jpg');
    scene.background = new THREE.Color(0xdddddd);
    camera = new THREE.PerspectiveCamera(100, window.innerWidth/window.innerHeight, 0.0001, 10000);
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

    //Finite state machine 
    state = 0;
    substate = 0;
    
    for (i = 0; i < 6; i++)
    {
        expand[i] = false;
    }


}

function Geometry_setup()
{
    sphere_geometry = new THREE.SphereGeometry(1, 100, 100);
    sphere_material = new THREE.MeshLambertMaterial({color: 0xffffff});
    tl_mat = new THREE.MeshLambertMaterial({color: 0x27c957});
    ck_mat = new THREE.MeshLambertMaterial({color: 0x125fce});
    ass_mat = new THREE.MeshLambertMaterial({color: 0xff1f4c});
    se_mat = new THREE.MeshLambertMaterial({color: 0xd9ee00});
    tp_mat = new THREE.MeshLambertMaterial({color: 0x8e8e8e});
    ps_mat = new THREE.MeshLambertMaterial({color: 0x9852e6});


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
    mesh_primary[0] = new THREE.Mesh(sphere_geometry, tl_mat);
    mesh_primary[1] = new THREE.Mesh(sphere_geometry, ass_mat);
    mesh_primary[2] = new THREE.Mesh(sphere_geometry, se_mat);
    mesh_primary[3] = new THREE.Mesh(sphere_geometry, tp_mat);
    mesh_primary[4] = new THREE.Mesh(sphere_geometry, ps_mat);
    mesh_primary[5] = new THREE.Mesh(sphere_geometry, ck_mat);

    secondary = new Array(6);

    for (let i = 0; i < 8; i++)
    {
        secondary[i] = new Array(8);
    }

    for (let k = 0; k < 6; k++)
    {
        for (let i = 0; i < 8; i++)
        {
            switch(k)
            {
                case 0:
                    secondary[k][i] = new THREE.Mesh(sphere_geometry, tl_mat); 
                    break;
                case 1:
                    secondary[k][i] = new THREE.Mesh(sphere_geometry, ass_mat); 
                    break;
                case 2:
                    secondary[k][i] = new THREE.Mesh(sphere_geometry, se_mat); 
                    break;
                case 3:
                    secondary[k][i] = new THREE.Mesh(sphere_geometry, tp_mat); 
                    break;
                case 4: 
                    secondary[k][i] = new THREE.Mesh(sphere_geometry, ps_mat); 
                    break;
                case 5:
                    secondary[k][i] = new THREE.Mesh(sphere_geometry, ck_mat); 
                    break;
            }   
            secondary[k][i].scale.set(0.5, 0.5, 0.5);
        }
    }
    
    //-------------------------Resizing--------------------------------

    mesh_primary[0].scale.set(0.7, 0.7, 0.7);
    mesh_primary[1].scale.set(0.4, 0.4, 0.4);
    mesh_primary[2].scale.set(0.5, 0.5, 0.5);
    mesh_primary[3].scale.set(0.4, 0.4, 0.4);
    mesh_primary[4].scale.set(0.6, 0.6, 0.6);
    mesh_primary[5].scale.set(0.6, 0.6, 0.6);


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

    for (let k = 0; k < 6; k++)
    {
        for (let i = 0; i < 8; i++)
        {
            mesh_primary[k].add(secondary[k][i]);
        }
    }
    

    sec_pos = new Array(6);
    sec_rot = new Array(6);

    for (k = 0; k < 6; k++)
    {
        sec_pos[k] = new Array(8);
        sec_rot[k] = new Array(8);
    }

    for (let k = 0; k < 6; k++)
    {
        for(let i = 0; i < 8; i++)
        {
            sec_pos[k][i] = new THREE.Vector3(3, 0, 0);
        }
    }
    
    
    angle = -4*Math.PI/9;

    for (let i = 0; i< 8; i++)
    {
        sec_rot[0][i] = new THREE.Euler(rot[0].x, rot[0].y, rot[0].z + angle, 'XYZ');
        sec_rot[1][i] = new THREE.Euler(rot[1].x, rot[1].y, rot[1].z + angle, 'XYZ');
        sec_rot[2][i] = new THREE.Euler(rot[2].x, rot[2].y, rot[2].z + angle, 'XYZ');
        sec_rot[3][i] = new THREE.Euler(rot[3].x + Math.PI/4, rot[3].y - Math.PI/4, rot[3].z + angle, 'XYZ');
        sec_rot[4][i] = new THREE.Euler(rot[4].x, rot[4].y, rot[4].z + angle, 'XYZ');
        sec_rot[5][i] = new THREE.Euler(rot[5].x, rot[5].y, rot[5].z + angle, 'XYZ');

        angle += Math.PI/9;
    }
    for (let k = 0; k < 6; k++)
    {
        for (let i = 0; i < 8; i++)
        {
            sec_pos[k][i].applyEuler(sec_rot[k][i]);
            sec_pos[k][i].multiplyScalar(0.1);
            secondary[k][i].position.copy(sec_pos[k][i]);
            
        }
    }
    
   
    //----------------------------Adding to scene------------------------            

    for(let i = 0; i< 6; i++)
    {
        mesh_sun.add(mesh_primary[i]);
    }
    
    //----------------------------Naming---------------------------------

    mesh_sun.name = 'sun';

    for (let i = 0; i < 6; i++)
    {
        mesh_primary[i].name = i; 
    }

}

function Text_Setup()
{
    var ctx = document.createElement('canvas').getContext('2d'); 
    ctx.canvas.width = 256;
    ctx.canvas.height = 256;
    ctx.font = '44pt Poppins';
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
    var ctx = new Array(8);
    var tex = new Array(8);
    var labelMat = new Array(8);
    var label = new Array(8);

    for (let k = 0; k < 6; k++)
    {
        ctx[k] = new Array(8);
    }

    for (let k = 0; k < 6; k++)
    {
        for (let i = 0; i < 8; i++)
        {
            ctx[k][i] = document.createElement('canvas').getContext('2d'); 
            ctx[k][i].canvas.width = 256;
            ctx[k][i].canvas.height = 256;
            ctx[k][i].font = '44pt Poppins';
            ctx[k][i].fillStyle = "black";
            ctx[k][i].textBaseline = 'middle';
        } 
    }
    
    Fill(ctx[0][0], "Conceptual", "Engagement", "");
    Fill(ctx[0][1], "Fliped", "Classroom", "");
    Fill(ctx[0][2], "Project", "Based", "Learning");
    Fill(ctx[0][3], "CAS", "", "");
    Fill(ctx[0][4], "COP", "", "");
    Fill(ctx[0][5], "FYE", "", "");
    Fill(ctx[0][6], "LEA", "", "");
    Fill(ctx[0][7], "SUP", "", "");


    for (k = 0; k < 6; k++)
    {
        for (i = 0; i < 8; i++)
        {
            tex[k][i] = new THREE.CanvasTexture(ctx_tl[i].canvas);
            tex[k][i].minFilter = THREE.LinearFilter;
            tex[k][i].wrapS = THREE.ClampToEdgeWrapping;
            tex[k][i].wrapT = THREE.ClampToEdgeWrapping;

            labelMat[k][i] = new THREE.SpriteMaterial({ map: tex[k][i], transparent: true});
            label[k][i] = new THREE.Sprite(labelMat[k][i]);
            
            label[k][i].scale.set(3, 3, 1);
        }
    }
    for (let i = 0; i < 8; i++)
    {
        label[0][i].position.y =  1;
        label[0][i].position.x =  3;
        label[0][i].position.z =  1;

        secondary[0][i].add(label_tl[i]);

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
