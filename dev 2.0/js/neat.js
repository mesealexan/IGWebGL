define(["events", "animate", "particleSystem", "materials", "animationHandler", "underscore", "tween", "watch", "audio",
  "callback"],
    function(events, animate, particleSystem, materials, animationHandler, underscore, tween, watch, audio, callback){
    var neat = {
      folderName: "neat",
      assetNames: ['House', 'Floor_grid', 'Floor_grass', 'Sky_plane', 'Window_symbols',
      'Glass_neat', 'Glass_standard', 'Cardinal_bird_animated'],
      soundNames: ['neat-acoustic-guitar', 'neat-cardinal2', 'neat-wind-leaves', 'neat-heavenly-transition',
      'neat-rain-exterior-loop', 'neat-magic-wand'],
      onStartFunctions: {},
      onLoadFunctions: {},
      onFinishLoadFunctions: {},
      onUnloadFunctions: {},
      animationHandlers: {},
      timeouts: {},
      assets: {},
      callbacks:{
        introAnimDone: {
          sampleCall1: function(){ console.log("finished intro animation"); }
        },
        rainStart:{
          sampleCall2: function(){ console.log("started rain"); }
        },
        rainFinish:{
          sampleCall3: function(){ console.log("ended rain"); }
        },
        dirtStart:{
          sampleCall4: function(){ console.log("started dirt"); }
        },
        dirtFinish:{
          sampleCall5: function(){ console.log("ended dirt"); }
        },
        sunStart:{
          sampleCall6: function(){ console.log("started sun"); }
        },
        sunFinish:{
          sampleCall7: function(){ console.log("ended sun"); }
        },
        glintStart:{
          sampleCall8: function(){ console.log("started glint"); }
        },
        glintFinish:{
          sampleCall9: function(){ console.log("ended glint"); }
        }
      }
    }

    var stagesTime = { sun1: 5000, rain: 10000, sun2: 15000, final: 18000 };

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

    neat.onStartFunctions.addRainSheet = function(scene){
        var loader = new THREE.JSONLoader();
        materials.sheetingMat.prototype = new THREE.ShaderMaterial();
        var mat = new materials.sheetingMat();
        materials.sheetingMat.prototype = new THREE.ShaderMaterial();
        var tempMat = new materials.sheetingMat();

        loader.load(neat.mediaFolderUrl+'/models/neat/RainSheet.js', function (geometry) {
        neat.assets.leftSheet = new THREE.Mesh(geometry, mat);
        neat.assets.leftSheet.position.x = -276;
        neat.assets.leftSheet.position.y = 530;
        neat.assets.leftSheet.position.z = 365;
        scene.add(neat.assets.leftSheet);

        neat.assets.rightSheet = new THREE.Mesh(geometry, tempMat);
        neat.assets.rightSheet.position.x = -203;
        neat.assets.rightSheet.position.y = 530;
        neat.assets.rightSheet.position.z = 364.5;
        scene.add(neat.assets.rightSheet);

        neat.animationHandlers.sh = new animationHandler();
        neat.animationHandlers.sh.setMesh(neat.assets.rightSheet);
      });
    };

    neat.onStartFunctions.addFlags = function(){
      neat.assets.didYouSeeTheSun = false;
      neat.assets.timeToGlint = false;
      neat.assets.intro = false;
    };

    /***on load functions***/
    neat.onLoadFunctions.Cardinal_bird_animated = function(mesh, loader){
      mesh.material.materials[0].morphTargets = true;
      var birdAnim = loader.ParseJSON(neat.mediaFolderUrl+'/models/neat/Cardinal_bird_positions.JSON');
      animate.updater.addHandler(new animate.PositionRotationHandler(mesh, birdAnim));

      neat.animationHandlers.ah1 = new animationHandler();
      neat.animationHandlers.ah1.setMesh(mesh);
      neat.animationHandlers.ah1.loop(0, 15);
    };

    neat.onLoadFunctions.House = function(mesh, loader){
        mesh.castShadow = true;
    };

    neat.onLoadFunctions.Window_symbols = function(mesh){
      mesh.position.z++;
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
        neat.assets.Glass_standard_Dirt.position.z+=0.5;
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

    neat.onFinishLoadFunctions.addWatch = function (scene, loader) {
        watch.watch(loader.cameraHandler, "frame", function(prop, action, newValue, oldValue) {
            reactToFrame(oldValue);
        });
    };

    neat.onFinishLoadFunctions.playSound = function(){
      audio.sounds.neatacousticguitar.play();
      audio.sounds.neatacousticguitar.fade(0, 1, 1000);
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
      callback.go(neat.callbacks.introAnimDone);

      animate.camera.near = 1;
      animate.camera.updateProjectionMatrix();
      neat.assets.scene = scene;

      neat.assets.states = new states(scene);
      neat.assets.states.dirt.start();
      neat.timeouts.sun1 = setTimeout(function(){ neat.assets.states.sun.start(); }, stagesTime.sun1);
      neat.timeouts.rain = setTimeout(function(){ neat.assets.states.rain.start(); }, stagesTime.rain);
      neat.timeouts.sun2 = setTimeout(function(){ neat.assets.states.sun.start(); }, stagesTime.sun2);
      neat.timeouts.final = setTimeout(function(){
        neat.buttons.rain.add();
        neat.buttons.dirt.add();
      }, stagesTime.final);
    };

    neat.buttons = {
      rain: {
          add: function(){
              events.AddButton({text:"rain", function: neat.assets.states.rain.start, id:"rain"});
          },
          remove: function(){ events.RemoveElementByID("rain"); }
      },
      dirt: {
          add: function(){
              events.AddButton({text:"dirt", function: neat.assets.states.dirt.start, id:"dirt"});
          },
          remove: function(){ events.RemoveElementByID("dirt"); }
      }
    };

    /***private functions***/
    function reactToFrame(frame){
      switch (frame) {
        case 128: {
          audio.sounds.neatcardinal2.play();
          audio.sounds.neatcardinal2.fade(0, 1, 1000);
          break;
        }
      }
    }

    function states(scene) {
      var curState = undefined, prevState = undefined, idle = true;
      var ret =
      {
        sun:{
          start: function(){
            if(curState == "sun") return;
            ret.stop("sun");
            neat.assets.sun.lightUp();
            neat.assets.sun.tweenColor("sun");
            neat.assets.sun.tweenAmbiental("normalAmb");

            audio.sounds.neatheavenlytransition.play();
            audio.sounds.neatheavenlytransition.fade(0, 1, 1000);
            if (neat.assets.intro) {
              if (prevState == 'dirt') {
                defintelyNotTheSun(scene);
              }
              if (prevState == 'rain') glint(scene, 2500);
            }
            else {
              if (neat.assets.timeToGlint) {
                glint(scene, 3000);
                neat.assets.timeToGlint = false;
                neat.assets.intro = true;
              }
              if (neat.assets.didYouSeeTheSun == false) {
                defintelyNotTheSun(scene);
                neat.assets.didYouSeeTheSun = true;
                neat.assets.timeToGlint = true;
              }
            }
            neat.timeouts.sun = setTimeout(function(){
              callback.go(neat.callbacks.sunFinish);
               idle = true;
             }, 3500);
          },
          stop: function(){
            audio.sounds.neatheavenlytransition.fade(1, 0, 500);
            //neat.assets.sun.lightDown();
          }
        }
        ,
        rain:{
          start: function(){
            if(curState == "rain") return;
            if(idle == false) return;
            callback.go(neat.callbacks.rainStart);
            idle = false;
            ret.stop("rain");
            //possible raindrop locations between these values
            var neatRaindropsPos = {
              xMin:-240, xMax:-180,
              yMin: 460, yMax: 600};

            var standardRaindropsPos = {
              xMin:-310, xMax:-250,
              yMin: 460, yMax: 600};

            //neat.assets.Glass_neat_Dirt.material.isClean = false;
            neat.assets.Glass_neat_Dirt.material.Clean({minDirt: 0.0, keepOpac: false});

            //start rain particle system
            neat.assets.rainPS.Init(neat.assets.scene);

            //start rain materials (standard window only starts once)
            //neat.assets.Glass_standard_Rain.material.Start({startOnce: true});
            //neat.assets.Glass_neat_Rain.material.Start();

            //add a new rainDrops object every rain state to neat window
            neat.assets.Glass_neat_Rain.rainDrops = new rainDrops(
              { scene: neat.assets.scene, pos: neatRaindropsPos }
            );
            animate.updater.addHandler(neat.assets.Glass_neat_Rain.rainDrops);

            //only add new rainDrops object to standard, it never cleans
            //if(!neat.assets.Glass_standard_Rain.rainDrops){
              neat.assets.Glass_standard_Rain.rainDrops = new rainDrops(
                { scene: neat.assets.scene, pos: standardRaindropsPos }
              );
              animate.updater.addHandler(neat.assets.Glass_standard_Rain.rainDrops);
            //}
            //if it already spawned, just start it. will stop anyway if at max raindrops
            //else neat.assets.Glass_standard_Rain.rainDrops.start();
            neat.assets.sun.lightUp();
            neat.assets.sun.tweenColor("rain");
            neat.assets.sun.tweenAmbiental("rainAmb");

            audio.sounds.neatrainexteriorloop.play();
            audio.sounds.neatrainexteriorloop.fade(0, 1, 1000);
            var r_rainTween = new TWEEN.Tween(neat.assets.rightSheet.material.uniforms.opacity).to({value: 0.7}, 2500).start();
            var l_rainTween = new TWEEN.Tween(neat.assets.leftSheet.material.uniforms.opacity).to({value: 0.7}, 2500).start();
            if (neat.assets.intro) setTimeout(neat.assets.states.sun.start,5000);
          },
          stop: function(){
            //stop rain particle system
            neat.assets.rainPS.Stop();
            callback.go(neat.callbacks.rainFinish);
            //clean materials and raindrops if present
            //neat.assets.Glass_standard_Rain.material.Clean();
            //neat.assets.Glass_neat_Rain.material.Clean();
            // if(neat.assets.Glass_neat_Rain.rainDrops)
            // neat.assets.Glass_neat_Rain.rainDrops.clean();
            // if(neat.assets.Glass_standard_Rain.rainDrops)
            // neat.assets.Glass_standard_Rain.rainDrops.clean();

            if(neat.assets.Glass_neat_Rain.rainDrops)
            neat.assets.Glass_neat_Rain.rainDrops.stop();
            if(neat.assets.Glass_standard_Rain.rainDrops)
            neat.assets.Glass_standard_Rain.rainDrops.stop();

            audio.sounds.neatrainexteriorloop.fade(1, 0, 500);

            neat.animationHandlers.sh.play(0,91);
            var r_rainTweenOut = new TWEEN.Tween(neat.assets.rightSheet.material.uniforms.opacity)
            .to({value: 0}, 0)
            .delay(2500)
            .start();

            var l_rainTweenOut = new TWEEN.Tween(neat.assets.leftSheet.material.uniforms.opacity)
            .to({value: 0.5}, 2500)
            .start();
          }
        }
        ,
        dirt:{
          start: function(){
            if(curState == "dirt") return;
            if(idle == false) return;
            callback.go(neat.callbacks.dirtStart);
            idle = false;
            ret.stop("dirt");
            neat.assets.leavesPS.Init(neat.assets.scene);
            neat.assets.Glass_standard_Dirt.material.Start({startOnce: true});
            neat.assets.Glass_neat_Dirt.material.Start();
            neat.assets.sun.lightDown();
            neat.assets.sun.tweenAmbiental("normalAmb");

            audio.sounds.neatwindleaves.play();
            audio.sounds.neatwindleaves.fade(0, 1, 1000);
            if (neat.assets.intro) setTimeout(neat.assets.states.sun.start,5000);
          },
          stop: function(){
            callback.go(neat.callbacks.dirtFinish);
            neat.assets.leavesPS.Stop();
            neat.assets.Glass_neat_Dirt.material.Clean({minDirt: 0.2, keepOpac: false});
            //neat.assets.Glass_neat_Dirt.material.Clean();

            audio.sounds.neatwindleaves.fade(1, 0, 500);
          }
        }
        ,
        stop: function (newState) {
          //stops current, argument is new state
          if(curState)ret[curState].stop();
          prevState = curState;
          curState = newState;
        }
      };
      return ret;
    }

    function addParticles(scene){
        var leavesSettings = {
            width: 500,
            height: 250,
            depth: 50,
            num: 25,
            size: {w: 20, h: 20},
            mapNames: ["Leaf_1_diff", "Leaf_2_diff", "Leaf_3_diff"],
            pos: new THREE.Vector3(100, 500, 500),
            dir: new THREE.Vector3(-1, -0.5, 0),
            speed: 6,
            rot: {x: Math.PI / 100, y: Math.PI / 100, z: Math.PI / 100},
            rndRotInit: true
        };

        var rainSettings = {
            width: 500,
            height: 250,
            depth: 150,
            num: 500,
            size: {w: 0.5, h: 8},
            rndSizeVariation: 0.25,
            mapNames: ["water_drop"],
            pos: new THREE.Vector3(-300, 500, 500),
            dir: new THREE.Vector3(-0.6, -1, 0),
            fixedRot: {x: 0, y: 0, z: -0.6},
            speed: 20
        };

        neat.assets.leavesPS = new particleSystem(leavesSettings);
        neat.assets.rainPS = new particleSystem(rainSettings);
    }

    function rainDrops(s) {
      var _this = this;
      this.interval = 15;
      //this.maxNum = 300;
      //this.curNum = 0;
      this.maxDrop = 2;
      this.minDrop = 0.85;
      this.mat = materials.setMaterials("cardinal", {name:"Glass"});
      this.lastT = _.now();
      this.curT = 0;
      this.scene = s.scene;
      this.pos = s.pos;
      //this.drops = [];

      this.update = function () {
        /*if(this.curNum >= this.maxNum){
          animate.updater.removeHandler(this);
          return;
        }*/
        this.curT = _.now();
        if(this.curT - this.lastT > this.interval){
          this.lastT = _.now();
          this.makeDrop();
        }
      };

      this.makeDrop = function () {
        //var curRad = _.random(this.minDrop, this.maxDrop);
        var curRad = Math.random() * (this.maxDrop - this.minDrop) + this.minDrop;
        var sphere = new THREE.Mesh( new THREE.SphereGeometry(curRad, 6, 6 ), this.mat.clone());
        sphere.scale.z = 0.1;
        sphere.material.opacity = 0;
        sphere.position.set(_.random(this.pos.xMin, this.pos.xMax),
                            _.random(this.pos.yMin, this.pos.yMax), 367.587);
        sphere.yPos = sphere.position.y;

        var tween = new TWEEN.Tween(sphere.material);
          tween.to({ opacity: 1 }, 100);
        this.scene.add( sphere );

        var tweenOut = new TWEEN.Tween(sphere.material).to({opacity: 0}, 500).onUpdate(function(){
          sphere.position.y -= 0.25;
        }).onComplete(function(){
          neat.assets.scene.remove(sphere);
          sphere.geometry.dispose();
          sphere.material.dispose();
        });
        tweenOut.easing(TWEEN.Easing.Sinusoidal.InOut);

        tween.chain(tweenOut);
        tween.start();
      };

      this.start = function () {
        animate.updater.addHandler(this);
      };

      this.stop = function () { animate.updater.removeHandler(this); };

      // this.clean = function () {
      //   var _this = this;
      //   this.stop();
      //   var totalClean = 5000;
      //   var drops = _.sortBy(this.drops, 'yPos')
      //   _.each( drops, function(sphere, i) {
      //     var tweenDown = new TWEEN.Tween(sphere.material);
      //         tweenDown.to({ opacity: 0 }, 250);
      //         tweenDown.delay(totalClean - ((totalClean / drops.length) * i));
      //         tweenDown.onComplete(function () {
      //           _this.scene.remove(sphere);
      //         });
      //         tweenDown.start();
      //   });
      // };
    }

    function sun(scene) {
      var _this = this;
      this.tweenTime = 2000;
      this.colors = {
        sun: {r: 253, g: 184, b: 19},//0xfdb813,
        rain: {r: 152, g: 184, b: 208},
        dirt: {r: 0, g: 0, b: 0},

        rainAmb: {r: 86, g: 102, b: 114},
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
      scene.add(this.spotLight);
    }

    function defintelyNotTheSun(scene){
        var theSunMap = new THREE.ImageUtils.loadTexture( neat.mediaFolderUrl+'/models/neat/sun.png' );
        var theSunGeo = new THREE.PlaneBufferGeometry(42,42);
        var theSunMat = new THREE.MeshPhongMaterial({map: theSunMap, transparent: true, opacity: 1});
        theSunMat.blending = THREE['AdditiveBlending'];
        var theSun = new THREE.Mesh( theSunGeo, theSunMat );
        theSun.position.x = -330;
        theSun.position.y = 598;
        theSun.position.z = 368;
        scene.add(theSun);

        var theSunTween = new TWEEN.Tween(theSun.position).to({x: -160, y: 598, z: 367}, 3000).delay(512)
        .onComplete(function(){
          scene.remove(theSun);
        });

        var theSunRotation = new TWEEN.Tween(theSun.rotation).to({z: -Math.PI/3}, 3000).delay(512);

        theSunTween.start();
        theSunRotation.start();
    }

    function glint(scene, delay){
        callback.go(neat.callbacks.glintStart);
        var glintMap = new THREE.ImageUtils.loadTexture( neat.mediaFolderUrl+'/models/neat/swipe.png' );
        var glintGeo = new THREE.PlaneBufferGeometry(68,68);
        var glintMat = new THREE.MeshPhongMaterial({map: glintMap, transparent: true, opacity: 0});
        glintMat.blending = THREE['AdditiveBlending'];
        var glint = new THREE.Mesh( glintGeo, glintMat );
        glint.position.x = -208;
        glint.position.y = 450;
        glint.position.z = 367;

        var glintSpeed = 1000;
        var glintTween = new TWEEN.Tween(glint.position).to({x: -208, y: 600, z: 367}, glintSpeed).delay(delay)
        .onStart(function(){
          scene.add(glint);
          audio.sounds.neatmagicwand.play();
          audio.sounds.neatmagicwand.fade(1, 0.1, glintSpeed);
        })
        .onComplete(function(){
          callback.go(neat.callbacks.glintFinish);
          scene.remove(glint);
        });
        var glintOpacityIn = new TWEEN.Tween(glint.material).to({opacity: 1}, glintSpeed/10).delay(delay);
        var glintOpacityOut = new TWEEN.Tween(glint.material).to({opacity: 0}, 9*glintSpeed/10);
        glintOpacityIn.easing(TWEEN.Easing.Sinusoidal.InOut);
        glintOpacityOut.easing(TWEEN.Easing.Sinusoidal.InOut);

        glintOpacityIn.chain(glintOpacityOut);
        glintTween.start();
        glintOpacityIn.start();
    }

    //testing
    /*document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener("click", onMouseClick, false);

    function onMouseMove(event) {
      mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }

    function onMouseClick(event) {
      // var caster = new THREE.Raycaster();
      // caster.setFromCamera( mouse, tcamera);
      // var intersects = caster.intersectObjects(tscene.children);
      //console.log(intersects[0].point);
      //loadTheSheet();
    }*/
    //-----

    return neat;
});
