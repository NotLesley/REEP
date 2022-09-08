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
            SecondaryTextSetup();
            for (let i = 0; i < 8; i++)
            {
                tl_pos[i].multiplyScalar(20);
                tl.to(tl_secondary[i].position, 0.3, {x: (tl_pos[i].x),
                                                            y: (tl_pos[i].y),
                                                            z: (tl_pos[i].z),
                                                            ease: Elastic.easeOut.config(3, 3)
                                                            });
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





FSM_Controller();
Animate();
