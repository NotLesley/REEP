var explorer = false;


function main()
{
    init();
    Geometry_setup();
    Text_Setup();
    
    //let btn = document.getElementById('startbutton');
    /*btn.addEventListener("click", function () {
        if(!gsap.isTweening(camera.position)){
            gsap.to(camera.position,{
              duration: 1,
              z: explorer ? 30 : 15,
              ease: "power3.inOut",
            })
            btn.innerHTML = explorer ? "start exploring" : "go back";
            explorer = !explorer;
          }
      });*/

}
main();


function OnMouseClick(event)
{
   
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(scene.children, true);//returns array of object that mouse in intersecting with
    for(let i = 0; i < intersects.length; i++)
    {
        tl.timeScale(1);

        switch(state)
        {
            case 0:
            if(intersects[i].object.name == 'sun')//no primary orbits have been selected in this state
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
            if(substate == 1) //only the primary orbits are expanded
            {
                nam = intersects[i].object.name;
                //console.log(name);
                if (nam >= 0 && nam <= 7)
                {
                    state = 1;
                    substate = nam;
                    FSM_Update(state, substate);
                }
            }
            break;
                case 1:
                    console.log(nam);
                    console.log(substate);
                    nam = intersects[i].object.name;
                    
                    if (nam >= 0 && nam <= 7)
                    {
                        substate = nam;
                        FSM_Update(state, substate);
                    }
            break;
        }
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
            
            switch(subzone)    //expand and rotate primary orbs
            {
                case 0:
                    if (!expand[0])
                    {
                        expand[0] = true;
                        temp = new THREE.Vector3(-pos[0].x/(10*pos[0].x), pos[0].y*0.0001, pos[0].z/(20*pos[0].z));
                        rot_02 = new THREE.Euler(0, -30*Math.PI/180, -5*Math.PI/180, 'XYZ');
                        Orb_Tween(mesh_sun, temp, 0.1, 100, true);
                        Tween_Rotation(mesh_sun, rot_prev, rot_02);
                        rot_prev = rot_02;
                        Orb_Tween(mesh_primary[0], pos[0], 2, 4, false);
                        Primary_tween(2, 1.4, 0);
                        //SecondaryTextSetup();
                        Expanda(0, 20);
                    }
                    else 
                    {
                        expand[0] = false;
                        Expanda(0, 1/20);
                        Orb_Tween(mesh_primary[0], pos[0], 4, 1.4);
                    }
                break;
                case 1:
                    if (!expand[1])
                    {
                        expand[1] = true;
                        temp = new THREE.Vector3(pos[1].x/(10*pos[1].x), -pos[1].y*0.02, -pos[1].z/(30*pos[1].z));
                        rot_12 = new THREE.Euler(-40*Math.PI/180, 15*Math.PI/180, 0, 'XYZ');
                        Tween_Rotation(mesh_sun, rot_prev, rot_12, true);
                        Orb_Tween(mesh_sun, temp, 0.1, 100, true);
                        Orb_Tween(mesh_primary[1], pos[1], 2, 2, false);
                        Primary_tween(2, 1.4, 1);
                        Expanda(1, 20);
                    }
                    else 
                    {
                        expand[1] = false;
                        Expanda(1, 1/20);
                        Orb_Tween(mesh_primary[1], pos[1], 2, 1.4);
                    }
                    
    

                break;
                case 2:
                    if (!expand[2])
                    {
                        expand[2] = true;
                        temp = new THREE.Vector3(pos[2].x/(10*pos[2].x), -pos[2].y*0.02, -pos[2].z/(30*pos[2].z));
                        rot_22 = new THREE.Euler(60*Math.PI/180, 5*Math.PI/180, 0, 'XYZ');
                        Tween_Rotation(mesh_sun, rot_prev, rot_22, true);
                        Orb_Tween(mesh_sun, temp, 0.1, 100, true);
                        Orb_Tween(mesh_primary[2], pos[2], 2, 2, false);
                        Primary_tween(2, 1.4, 2);
                        Expanda(2, 20);
                    }
                    else 
                    {
                        expand[2] = false;
                        Expanda(2, 1/20);
                        Orb_Tween(mesh_primary[2], pos[2], 2, 1.4);
                    }
                    
                break;
                case 3:
                    if (!expand[3])
                    {
                        expand[3] = true;
                        temp = new THREE.Vector3(pos[3].x/(10*pos[2].x), -pos[3].y*0.03, -pos[3].z/(30*pos[3].z));
                        rot_32 = new THREE.Euler(20*Math.PI/180, 0*Math.PI/180, 40*Math.PI/180, 'XYZ');
                        Tween_Rotation(mesh_sun, rot_prev, rot_32, true);
                        Orb_Tween(mesh_sun, temp, 0.1, 100);
                        Orb_Tween(mesh_primary[3], pos[3], 2, 3, false);
                        Primary_tween(2, 1.4, 3);
                        Expanda(3, 20);
                    }
                    else 
                    {
                        expand[3] = false;
                        Expanda(3, 1/20);
                        Orb_Tween(mesh_primary[3], pos[3], 3, 1.4);
                    }
                    

                break;
                case 4:
                    if (!expand[4])
                    {
                        expand[4] = true;
                        temp = new THREE.Vector3(pos[4].x/(10*pos[2].x), -pos[4].y*0.05, -pos[4].z/(20*pos[4].z));
                        rot_42 = new THREE.Euler(-20*Math.PI/180, 0, 0, 'XYZ');
                        Tween_Rotation(mesh_sun, rot_prev, rot_42, true);
                        Orb_Tween(mesh_sun, temp, 0.1, 100);
                        Orb_Tween(mesh_primary[4], pos[4], 2, 3, false);
                        Primary_tween(2, 1.4, 4);
                        Expanda(4, 20);
                    }
                    else 
                    {
                        expand[4] = false;
                        Expanda(4, 1/20);
                        Orb_Tween(mesh_primary[4], pos[4], 3, 1.4);
                    }
                    
                break;
                case 5: 
                if (!expand[5])
                {
                    expand[5] = true;
                    temp = new THREE.Vector3(pos[5].x/(10*pos[2].x), -pos[5].y*0.05, -pos[5].z/(20*pos[5].z));
                    rot_52 = new THREE.Euler(0, -20*Math.PI/180, 0, 'XYZ');
                    Tween_Rotation(mesh_sun, rot_prev, rot_52, true);
                    rot_prev = rot_52;
                    Orb_Tween(mesh_sun, temp, 0.1, 100, true);
                    Orb_Tween(mesh_primary[5], pos[5], 2, 3, false);
                    Primary_tween(2, 1.4, 5);
                    Expanda(5, 20);
                }
                else 
                {
                    expand[5] = false;
                    Expanda(5, 1/20);
                    Orb_Tween(mesh_primary[5], pos[5], 3, 1.4);
                }
                    
                break;
                default:
                break;
            }
        break;
        case 2: 
            switch(subzone)
            {
                case 1:
            }    
           
        break;
    }
    
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

function Expanda(primary_orb, scalar)
{
    for (let i = 0; i < 8; i++)
    {
        sec_pos[primary_orb][i].multiplyScalar(scalar);
        tl.to(secondary[primary_orb][i].position, 0.3, {x: (sec_pos[primary_orb][i].x),
                                                    y: (sec_pos[primary_orb][i].y),
                                                    z: (sec_pos[primary_orb][i].z),
                                                    ease: Elastic.easeOut.config(3, 3)
                                                    });
    }
}
FSM_Controller();
Animate();
