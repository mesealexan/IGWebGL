define(["events", "animate", "particleSystem", "materials", "animationHandler", "underscore", "tween"],
    function(events, animate, particleSystem, materials, animationHandler, underscore, tween){
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
        neat.assets.Glass_standard_Rain = mesh.clone();
        materials.NeatRain.prototype = new THREE.ShaderMaterial();
        neat.assets.Glass_standard_Rain.material = new materials.NeatRain({maxOpac: 0.5});
        loader.scene.add(neat.assets.Glass_standard_Rain);

        neat.assets.Glass_standard_Dirt = mesh.clone();
        materials.NeatGlassDirt.prototype = new THREE.ShaderMaterial();
        neat.assets.Glass_standard_Dirt.material = new materials.NeatGlassDirt({maxDirt: 0.6});
        loader.scene.add(neat.assets.Glass_standard_Dirt);

        neat.assets.Glass_standard_Sun = mesh.clone();
    };

    neat.onLoadFunctions.Glass_neat = function(mesh, loader){
      neat.assets.Glass_neat_Rain = mesh.clone();
      materials.NeatRain.prototype = new THREE.ShaderMaterial();
      neat.assets.Glass_neat_Rain.material = new materials.NeatRain({maxOpac: 0.5});
      loader.scene.add(neat.assets.Glass_neat_Rain);

      neat.assets.Glass_neat_Dirt = mesh.clone();
      materials.NeatGlassDirt.prototype = new THREE.ShaderMaterial();
      neat.assets.Glass_neat_Dirt.material = new materials.NeatGlassDirt({maxDirt: 0.5});
      loader.scene.add(neat.assets.Glass_neat_Dirt);

      neat.assets.Glass_neat_Sun = mesh.clone();
    };

    /***on finish functions***/
    neat.onFinishLoadFunctions.playCamera = function(scene, loader) {
        loader.cameraHandler.play(undefined, undefined,
          function(){onCameraComplete(scene)},
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

    function onCameraComplete(scene){
      animate.camera.near = 1;
      animate.camera.updateProjectionMatrix();
      neat.assets.scene = scene;

      states.dirt.start();
      setTimeout(function(){ states.sun.start(); }, 3000);
      setTimeout(function(){ states.rain.start(); }, 6000);
      setTimeout(function(){ states.sun.start(); }, 9000);
      setTimeout(function(){
        neat.buttons.sun.add();
        neat.buttons.rain.add();
        neat.buttons.dirt.add();
      }, 12000);
    }

    neat.buttons = {
      sun: {
          add: function(){
              events.AddButton({text:"sun", function: states.sun.start, id:"sun"});
          },
          remove: function(){ events.RemoveElementByID("sun"); }
      },
      rain: {
          add: function(){
              events.AddButton({text:"rain", function: states.rain.start, id:"rain"});
          },
          remove: function(){ events.RemoveElementByID("rain"); }
      },
      dirt: {
          add: function(){
              events.AddButton({text:"dirt", function: states.dirt.start, id:"dirt"});
          },
          remove: function(){ events.RemoveElementByID("dirt"); }
      }
    };

    /***private functions***/

    var states = function () {
      var curState = undefined;
      var ret =
      {
        sun:{
          start: function(){
            ret.stop("sun");
          },
          stop: function(){

          }
        }
        ,
        rain:{
          start: function(){
            neat.assets.rainPS.Init(neat.assets.scene);
            neat.assets.Glass_standard_Rain.material.Start({startOnce: true});
            neat.assets.Glass_neat_Rain.material.Start();
            addRainDrops(neat.assets.Glass_neat_Rain);
            ret.stop("rain");
          },
          stop: function(){
            neat.assets.rainPS.Stop();
            neat.assets.Glass_neat_Rain.material.Clean();
          }
        }
        ,
        dirt:{
          start: function(){
            neat.assets.leavesPS.Init(neat.assets.scene);
            neat.assets.Glass_standard_Dirt.material.Start({startOnce: true});
            neat.assets.Glass_neat_Dirt.material.Start();
            ret.stop("dirt");
          },
          stop: function(){
            neat.assets.leavesPS.Stop();
            neat.assets.Glass_neat_Dirt.material.Clean({minDirt: 0.01, keepOpac: true});
          }
        }
        ,
        stop: function (newState) {
          //stops current, argument is new state
          if(curState)ret[curState].stop();
          curState = newState;
        }
      };
      return ret;
    }();

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

        neat.assets.leavesPS = new particleSystem(leavesSettings);
        neat.assets.rainPS = new particleSystem(rainSettings);
    }

    function addRainDrops(){
      var rainDrops = 60;
      var radius = 2;
      var mat = materials.setMaterials("cardinal", {name:"Glass"});
      for (var i = 0; i < rainDrops; i++) {
        var curRad = radius * Math.random();
        var sphere = new THREE.Mesh( new THREE.SphereGeometry(curRad, 6, 6 ), mat.clone());

         sphere.material.opacity = 0;

        sphere.position.set(_.random(-240, -180), _.random(460, 600), 366.287);
        neat.assets.scene.add( sphere );

        var tweenDown = new TWEEN.Tween(sphere.material);
            tweenDown.to({ opacity: 0 }, 2000);

        var tween = new TWEEN.Tween(sphere.material);
          tween.to({ opacity: 1 }, 2000);
          tween.delay(_.random(4000));
          tween.chain(tweenDown);
          tween.start();
      }


    }

    return neat;
});
