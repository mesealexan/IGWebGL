define(["events", "animate", "particleSystem", "materials", "animationHandler", "underscore", "tween"],
    function(events, animate, particleSystem, materials, animationHandler, underscore, tween){
    var neat = {};
    var stagesTime = { sun1: 5000, rain: 10000, sun2: 15000, final: 15000 };

    neat.folderName = "neat";
    neat.assetNames = ['House', 'Floor_grid', 'Floor_grass', 'Sky_plane', 'Window_symbols',
    'Glass_neat', 'Glass_standard', 'Cardinal_bird_animated'];
    neat.soundNames = [];
    neat.onStartFunctions = {};
    neat.onLoadFunctions = {};
    neat.onFinishLoadFunctions = {};
    neat.onUnloadFunctions = {};
    neat.animationHandlers = {};
    neat.timeouts = {};
    neat.assets = {};

    /***on start functions***/
    neat.onStartFunctions.addLights = function(scene){
        neat.assets.ambientLight = new THREE.AmbientLight(0xffffff);
        scene.add(neat.assets.ambientLight);

        var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.2 );
        directionalLight.position.set( 0.894, 0,  0.446 );
        directionalLight.castShadow = true;
        var shadowCam = 50000;
        directionalLight.shadowCameraRight = shadowCam;
        directionalLight.shadowCameraLeft = -shadowCam;
        directionalLight.shadowCameraTop = shadowCam;
        directionalLight.shadowCameraBottom = -shadowCam;
        scene.add( directionalLight );

        neat.assets.sun = new sun(scene);
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
        neat.assets.Glass_standard_Rain.material = new materials.NeatRain({maxOpac: 0.3});
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
      neat.assets.Glass_neat_Rain.material = new materials.NeatRain({maxOpac: 0.2});
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
          function(){ onCameraComplete(scene) }, animate.Animate);
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

    neat.onUnloadFunctions.stopTimeouts = function(){
      for (var key in neat.timeouts)
        if (neat.timeouts.hasOwnProperty(key))
          clearTimeout(neat.timeouts[key]);
    };

    function onCameraComplete(scene){
      animate.camera.near = 1;
      animate.camera.updateProjectionMatrix();
      neat.assets.scene = scene;

      //neat.assets.Glass_neat_Dirt.material.Clean({minDirt: 0.01, keepOpac: true});
      states.curState = undefined;
      states.dirt.start();
      neat.timeouts.sun1 = setTimeout(function(){ states.sun.start(); }, stagesTime.sun1);
      neat.timeouts.rain = setTimeout(function(){ states.rain.start(); }, stagesTime.rain);
      neat.timeouts.sun2 = setTimeout(function(){ states.sun.start(); }, stagesTime.sun2);
      neat.timeouts.final = setTimeout(function(){
        neat.buttons.sun.add();
        neat.buttons.rain.add();
        neat.buttons.dirt.add();
      }, stagesTime.final);
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
            if(curState == "sun") return;
            ret.stop("sun");
            neat.assets.sun.lightUp();
            neat.assets.sun.tweenColor("sun");
            neat.assets.sun.tweenAmbiental("normalAmb");
          },
          stop: function(){
            //neat.assets.sun.lightDown();
          }
        }
        ,
        rain:{
          start: function(){
            if(curState == "rain") return;
            ret.stop("rain");
            //possible raindrop locations between these values
            var neatRaindropsPos = {
              xMin:-240, xMax:-180,
              yMin: 460, yMax: 600};

            var standardRaindropsPos = {
              xMin:-310, xMax:-250,
              yMin: 460, yMax: 600};

            //start rain particle system
            neat.assets.rainPS.Init(neat.assets.scene);

            //start rain materials (standard window only starts once)
            neat.assets.Glass_standard_Rain.material.Start({startOnce: true});
            neat.assets.Glass_neat_Rain.material.Start();

            //add a new rainDrops object every rain state to neat window
            neat.assets.Glass_neat_Rain.rainDrops = new rainDrops(
              { scene: neat.assets.scene, pos: neatRaindropsPos }
            );
            animate.updater.addHandler(neat.assets.Glass_neat_Rain.rainDrops);

            //only add new rainDrops object to standard, it never cleans
            if(!neat.assets.Glass_standard_Rain.rainDrops){
              neat.assets.Glass_standard_Rain.rainDrops = new rainDrops(
                { scene: neat.assets.scene, pos: standardRaindropsPos }
              );
              animate.updater.addHandler(neat.assets.Glass_standard_Rain.rainDrops);
            }
            //if it already spawned, just start it. will stop anyway if at max raindrops
            else neat.assets.Glass_standard_Rain.rainDrops.start();
            neat.assets.sun.lightUp();
            neat.assets.sun.tweenColor("rain");
            neat.assets.sun.tweenAmbiental("rainAmb");
          },
          stop: function(){
            //stop rain particle system
            neat.assets.rainPS.Stop();
            //clean materials and raindrops if present
            neat.assets.Glass_neat_Rain.material.Clean();
            if(neat.assets.Glass_neat_Rain.rainDrops)
            neat.assets.Glass_neat_Rain.rainDrops.clean();
            if(neat.assets.Glass_standard_Rain.rainDrops)
            neat.assets.Glass_standard_Rain.rainDrops.stop();
          }
        }
        ,
        dirt:{
          start: function(){
            if(curState == "dirt") return;
            ret.stop("dirt");
            neat.assets.leavesPS.Init(neat.assets.scene);
            neat.assets.Glass_standard_Dirt.material.Start({startOnce: true});
            neat.assets.Glass_neat_Dirt.material.Start();
            neat.assets.sun.lightDown();
            neat.assets.sun.tweenAmbiental("normalAmb");
          },
          stop: function(){
            neat.assets.leavesPS.Stop();
            neat.assets.Glass_neat_Dirt.material.Clean();
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
            num: 50,
            size: {w: 20, h: 20},
            mapNames: ["Leaf_1_diff", "Leaf_2_diff", "Leaf_3_diff"],
            pos: new THREE.Vector3(100, 250, 500),
            dir: new THREE.Vector3(-1, -0.5, 0),
            speed: 6,
            rot: {x: Math.PI / 100, y: Math.PI / 100, z: Math.PI / 100},
            rndRotInit: true
        };

        var rainSettings = {
            width: 500,
            height: 500,
            depth: 150,
            num: 1000,
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

    function rainDrops(s) {
      var _this = this;
      this.interval = 15;
      this.maxNum = 300;
      this.curNum = 0;
      this.maxDrop = 1;
      this.minDrop = 0.85;
      this.mat = materials.setMaterials("cardinal", {name:"Glass"});
      this.lastT = _.now();
      this.curT = 0;
      this.scene = s.scene;
      this.pos = s.pos;
      this.drops = [];

      this.update = function () {
        if(this.curNum >= this.maxNum){
          animate.updater.removeHandler(this);
          return;
        }
        this.curT = _.now();
        if(this.curT - this.lastT > this.interval){
          this.lastT = _.now();
          this.makeDrop();
        }
      };

      this.makeDrop = function () {
        var curRad = _.random(this.minDrop, this.maxDrop);
        var sphere = new THREE.Mesh( new THREE.SphereGeometry(curRad, 6, 6 ), this.mat.clone());
        sphere.scale.z = 0.1;
        sphere.material.opacity = 0;
        sphere.position.set(_.random(this.pos.xMin, this.pos.xMax),
                            _.random(this.pos.yMin, this.pos.yMax), 366.287);
        sphere.yPos = sphere.position.y;

        var tween = new TWEEN.Tween(sphere.material);
          tween.to({ opacity: 1 }, 100);
          tween.start();

        this.curNum++;
        this.scene.add( sphere );
        this.drops.push(sphere);
      };

      this.start = function () {
        animate.updater.addHandler(this);
      };

      this.stop = function () { animate.updater.removeHandler(this); };

      this.clean = function () {
        var _this = this;
        this.stop();
        var totalClean = 6000;
        var drops = _.sortBy(this.drops, 'yPos')
        _.each( drops, function(sphere, i) {
          var tweenDown = new TWEEN.Tween(sphere.material);
              tweenDown.to({ opacity: 0 }, 1000);
              tweenDown.delay(totalClean - ((totalClean / drops.length) * i));
              tweenDown.onComplete(function () {
                _this.scene.remove(sphere);
              });
              tweenDown.start();
        });
      };
    }

    function sun(scene) {
      var _this = this;
      this.tweenTime = 2000;
      this.colors = {
        sun: {r: 253, g: 184, b: 19},//0xfdb813,
        rain: {r: 100, g: 100, b: 200},
        dirt: {r: 0, g: 0, b: 0},
        rainAmb: {r: 170, g: 170, b: 200},
        normalAmb: {r: 255, g: 255, b: 255}
      };
      this.spotLight = new THREE.SpotLight( new THREE.Color( 0, 0, 0 ), 0 );
      this.spotLight.distance = 5500;
      this.ambiental = neat.assets.ambientLight;
      this.spotLight.position.set(352.959, 603.806, 914.586);
      this.spotLight.angle = Math.PI / 5;
      var target = new THREE.Object3D();
      target.position.set(-240, 500, 300);
      this.spotLight.target = target;
      this.spotLight.target.updateMatrixWorld();

      this.lightUp = function (s) {
        var tweenUpSun = new TWEEN.Tween(_this.spotLight);
        tweenUpSun.to({intensity: 1 }, _this.tweenTime);
        tweenUpSun.start();
      };

      this.lightDown = function () {
        var tweenDown = new TWEEN.Tween(_this.spotLight);
        tweenDown.to({intensity: 0 }, _this.tweenTime);
        tweenDown.start();
      };

      this.tweenColor = function (col) {
        var colTween = new TWEEN.Tween(_this.spotLight.color);
        colTween.to({r: (1 / 255) * this.colors[col].r,
                     g: (1 / 255) * this.colors[col].g,
                     b: (1 / 255) * this.colors[col].b },
                     _this.tweenTime);
        colTween.start();
      };

      this.tweenAmbiental = function (col) {
        var colTween = new TWEEN.Tween(_this.ambiental.color);
        colTween.to({r: (1 / 255) * this.colors[col].r,
                     g: (1 / 255) * this.colors[col].g,
                     b: (1 / 255) * this.colors[col].b },
                     _this.tweenTime);
        colTween.start();
      }

      console.log(this.spotLight)

      scene.add(this.spotLight);
    }

    return neat;
});
