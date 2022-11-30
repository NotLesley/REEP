function Orb_Tween(object, position, startScalar, endScalar, recenter)
{
    let center_pos = {x: 0,
                      y: 0, 
                      z: 0
                     };

    let init_pos = {x: position.x*startScalar,
                    y: position.y*startScalar,
                    z: position.z*startScalar
                    };

    let final_pos = {x: position.x*endScalar,
                     y: position.y*endScalar,
                     z: position.z*endScalar
                    };

    let tween_center_pos = new TWEEN.Tween(init_pos).to(center_pos).onUpdate(() =>
    {
        object.position.copy(init_pos)
    });
    let tween_singular = new TWEEN.Tween(center_pos).to(final_pos, 1000).onUpdate(() =>
    {
        object.position.copy(center_pos);
    });

    if (recenter)
    {
        tween_center_pos.chain(tween_singular);
        tween_center_pos.start();
    }
    else
    {
        let tween_singular = new TWEEN.Tween(init_pos).to(final_pos, 1000).onUpdate(() =>
        {
            object.position.copy(init_pos);
        });
        tween_singular.start();
    } 

}


function Tween_Rotation(obj, prev_euler, end_euler)
{
    let center_rot = {isEuler: true,
                      _order: 'XYZ', 
                      _x: 0,
                      _y: 0,
                      _z: 0
                    };

    let init_rot = {isEuler: true,
                   _order: prev_euler.order,
                   _x: prev_euler.x,
                   _y: prev_euler.y,
                   _z: prev_euler.z
                  };

    let final_rot = {isEuler: true,
                    _order: end_euler.order,
                    _x: end_euler.x,
                    _y: end_euler.y,
                    _z: end_euler.z
                    };

    let tween_center_rot = new TWEEN.Tween(init_rot).to(center_rot, 1000).onUpdate(() =>
    {
        init_rot._order = 'XYZ';
        obj.setRotationFromEuler(init_rot);
    });

    let tween_rot = new TWEEN.Tween(center_rot).to(final_rot, 1000).onUpdate(() =>
    {
        center_rot._order = 'XYZ';
        obj.setRotationFromEuler(center_rot);
    });

    tween_center_rot.chain(tween_rot);
    tween_center_rot.start();

}

function Primary_tween(startScalar, endScalar, orb)
{
    for (let i = 0; i < 6; i++)
    {
        if(i == orb && orb == 5) break;
        if(i == orb) i++;
        let startPos = {x: pos[i].x*startScalar, 
                        y: pos[i].y*startScalar, 
                        z: pos[i].z*startScalar};  

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