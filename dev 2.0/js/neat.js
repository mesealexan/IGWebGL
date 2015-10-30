define(["events", "animate", "particleSystem", "materials", "animationHandler"],
    function(events, animate, particleSystem, materials, animationHandler){
    var neat = {};

    neat.folderName = "neat";
    neat.assetNames = ['House', 'Floor_grid', 'Floor_grass', 'Sky_plane', 'Window_symbols',
    'Glass_neat', 'Glass_standard', 'Cardinal_bird_animated'];
    neat.soundNames = [];
    neat.onStartFunctions = {};
    neat.onLoadFunctions = {};
    neat.onFinishLoadFunctions = {};
    neat.onUnloadFunctions = {};
    neat.animationHandlers = {};
    neat.assets = {};

    /***on start functions***/
    neat.onStartFunctions.addLights = function(scene){
        scene.add(new THREE.AmbientLight(0xffffff));
        var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.2 );
        directionalLight.position.set( 0.894, 0,  0.446 );
        directionalLight.castShadow = true;
        var shadowCam = 50000;
        directionalLight.shadowCameraRight = shadowCam;
        directionalLight.shadowCameraLeft = -shadowCam;
        directionalLight.shadowCameraTop = shadowCam;
        directionalLight.shadowCameraBottom = -shadowCam;
        scene.add( directionalLight );
    };

    /***on load functions***/
    neat.onLoadFunctions.Cardinal_bird_animated = function(mesh, loader){
      mesh.material.materials[0].morphTargets = true;
      var birdAnim = loader.ParseJSON('media/models/neat/Cardinal_bird_positions.JSON');
      animate.updater.addHandler(new animate.PositionRotationHandler(mesh, birdAnim));

      neat.animationHandlers.ah1 = new animationHandler();
      neat.animationHandlers.ah1.setMesh(mesh);
      neat.animationHandlers.ah1.loop(0, 15);
    };

    neat.onLoadFunctions.House = function(mesh, loader){
        mesh.castShadow = true;
    };

    neat.onLoadFunctions.Floor_grass = function(mesh){
        mesh.receiveShadow = true;
    };

    neat.onLoadFunctions.Glass_standard = function(mesh, loader){
        neat.assets.Glass_standard_clone = mesh.clone();
        neat.assets.Glass_standard_clone.position.z ++;
        loader.scene.add(neat.assets.Glass_standard_clone);
        //todo: remove this
        GlobalFunctions.Glass_standard_clone = neat.assets.Glass_standard_clone;

        materials.NeatGlassDirt.prototype = new THREE.ShaderMaterial();
        neat.assets.Glass_standard_clone.material = new materials.NeatGlassDirt({maxDirt: 0.6});
        //materials.NeatRain.prototype = new THREE.ShaderMaterial();
        //neat.assets.Glass_standard_clone.material = new materials.NeatRain({maxOpac: 0.5});
    };

    neat.onLoadFunctions.Glass_neat = function(mesh, loader){
        materials.NeatGlassDirt.prototype = new THREE.ShaderMaterial();
        neat.assets.Glass_neat_clone = mesh.clone();
        neat.assets.Glass_neat_clone.position.z ++;
        neat.assets.Glass_neat_clone.material =
            new materials.NeatGlassDirt({maxDirt: 0.2});
        //todo: remove this
        GlobalFunctions.Glass_neat_clone = neat.assets.Glass_neat_clone;

        loader.scene.add(neat.assets.Glass_neat_clone);
    };

    /***on finish functions***/
    neat.onFinishLoadFunctions.playCamera = function(scene, loader) {
        loader.cameraHandler.play(undefined, undefined,
            function(){
                animate.camera.near = 1;
                animate.camera.updateProjectionMatrix();

                neat.assets.rain.Init(scene);
                neat.assets.leaves.Init(scene);

                neat.assets.Glass_standard_clone.material.Start();
                neat.assets.Glass_neat_clone.material.Start();

            },
            animate.Animate);
    };

    neat.onFinishLoadFunctions.pause = function(scene, loader){
        //setTimeout(function(){ loader.cameraHandler.pause(); }, 3500);
    };

    neat.onFinishLoadFunctions.addControls = function(){
        events.AddControls();
        events.ToggleControls(false);
    };

    neat.onFinishLoadFunctions.increaseCamNear = function(){
        animate.camera.near = 500;
        animate.camera.updateProjectionMatrix();
    };

    neat.onFinishLoadFunctions.addParticles = function(scene){
        addParticles(scene);
    };

    /***on unload functions***/
    neat.onUnloadFunctions.resetCamNear = function(){
        animate.camera.near = 1;
        animate.camera.updateProjectionMatrix();
    };

    function addParticles(scene){
        var leavesSettings = {
            width: 500,
            height: 500,
            depth: 50,
            num:15,
            size: {w: 20, h: 20},
            mapNames: ["Leaf_1_diff", "Leaf_2_diff", "Leaf_3_diff"],
            pos: new THREE.Vector3(100, 250, 500),
            dir: new THREE.Vector3(-1, -0.5, 0),
            speed: 12,
            rot: {x: Math.PI / 100, y: Math.PI / 100, z: Math.PI / 100},
            rndRotInit: true
        };

        var rainSettings = {
            width: 500,
            height: 500,
            depth: 150,
            num:200,
            size: {w: 0.5, h: 8},
            rndSizeVariation: 0.25,
            mapNames: ["water_drop"],
            pos: new THREE.Vector3(-300, 250, 500),
            dir: new THREE.Vector3(-0.6, -1, 0),
            speed: 20
        };

        neat.assets.leaves = new particleSystem(leavesSettings);
        neat.assets.rain = new particleSystem(rainSettings);
    }

    return neat;
});
