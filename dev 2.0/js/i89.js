define(["animationHandler", "snowHandler"], function(animationHandler, snowHandler){
    var i89 = {};
    i89.folderName = "i89";
    i89.onStartFunctions = {};//called on scene start by loader
    i89.onLoadFunctions = {};//called on load complete, MUST be same name as asset
    i89.animationHandlers = {};
    i89.snowHandlers = {};

    i89.assetNames = ['floor', 'walls', 'snow', 'bck', 'grid', 'heat_source',
        'text', 'winterNight', 'winterNight', 'moon', 'logo', 'frame', 'i89',
        'window_plane', 'heat_wave', 'heat_wave_refract', 'heat_wave_reflect'];

    /***on start functions***/
    i89.onStartFunctions.addSnow = function(scene){
        var sh1 = new snowHandler({posX: 0, posY: -200, width: 400, depth: 400, num: 500});
        var sh2 = new snowHandler({posX: 190, posY: 250, width: 100, depth: 500, num: 400});
        var sh3 = new snowHandler({posX: 0, posY: 600, width: 400, depth: 400, num: 500});
        sh1.start(scene);
        sh2.start(scene);
        sh3.start(scene);
    };

    i89.onStartFunctions.addLights = function(scene){
        scene.add(new THREE.AmbientLight(0xffffff));
        var spotLight = new THREE.SpotLight(0xb99bfd);
        spotLight.position.set(980, 1049, -656);
        spotLight.target.position.set(34, 0, 85);
        scene.add( spotLight );
    };
    /***end on start functions***/

    /***on load functions***/
    i89.onLoadFunctions.bck = function(mesh){
        var bck2 = mesh.clone();
        bck2.material.side = THREE.DoubleSide;
        bck2.scale.z = -1;
        bck2.quaternion.set ( 0, 1, 0, 0);
        mesh.add(bck2);
    };

    i89.onLoadFunctions.heat_wave = function(mesh){
        var heat_wave2 = mesh.clone();
        var heat_wave3 = mesh.clone();
        mesh.visible =
            heat_wave2.visible =
                heat_wave3.visible = false;
        mesh.frustumCulled =
            heat_wave2.frustumCulled =
                heat_wave3.frustumCulled = false;
        heat_wave2.position.x += 26;
        heat_wave3.position.x += 46;
        mesh.add(heat_wave2);
        mesh.add(heat_wave3);
        i89.animationHandlers.ah1 = new animationHandler();
        i89.animationHandlers.ah1.setMesh([mesh, heat_wave2, heat_wave3]);
    };

    i89.onLoadFunctions.heat_wave_refract = function(mesh){
        mesh.visible = false;
        mesh.position.x += 4;
        i89.animationHandlers.ah2 = new animationHandler();
        i89.animationHandlers.ah2.setMesh(mesh);
    };

    i89.onLoadFunctions.heat_wave_reflect = function(mesh){
        var heat_wave_reflect2 = mesh.clone();
        var heat_wave_reflect3 = mesh.clone();
        mesh.add(heat_wave_reflect2);
        mesh.add(heat_wave_reflect3);
        i89.animationHandlers.ah3 = new animationHandler();
        i89.animationHandlers.ah3.setMesh([mesh, heat_wave_reflect2, heat_wave_reflect3]);
    };

    i89.onLoadFunctions.window_plane = function(mesh){
        mesh.position.z = 0;
    };
    /***on end load functions***/

    return i89;
});