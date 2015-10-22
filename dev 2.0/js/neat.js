define(["events", "animate", "particleSystem"],
    function(events, animate, particleSystem){
    var neat = {};
    neat.folderName = "neat";
    neat.assetNames = ['House', 'Floor_grid', 'Floor_grass', 'Sky_plane', 'Window_symbols',
    'Glass_neat', 'Glass_standard'];
    neat.soundNames = [];
    neat.onStartFunctions = {};
    neat.onLoadFunctions = {};
    neat.onFinishLoadFunctions = {};
    neat.onUnloadFunctions = {};
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
        /*var spotLight = new THREE.SpotLight(0xb99bfd);
        spotLight.position.set(980, 1049, -656);
        spotLight.target.position.set(34, 0, 85);
        scene.add( spotLight );*/
    };

    /***on load functions***/
    neat.onLoadFunctions.House = function(mesh){
        mesh.castShadow = true;
        //mesh.receiveShadow = true;
    };

    neat.onLoadFunctions.Floor_grass = function(mesh){
        mesh.receiveShadow = true;
    };

    /***on finish functions***/
    neat.onFinishLoadFunctions.playCamera = function(scene, loader) {
        loader.cameraHandler.play(undefined, undefined,
            function(){
                animate.camera.near = 1;
                animate.camera.updateProjectionMatrix();

                neat.assets.rain.Init(scene);
                neat.assets.leaves.Init(scene);
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

        GlobalFunctions.rain = neat.assets.rain;
        GlobalFunctions.camera = animate.camera;
    }

    return neat;
});