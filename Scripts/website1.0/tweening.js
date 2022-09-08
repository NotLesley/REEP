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
    
    let tween_Singular = new TWEEN.Tween(initPos);
    tween_Singular.to(finalPos, 900).onUpdate(() =>
    {
        object.position.copy(initPos);
    });
    tween_Singular.start();
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

        let tween2 = new TWEEN.Tween(startPos);
        tween2.to(endPos, 500).onUpdate(() =>
        {
            mesh_primary[i].position.copy(startPos);
        });
        tween2.start();
    }
    
}

function rotateCamera(from, to) 
{
    
    let angle = { value: 0 };
    let angleEnd = { value: 0 };
    let normal = new THREE.Vector3();

    normal.copy(from).cross(to).normalize();
    angleEnd.value = from.angleTo(to);
    angle.value = 0;

    let tween = new TWEEN.Tween(angle).to(angleEnd, 2000).onUpdate(() => 
    {
        camera.position.copy(from).applyAxisAngle(normal, angle.value);
        camera.lookAt(0, 0, 0);
    });
    tween.start();
}           