define(["animate"], function(animate){
    var LoE = {};

    LoE.folderName = "LoE";
    LoE.onStartFunctions = {};//called on scene start by loader
    LoE.onLoadFunctions = {};//functions called on load complete, MUST be same name as asset
    LoE.assetNames = ['text', 'rail', 'plane', 'rotator', 'window', 'fixed_glass',
        'mobile_glass', 'tambur_a', 'tambur_b'];
    LoE.assets = {};

    /***on start functions***/
    LoE.onStartFunctions.addLights = function(scene){
        scene.add( new THREE.AmbientLight( 0x999999 ) );

        var light1 = new THREE.PointLight( 0xffffff, 1, 10000 );
        light1.position.set( -12170,1063,-2025 );
        scene.add( light1 );

        var light2 = new THREE.PointLight( 0xffffff, 1, 10000 );
        light2.position.set( -4870,-163,-2469 );
        scene.add( light2 );

        var spotLight = new THREE.SpotLight( 0xffffff );
        spotLight.position.set( 18398, 13569, 17048 );
        spotLight.intensity = 1;
        scene.add( spotLight );
    };
    /***end on start functions***/

    /***on load functions***/
    LoE.onLoadFunctions.tambur_a = function(mesh){
        LoE.assets.tambur_a = mesh;
    };

    LoE.onLoadFunctions.tambur_b = function(mesh, loader){
        var tambur_a_pos = loader.ParseJSON('media/models/LoE/tambur_a_pos.JSON');
        var tambur_b_pos = loader.ParseJSON('media/models/LoE/tambur_b_pos.JSON');

        for (var i = 0; i < 29; i++) {
            var newTambur_a = new THREE.Mesh(mesh.geometry.clone(), mesh.material);
            var newTambur_b = new THREE.Mesh(LoE.assets.tambur_a.geometry.clone(), mesh.material);

            var curPos_a = tambur_a_pos.positions[i];
            var newTambur_a_pos = new THREE.Vector3(
                curPos_a.position.x, curPos_a.position.z, -curPos_a.position.y);

            var curPos_b = tambur_b_pos.positions[i];
            var newTambur_b_pos = new THREE.Vector3(
                curPos_b.position.x, curPos_b.position.z, -curPos_b.position.y);

            newTambur_a.position.copy(newTambur_a_pos);
            newTambur_b.position.copy(newTambur_b_pos);

            mesh.add(newTambur_a);
            mesh.add(newTambur_b);
        }
        LoE.assets.tambur_b = mesh;
    };

    LoE.onLoadFunctions.fixed_glass = function(mesh, loader){
        var fixed_window_animation = loader.ParseJSON('media/models/LoE/fixed_glass_anim.JSON');
        animate.updater.addHandler({
            frame: -1,
            update: function(){
                if(++this.frame < fixed_window_animation.frames.length){
                    var curFrame = fixed_window_animation.frames[this.frame];
                    mesh.position.set(curFrame.position.x,curFrame.position.z,curFrame.position.y);
                }else animate.updater.removeHandler(this);
            }
        });
    };

    LoE.onLoadFunctions.mobile_glass = function(mesh, loader){
        var mobile_window_animation = loader.ParseJSON('media/models/LoE/mobile_glass_anim.JSON');
        animate.updater.addHandler({
            frame: -1,
            update: function(){
                if(++this.frame < mobile_window_animation.frames.length){
                    var curFrame = mobile_window_animation.frames[this.frame];
                    mesh.position.set(curFrame.position.x,curFrame.position.z,curFrame.position.y);

                    mesh.rotation.setFromQuaternion (
                        new THREE.Quaternion(
                            curFrame.rotation.x, curFrame.rotation.z, -curFrame.rotation.y,
                            curFrame.rotation.w
                        ).normalize());
                }else animate.updater.removeHandler(this);
            }
        });
    };

    LoE.onLoadFunctions.window = function(mesh, loader){
        var window_animation = loader.ParseJSON('media/models/LoE/window_animation.JSON');
        animate.updater.addHandler({
            frame: -1,
            update: function(){
                if(++this.frame < window_animation.frames.length){
                    var curFrame = window_animation.frames[this.frame];
                    mesh.position.set(curFrame.position.x,curFrame.position.z,curFrame.position.y);

                    mesh.rotation.setFromQuaternion (
                        new THREE.Quaternion(
                            curFrame.rotation.x, curFrame.rotation.z, -curFrame.rotation.y,
                            curFrame.rotation.w
                        ).normalize());
                }else animate.updater.removeHandler(this);
            }
        });
    };

    /***end on load functions***/

    return LoE;
});