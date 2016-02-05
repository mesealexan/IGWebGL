define(["scene", "animate", "events", "animationHandler", "composers", "watch", "tween",
  "materials", "underscore", "particleSystem", "aeTween", "text", "cloth", "particleSystemGPU", "callback"],
function (scene, animate, events, animationHandler, composers, watch, tween,
  materials, underscore, particleSystem, aeTween, text, cloth, particleSystemGPU, callback ) {
var tornadoScene = {
  callbacks: {
    introAnimDone:  {
      sampleCall1: function(){ console.log("finished intro animation"); }
    }
  }
  ,
  url: "sea-storm"
  ,
  constructor: function () {
  var tornado = new scene();
  tornado.folderName = "tornado";
  tornado.addAssets( ["Floor_gird", "Background_clouds", "Earth_shell", "Earth_clouds", "House", "SeaStorm",
   "Floor_grass", "Hurricane_arm", "Debris", /*"Tree_sway", "Bush_sway",/* "Wind_1", "Wind_2", "Wind_3",*/
   "House_windows", /*"GoodWeatherBadWeather",*/ "Inner_walls", "OrdinaryWindow" ,"CardinalWindow", "Arrow"] );
   // scroll clouds
   tornado.cloudSpeed = 0.0001;
   tornado.slowMoCloudSpeed = 0.00005;
   // gravity
   tornado.gravity = new THREE.Vector3(0, -15, -15 );
   tornado.slowMoGravity = new THREE.Vector3(0, -1, -1 );
   // debree
   tornado.debreeDestroyTime = 3000;
   tornado.nomalModebreeDestroyTime = 3000;
   tornado.slowModebreeDestroyTime = 10000;
   var brickTravelTime = 40;
   // lightning
   tornado.lightningTime = 75;
   tornado.slowMoLightningTime = 200;
   // bloom
   tornado.bloomSettings = {
     outside: {min: 0.8, max: 1.2},
     inside: {min: 0.4, max: 1}
   };
   // upper scene aseets stored here for disposal
   tornado.upperSceneDisposables = [];
   tornado.lowerSceneObjects = [];
   // crack window
   var crackCycleSpeed = 0.1;
   // intro text
   var textFadeOutFrames = 150;
   // between windows frames
   var betweenWindowsFrames = 25;


  tornado.onFinishLoadFunctions.jumpAhead = function(scene, loader) {
    /*tweenBloomDown();
    rareLightning();
    loader.cameraHandler.frame = 369;
    //loader.cameraHandler.frame = 200;
    animate.SetCustomFramerate(30);
    cleanUpperScene();
    revealLowerScene();
    events.ToggleControls(true);
    startPhysics(tornado.assets.scene, tornado.assets.loader);
    scene.add(tornado.assets.rain);
    tornado.assets.rain.material.Start();
    //startLightning();
    //setTimeout(function(){animate.updater.removeHandler(loader.cameraHandler)}, 1000);
    /*setTimeout(function(){
      animate.updater.removeHandler(loader.cameraHandler);
      triggerSlowMo();
    }, 2000);*/
    //throwBrick();
    //setTimeout(function(){animate.updater.removeHandler(loader.cameraHandler)}, 1000);
  };

  /***on start functions***/
  tornado.onStartFunctions.startLightning = function () {
    startLightning();
  };

  tornado.onStartFunctions.setFramerate = function(scene){
    animate.SetCustomFramerate(20);
  };

  tornado.onStartFunctions.storeScene = function(scene, loader){
    tornado.assets.scene = scene;
    tornado.assets.loader = loader;
  };

  tornado.onStartFunctions.setPhysics = function(scene){
    scene.setGravity(tornado.gravity);
    scene.update = function() { scene.simulate( undefined, 1 ); };
  };

  tornado.onStartFunctions.addLights = function(scene){
    tornado.assets.ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(tornado.assets.ambientLight);

    tornado.assets.directionalLight = new THREE.DirectionalLight( 0xffffff, 0 );
    tornado.assets.directionalLight.position.set( 100, 100,  100 );
    scene.add(tornado.assets.directionalLight);
  };

  tornado.onStartFunctions.addShatterWindow = function (scene) {
    var geometry = new THREE.PlaneBufferGeometry( 2.85, 2.5, 128, 128 );
    windowWobble.prototype = new THREE.ShaderMaterial();
    var material = new windowWobble();
    tornado.assets.shatterWindowMaterial = material;
    animate.updater.addHandler(tornado.assets.shatterWindowMaterial);
    animate.updater.addHandler({
      update: function(){
        geometry.normalsNeedUpdate = true;
        geometry.verticesNeedUpdate = true;
      }
    });
    var plane = new THREE.Mesh( geometry, tornado.assets.shatterWindowMaterial );
    plane.position.set(-6.95, -420.64, -3.37);
    //scene.add( plane );
  };

  tornado.onStartFunctions.makeIntroText = function(scene){
     var strings = [ "Protection for when", "good weather goes bad" ];

     var settings = {
       size: 1,
       curveSegments: 4,
       height: 0.1,
       bevelEnabled: false,
       style: "normal",
       weight: "normal",
			 bevelEnabled: true,
			 bevelThickness: 0.05,
			 bevelSize: 0,
       font: "bank gothic"
       //font: "helvetiker"
     };

     var material = new THREE.MeshBasicMaterial( {color: 0x000000, transparent: true} );
     materials.outlineShader.prototype = new THREE.ShaderMaterial();
     var outlineMaterial = new materials.outlineShader({
       thickness: 0.06,
       color: new THREE.Color("rgb(255,255,255)")
     });

     var mats = [material, outlineMaterial];
     var meshes = [];

     _.each(strings, function ( s ) {
       var geom = text.Make(s, settings);
       geom.computeBoundingBox();
       geom.computeVertexNormals();
       var centerOffset = -0.5 * ( geom.boundingBox.max.x - geom.boundingBox.min.x );
       var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, mats);
       mesh.centerOffset = centerOffset;
       meshes.push(mesh);
       tornado.upperSceneDisposables.push(mesh);
     });

     tornado.assets.textMeshes = meshes;

     meshes[0].position.set(0, 0, 100 );
     meshes[0].add(meshes[1]);
     meshes[1].position.x += -meshes[0].centerOffset + meshes[1].centerOffset;
     scene.add(meshes[0]);
     animate.camera.add(meshes[0]);
     meshes[0].position.z -= 200;
     meshes[0].position.y += 1;
     meshes[0].position.x += meshes[0].centerOffset;
     meshes[1].position.y -= 2.5;
   };

  tornado.onStartFunctions.makeAnnealedText = function ( scene ) {
    var strings = [ "Annealed", "Glass" ];
    var offsets = {
      Annealed: 0.1,
      Glass   : -0.1
    }
    var combinedGeom = new THREE.Geometry();
    var material = new THREE.MeshBasicMaterial( { color: 0x000000, transparent: true, opacity: 0 } );
    var offsetY = 0.1;

    var settings = {
      size: 0.2,
      curveSegments: 5,
      height: 0.02,
      style: "normal",
      weight: "normal",
      font: "bank gothic"
    };

    _.each (strings, function ( s ) {
      var geom = text.Make( s, settings );
      geom.computeBoundingBox();
      geom.computeVertexNormals();
      var centerOffset = -0.5 * ( geom.boundingBox.max.x - geom.boundingBox.min.x );
      var posMatrix = new THREE.Matrix4();
      posMatrix.makeTranslation( centerOffset, offsets[s], 0 );
      geom.applyMatrix ( posMatrix );
      var mesh = new THREE.Mesh( geom );
      combinedGeom.merge( mesh.geometry, mesh.matrix );
    });

    var mesh = new THREE.Mesh(combinedGeom, material);
    mesh.position.set(-9.478, -420.718, -3.257);
    scene.add( mesh );
    tornado.assets.annealedTextMesh = mesh;
  };

  /***on load functions***/

  function prepareWind(mesh, to) {
    mesh.material.materials[0].morphTargets = true;
    mesh.material.materials[0].transparent = true;
    mesh.material.materials[0].side = 2;
    mesh.material.materials[0].blending = 1;
    mesh.material.materials[0].opacity = 0.66;
    mesh.material.materials[0].depthWrite = false;
    mesh.material.materials[0].depthTest = false;
    //mesh.material.materials[0].alphaTest = 0.7;
    var ah = new animationHandler();
    ah.setMesh(mesh);
    //ah.setSpeed(0.1);
    ah.setInfluence(1);
    ah.play(0, to);
    ah.onComplete = function () {
      //ah.resetInfluences();
      //prepareWind(mesh, to);
      mesh.parent.remove(mesh);
    }
    return ah;
  };

  tornado.onLoadFunctions.OrdinaryWindow = function (mesh) {
    mesh.visible = false;
    var opac = 0.6;
    tornado.assets.ordinaryWindow = mesh;

    tornado.assets.ordinaryWindow.crackMap =
      THREE.ImageUtils.loadTexture(tornado.mediaFolderUrl+'/models/tornado/ordinaryCrack.jpg');
    tornado.assets.ordinaryWindow.specularMap =
      THREE.ImageUtils.loadTexture(tornado.mediaFolderUrl+'/models/tornado/ordinary_glass_specular.jpg');

    mesh.geometry.computeFaceNormals();
    mesh.geometry.computeMorphNormals();

    tornado.assets.envMap = materials.gloomyCloudsCube;
    tornado.assets.ordinaryWindow.material = materials.setMaterials("cardinal", {name:"Glass"});
    tornado.assets.ordinaryWindow.material.shading = THREE.FlatShading;
    tornado.assets.ordinaryWindow.material.maxOpacity = opac;
    tornado.assets.ordinaryWindow.material.opacity = 0;
    tornado.assets.ordinaryWindow.material.envMap = materials.gloomyCloudsCube;
    tornado.assets.ordinaryWindow.material.morphTargets = true;

    tornado.assets.ordinaryWindow.break = function(){
      tornado.assets.ordinaryWindow.crack();
      animate.updater.addHandler({
        speed: crackCycleSpeed,
        update: function(){
          if ( tornado.assets.ordinaryWindow.morphTargetInfluences[ 0 ] < 0 ) animate.updater.removeHandler(this);
            tornado.assets.ordinaryWindow.morphTargetInfluences[ 0 ] -= this.speed;
        }
      });
    };

    tornado.assets.ordinaryWindow.reset = function () {
      tornado.assets.ordinaryWindow.morphTargetInfluences[ 0 ] = 1;
      tornado.assets.ordinaryWindow.material.bumpMap = undefined;
      tornado.assets.ordinaryWindow.material.specularMap = undefined;
      tornado.assets.ordinaryWindow.material.needsUpdate = true;
    };

    tornado.assets.ordinaryWindow.crack = function () {
      tornado.assets.ordinaryWindow.material.bumpMap = tornado.assets.ordinaryWindow.crackMap;
      tornado.assets.ordinaryWindow.material.specularMap = tornado.assets.ordinaryWindow.specularMap;
      tornado.assets.ordinaryWindow.material.needsUpdate = true;
    };
  }

  tornado.onLoadFunctions.CardinalWindow = function (mesh) {
    var opac = 0.6;
    tornado.assets.cardinalWindow = mesh;
    tornado.assets.cardinalWindow.crackMap =
      THREE.ImageUtils.loadTexture(tornado.mediaFolderUrl+'/models/tornado/crack.jpg');
      tornado.assets.cardinalWindow.specularMap =
        THREE.ImageUtils.loadTexture(tornado.mediaFolderUrl+'/models/tornado/cracked_glass_specular.jpg');
    tornado.assets.cardinalWindow.material =
      new THREE.MeshPhongMaterial({
        color: new THREE.Color("rgb(255,255,255)"),
        specular: new THREE.Color("rgb(255,255,255)"),
        refractionRatio: 0.985,
        reflectivity: 0.99,
        bumpScale: 1,
        transparent: true,
        opacity: opac,
        envMap: materials.gloomyCloudsCube
      });

    tornado.assets.cardinalWindow.material.maxOpacity = opac;
    tornado.assets.cardinalWindow.material.morphTargets = true;
    tornado.assets.cardinalWindHandler = {
      value: 0,
      windIncrease: 0.5,
      speed: crackCycleSpeed,
      update: function(){
        this.value += this.speed;
        tornado.assets.cardinalWindow.morphTargetInfluences[ 1 ] = Math.abs(Math.sin(this.value)) + this.windIncrease;
      }
    };

    tornado.assets.cardinalWindow.wind = function(){
      if(animate.updater.returnHandlerIndex(tornado.assets.cardinalWindHandler) == false)
        animate.updater.addHandler(tornado.assets.cardinalWindHandler);
    };

    tornado.assets.cardinalWindow.crack = function(){
      tornado.assets.cardinalWindow.material.bumpMap = tornado.assets.cardinalWindow.crackMap;
      tornado.assets.cardinalWindow.material.specularMap = tornado.assets.cardinalWindow.specularMap;
      tornado.assets.cardinalWindow.material.needsUpdate = true;
    };

    tornado.assets.cardinalWindow.reset = function(){
      tornado.assets.cardinalWindow.material.bumpMap = undefined;
      tornado.assets.cardinalWindow.material.specularMap = undefined;
      tornado.assets.cardinalWindow.material.needsUpdate = true;
      animate.updater.removeHandler(tornado.assets.cardinalWindHandler);
      tornado.assets.cardinalWindow.morphTargetInfluences[ 1 ] = 0;
      tornado.assets.cardinalWindHandler.value = 0;
    };
  }

  tornado.onLoadFunctions.SeaStorm = function (mesh) {
    mesh.material = mesh.material.materials[0];
    mesh.material.opacity = 0;
    mesh.material.transparent = true;
    tornado.assets.SeaStorm = mesh;
  };

  tornado.onLoadFunctions.Arrow = function (mesh) {
    mesh.material = mesh.material.materials[0];
    mesh.material.opacity = 0;
    mesh.material.transparent = true;
    tornado.assets.Arrow = mesh;
  };

  tornado.onLoadFunctions.House_windows = function ( mesh ) {
    tornado.lowerSceneObjects.push(mesh);
    mesh.visible = false;
    mesh.material.materials[0] = materials.setMaterials("cardinal", {name:"Glass"});
    mesh.material.materials[0].opacity = 0.6;
    mesh.material.materials[0].envMap = materials.gloomyCloudsCube;
    mesh.material.materials[0].needsUpdate = true;
  }

  tornado.onLoadFunctions.Background_clouds = function ( mesh ) {
    tornado.lowerSceneObjects.push(mesh);
    mesh.visible = false;
    mesh.material = mesh.material.materials[0];
    mesh.material.map.wrapS = THREE.RepeatWrapping;
    mesh.material.map.wrapT = THREE.RepeatWrapping;

    var scrollingUV = function(m){
      this.frame = 0;
      this.speed = tornado.cloudSpeed;
      this.update = function () {
        m.material.map.offset.x += this.speed;
      };
    };
    tornado.assets.cloudScrollingUV = new scrollingUV(mesh);
    animate.updater.addHandler(tornado.assets.cloudScrollingUV);
  }

  tornado.onLoadFunctions.Earth_shell = function ( mesh ) {
    tornado.upperSceneDisposables.push(mesh);
      var ae = new aeTween(mesh.position);
      ae.to({x: 250}, 230);
      ae.start();

      /*materials.vertHeightMat.prototype = new THREE.ShaderMaterial();
      mesh.material = new materials.vertHeightMat();*/

  };

  tornado.onLoadFunctions.Debris = function ( mesh ) {
    mesh.material.materials[0].transparent = true;
    mesh.material.materials[0].opacity = 0;
    tornado.assets.DebrisMaterial = mesh.material.materials[0];
    tornado.assets.Debris = mesh;
  };

  tornado.onLoadFunctions.Floor_grass = function ( mesh, loader ) {
    tornado.lowerSceneObjects.push(mesh);
    mesh.visible = false;
  };

  tornado.onLoadFunctions.Floor_gird = function ( mesh, loader ) {
    tornado.lowerSceneObjects.push(mesh);

    materials.floorGrid.prototype = new THREE.ShaderMaterial();
    mesh.material = new materials.floorGrid();

    mesh.visible = false;
    var PHY_Floor_girdMat = Physijs.createMaterial(
      mesh.material.clone(),
      0.6, // medium friction
      0.3  // low restitution
    );

    var PHY_Floor_gird = new Physijs.ConvexMesh (mesh.geometry.clone(), PHY_Floor_girdMat, 0 );
    loader.DisposeObject(mesh);
    loader.scene.add( PHY_Floor_gird );

    tornado.lowerSceneObjects.push(PHY_Floor_gird);
    PHY_Floor_gird.visible = false;
  };

  tornado.onLoadFunctions.Earth_clouds = function ( mesh ) {
    var noiseSize = 1024;
    var size = noiseSize * noiseSize;
    var data = new Uint8Array( 4 * size );
    for ( var i = 0; i < size * 4; i ++ ) {
        data[ i ] = Math.random() * 255 | 0;
    }
    var dt = new THREE.DataTexture( data, noiseSize, noiseSize, THREE.RGBAFormat );
    dt.wrapS = THREE.RepeatWrapping;
    dt.wrapT = THREE.RepeatWrapping;
    dt.needsUpdate = true;

    materials.noiseMat.prototype = new THREE.ShaderMaterial();
    mesh.material = new materials.noiseMat(dt);

    var scrollingUV = function(){
      this.frame = 0;
      this.maxFrame = 200;
      this.speed = 0.0005;
      this.update = function () {
        if(++this.frame == this.maxFrame) animate.updater.removeHandler(this);
        else mesh.material.uniforms.offset.value += this.speed;
      };
    };

    animate.updater.addHandler(new scrollingUV());
    tornado.animationHandlers.cloudsAnim = new animationHandler();
    tornado.animationHandlers.cloudsAnim.setMesh(mesh);
    tornado.animationHandlers.cloudsAnim.speed = 1;
    tornado.animationHandlers.cloudsAnim.play(0, 138);
    tornado.upperSceneDisposables.push(mesh)
  };

  tornado.onLoadFunctions.House = function ( mesh, loader ) {
    var PHY_houseMat = Physijs.createMaterial(
      mesh.material.clone(),
      0.6, // medium friction
      0.3  // low restitution
    );

    var PHY_houseMesh = new Physijs.ConvexMesh (mesh.geometry.clone(), PHY_houseMat, 0 );
    loader.DisposeObject(mesh);
    loader.scene.add(PHY_houseMesh);
    tornado.lowerSceneObjects.push(PHY_houseMesh);
    PHY_houseMesh.visible = false;
  };

  tornado.onLoadFunctions.Hurricane_arm = function ( mesh ) {
    tornado.assets.Hurricane_arms = [];
    tornado.assets.Hurricane_arm = mesh;
    materials.tornado.prototype = new THREE.ShaderMaterial();
    tornado.assets.Hurricane_arm.material = new materials.tornado();

    for (var i = 0; i < 8; i++) {
      materials.tornado.prototype = new THREE.ShaderMaterial();
      var newArm = new THREE.Mesh( mesh.geometry.clone(), new materials.tornado() );
      newArm.rotation.y += (Math.PI / 4) * i;
      tornado.assets.Hurricane_arms.push(newArm);
      tornado.upperSceneDisposables.push(newArm);
      mesh.add(newArm);
    }
  };

  tornado.onLoadFunctions.Tree_sway = function ( mesh, loader ) {
    var trees = [mesh];
    var pos1 = new THREE.Vector3(-18.3, -430, -16.8);
    mesh.material.materials[0].morphTargets = true;
    mesh.position.copy(pos1);
    tornado.lowerSceneObjects.push(mesh);
    mesh.visible = false;

    //create left side row of trees
    for (var i = 0; i < 2; i++) {
      var newMesh = mesh.clone();
      newMesh.position.copy(pos1);
      newMesh.position.z += 6 * (i + 1);
      loader.scene.add( newMesh );
      tornado.lowerSceneObjects.push(newMesh);
      newMesh.visible = false;
      trees.push(newMesh);
    }

    for (var t = 0; t < trees.length; t++) {
      var scaleY = 0.7 + (Math.random() * 0.3);
      trees[t].scale.set(1, scaleY, 1);
      tornado.animationHandlers["ah"+t] = new animationHandler();
      tornado.animationHandlers["ah"+t].setMesh(trees[t]);
      tornado.animationHandlers["ah"+t].setSpeed(0.1);
      tornado.animationHandlers["ah"+t].setInfluence(scaleY);
      //tornado.animationHandlers["ah"+t].loop(0, 29);
      //tornado.animationHandlers["ah"+t].loop(29, 0);
    }
  };

  tornado.onLoadFunctions.Bush_sway = function ( mesh, loader ) {
    mesh.material.materials[0].morphTargets = true;
    mesh.position.set(1.5, -430, 1.2)
    tornado.animationHandlers.Bush_sway = new animationHandler();
    tornado.animationHandlers.Bush_sway.setMesh(mesh);
    tornado.animationHandlers.Bush_sway.setSpeed(0.1);
    tornado.animationHandlers.Bush_sway.setInfluence(1);
    //tornado.animationHandlers.Bush_sway.loop(0, 29);
  };

  /***on finish functions***/
  tornado.onFinishLoadFunctions.playCamera = function(scene, loader) {
     loader.cameraHandler.play(undefined,undefined, //from, to undefined
       onCameraComplete,
       animate.Animate);

       function onCameraComplete () {
         addButtons();
         revealSeaStormLogo();
         callback.go( tornadoScene.callbacks.introAnimDone );
         animate.StartTimeout();
       }
  };

  tornado.onFinishLoadFunctions.applyComposer = function(scene){
    tornado.assets.composer = new composers.Bloom_AdditiveColor({str: tornado.bloomSettings.outside.min});
    animate.SetCustomRenderFunction( function(){ tornado.assets.composer.render(); } );
    events.addDOF_GUI(tornado);
  };

  tornado.onFinishLoadFunctions.addControls = function () {
      var c = {
          noZoom: true,
          noPan: true,
          maxPolarAngle: 1.7,
          minPolarAngle: 1.2,
          minAzimuthAngle: -0.7,
          maxAzimuthAngle: 0.1
      };
      events.AddControls(c);
      events.ToggleControls(false);
  };

  tornado.onFinishLoadFunctions.addWatch = function (scene, loader) {
    watch.watch(loader.cameraHandler, "frame", function(prop, action, newValue, oldValue) {
        reactToFrame(oldValue);
    });
  };

  tornado.onFinishLoadFunctions.addRain = function (scene) {
      var rainSettings = {
          //width:  37,
          //height: 50,
          //depth:  30,
          width:  100,
          height: 50,
          depth:  100,
          num: 7500,
          size: 30,
          mapName: "rainLine",
          dir: new THREE.Vector3(0, -1, -1),
          speed: 1.2,
      };

      particleSystemGPU.prototype = new THREE.ShaderMaterial();
      var rainShader = new particleSystemGPU(rainSettings);
      tornado.assets.rain = new THREE.PointCloud( rainShader.systemGeometry, rainShader );
      tornado.assets.rain.position.set(-2, -438, -5);
      scene.add(tornado.assets.rain);
    /*var rainSettings = {
        width: 50,
        height: 50,
        depth: 50,
        num: 100,
        size: {w: 0.1, h: 0.8},
        mapNames: ["water_drop"],
        pos: new THREE.Vector3(0, -408, 40),
        dir: new THREE.Vector3(0, -1, -1),
        speed: 2,
        fixedRot: {x: 0.6, y: 0, z: 0}
    };

    tornado.assets.rainPS = new particleSystem(rainSettings);*/
    //tornado.assets.rainPS.Init(scene);
  };

  tornado.onFinishLoadFunctions.addDrape = function (scene) {
      tornado.assets.clothSim = new cloth();
      tornado.assets.clothSim.pins = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
			clothGeometry = new THREE.ParametricGeometry( tornado.assets.clothSim.clothFunction, 10, 10, true );
			clothGeometry.dynamic = true;

      var clothTexture = THREE.ImageUtils.loadTexture(tornado.mediaFolderUrl+'/models/tornado/drape.png');

      var mesh = new THREE.Mesh(clothGeometry, new THREE.MeshPhongMaterial(
        {
          side: 2,
          wireframe: false,
          map: clothTexture,
          transparent: false,
          alphaTest: 0.7
        }));

        tornado.assets.windHandler = {
          maxFrame: undefined,
          curFrame: 0,
          update: function ( systemDelta ) {
            if(tornado.assets.clothSim.windOn == true ||
              (this.maxFrame !== undefined && this.curFrame++ < this.maxFrame)){
              tornado.assets.clothSim.SetWindStrength(Math.abs(Math.cos( systemDelta / 2000 )
                * tornado.assets.clothSim.windAmplify + 40));
              tornado.assets.clothSim.windForce.set( 0, 0, -1 ).normalize().
              multiplyScalar( tornado.assets.clothSim.windStrength );
            }
            else {
              tornado.assets.clothSim.SetWindStrength(0);
              tornado.assets.clothSim.windForce.set( 0, 0, 0 ).normalize().
              multiplyScalar( tornado.assets.clothSim.windStrength );
            }

            tornado.assets.clothSim.simulate(systemDelta);

            var p = tornado.assets.clothSim.cloth.particles;

            for ( var i = 0, il = p.length; i < il; i ++ )
              clothGeometry.vertices[ i ].copy( p[ i ].position );

            clothGeometry.computeFaceNormals();
    				clothGeometry.computeVertexNormals();

    				clothGeometry.normalsNeedUpdate = true;
    				clothGeometry.verticesNeedUpdate = true;
          }
        };

      animate.updater.addHandler(tornado.assets.windHandler);

      mesh.position.set(-6.95, -420.64, -3.9);
      mesh.scale.set(0.013, 0.01, 0.01)
      scene.add(mesh);
      tornado.lowerSceneObjects.push(mesh);
  };

  /***on unload functions***/
  tornado.onUnloadFunctions.resetFramerate = function () {
    animate.SetDefaultFramerate();
  };

  tornado.onUnloadFunctions.clearIntervals = function () {
    for (var key in tornado.intervals)
      if (tornado.intervals.hasOwnProperty(key))
        clearInterval(tornado.intervals[key]);
  };

  /***private functions***/
  tornado.buttons = {
    cardinal: {
        add: function(){
          events.AddButton({text:"Cardinal", function: tornado.states.setCardinal, id:"cardinalWindow",
          class: "glass-type"});
        },
        remove: function(){ events.RemoveElementByID("cardinalWindow"); }
    },
    ordinary: {
        add: function(){
          events.AddButton({text:"Annealed", function: tornado.states.setOrdinary, id:"ordinaryWindow",
          class: "glass-type"});
        },
        remove: function(){ events.RemoveElementByID("ordinaryWindow"); }
    },
    wind: {
        add: function(){
            events.AddButton({ text:"Debris", function: tornado.states.debris, id:"wind",
            class:"anim-event" });
        },
        remove: function(){ events.RemoveElementByID("wind"); }
    },
    reset: {
        add: function(){
            events.AddButton({text:"reset", function: tornado.states.reset, id:"reset"});
        },
        remove: function(){ events.RemoveElementByID("reset"); }
    }

  };


  tornado.states = {
    curWindow: "cardinal",
    cardinalCracked: false,
    ordinaryCracked: false,
    tweenDone: false,
    /*********************cardinal*********************/
    setCardinal: function(){
      if ( tornado.states.tweenDone == false ) return;
      if ( tornado.states.curWindow == "cardinal" ) {

        tornado.states.reset();
        return;

      };

      tornado.states.curWindow = "cardinal";

      var cardinalIn = function(){
        tornado.assets.clothSim.windOn = false;
        tornado.states.tweenDone = true;
      }

      var ordinaryOut = function(){
        tornado.assets.ordinaryWindow.visible = false;
        tornado.assets.cardinalWindow.visible = true;
        tornado.states.tweenOpac(
          tornado.assets.cardinalWindow,
          tornado.assets.cardinalWindow.material.maxOpacity,
          cardinalIn);
      };

      var annealedTextOut = function(){
        tornado.assets.annealedTextMesh.visible = false;
        tornado.states.tweenOpac(tornado.assets.SeaStorm, 1);
      }

      //opacity tween
      tornado.assets.clothSim.windOn = false;
      tornado.states.tweenDone = false;
      tornado.states.tweenOpac(tornado.assets.annealedTextMesh, 0, annealedTextOut);
      tornado.states.tweenOpac(tornado.assets.ordinaryWindow, 0, ordinaryOut);
    }
    ,
    /*********************ordinary*********************/
    setOrdinary: function(){
      if ( tornado.states.tweenDone == false ) return;
      if(tornado.states.curWindow == "ordinary") {

        tornado.states.reset();
        return;

      };

      tornado.states.curWindow = "ordinary";

      var ordinaryIn = function () {
        tornado.assets.cardinalWindow.reset();
        tornado.assets.windHandler.curFrame = 0;
        tornado.assets.windHandler.maxFrame = undefined;
        tornado.states.tweenDone = true;
      }
      //on complete
      var cardinalOut = function(){
        tornado.assets.ordinaryWindow.reset();
        tornado.assets.ordinaryWindow.visible = true;
        tornado.assets.cardinalWindow.visible = false;
        tornado.states.tweenOpac(
          tornado.assets.ordinaryWindow,
          tornado.assets.ordinaryWindow.material.maxOpacity,
          ordinaryIn
        );
      };

      var SeaStormLogoOut = function(){
        tornado.assets.annealedTextMesh.visible = true;
        tornado.states.tweenOpac(tornado.assets.annealedTextMesh, 1);
      }
      //opacity tween
      tornado.states.tweenDone = false;
      tornado.states.tweenOpac(tornado.assets.SeaStorm, 0, SeaStormLogoOut);
      tornado.states.tweenOpac(tornado.assets.cardinalWindow, 0, cardinalOut);
    }
    ,
    debris: function(){
      if ( tornado.states.curWindow == "cardinal" ) {
        tornado.states.cardinalCracked = true;
        var onBrickComp = function () {
          tornado.assets.cardinalWindow.crack();
          tornado.assets.cardinalWindow.wind();
        }

        throwBrick(onBrickComp, "cardinal");
      }

      else if( tornado.states.curWindow == "ordinary" ) {
        tornado.states.ordinaryCracked = true;

        var onBrickComp = function(){
          tornado.assets.ordinaryWindow.break();
          tornado.assets.clothSim.windAmplify = 300;
          tornado.assets.clothSim.windOn = true;
          /*animate.updater.addHandler({
            update: function(){
              if(tornado.assets.clothSim.windAmplify < 150) animate.updater.removeHandler(this);
              tornado.assets.clothSim.windAmplify -= 2;
            }
          });*/
        }

        throwBrick(onBrickComp, "ordinary");

      }
    }
    ,
    reset: function(){
      if( tornado.states.curWindow == "cardinal" &&
          tornado.states.cardinalCracked ) {

        tornado.states.cardinalCracked = false;
        var tweenBack = function(){
          tornado.states.tweenDone = true;
          tornado.assets.cardinalWindow.reset();
          tornado.states.tweenOpac(tornado.assets.cardinalWindow, tornado.assets.cardinalWindow.material.maxOpacity);
        };

        tornado.states.tweenDone = false;
        tornado.states.tweenOpac(tornado.assets.cardinalWindow, 0, tweenBack);
      }
      else if( tornado.states.curWindow == "ordinary" &&
               tornado.states.ordinaryCracked ) {

        tornado.states.ordinaryCracked = false;

        var tweenBack = function(){
          tornado.states.tweenDone = true;
          tornado.assets.ordinaryWindow.reset();
          tornado.states.tweenOpac(tornado.assets.ordinaryWindow, tornado.assets.ordinaryWindow.material.maxOpacity);
        };

        tornado.states.tweenDone = false;
        tornado.states.tweenOpac(tornado.assets.ordinaryWindow, 0, tweenBack);
      }
      //tornado.states.curWindow = undefined;
      tornado.assets.clothSim.windAmplify = 0;
      tornado.assets.clothSim.windOn = false;
    }
    ,
    tweenOpac: function(obj, val, onComp){
      var tween = new aeTween(obj.material);
      tween.to({opacity: val}, betweenWindowsFrames);
      if(onComp)tween.onComplete = onComp;
      tween.start();
    }
  };

  function revealSeaStormLogo () {
    var logoTween = new aeTween( tornado.assets.SeaStorm.material );
    logoTween.onComplete = function () {
      tornado.states.tweenDone = true;
    }
    logoTween.to({opacity: 1}, betweenWindowsFrames);
    logoTween.start();

    var arrowTween = new aeTween( tornado.assets.Arrow.material );
    arrowTween.to({opacity: 1}, betweenWindowsFrames);
    arrowTween.start();
  }

  function reactToFrame ( frame ) {
    switch (frame) {
      case 0:
        revealTornado();
        break;
      case 20:
        tweenTextOpacityDown();
        break;
      case 200:
        fadeToWhite();
        //tornado.assets.rainPS.Init(tornado.assets.scene);
        tornado.assets.rain.material.Start();
        startPhysics(tornado.assets.scene, tornado.assets.loader);
        animate.SetCustomFramerate(30);
        tweenBloomDown();
        rareLightning();
        break;
      case 240:
        cleanUpperScene();
        revealLowerScene();
        fadeBack();
        break;
      case 370:
        tornado.assets.loader.cameraHandler.frame = 496;
        events.ToggleControls(true);
        break;
    }
  }

  function tweenTextOpacityDown () {
    _.each(tornado.assets.textMeshes, loopTextMeshes); // object that holds both lines of text

    function loopTextMeshes ( c ) { // line of text that holds bith text and outline
      _.each(c.children, loopTextChildren);
    }

    function loopTextChildren ( tc ) {
      if ( !tc.material ) return;

      if ( tc.material.uniforms ) {  // outlineShader
        var textTween = new aeTween( tc.material.uniforms.opacity );
        textTween.to( { value: 0 }, textFadeOutFrames );
        textTween.onComplete = function () { tc.visible = false; }
        textTween.start();
      }
      else {                         // basic material
        var textTween = new aeTween ( tc.material );
        textTween.to( { opacity: 0 }, textFadeOutFrames );
        textTween.onComplete = function () { tc.visible = false; }
        textTween.start();
      }
    }
  }

  function cleanUpperScene () {
    _.each(tornado.upperSceneDisposables, function (d) {
      tornado.assets.loader.DisposeObject(d);
    });
  }

  function revealLowerScene () {
    _.each(tornado.lowerSceneObjects, function (o) { o.visible = true; });

  }

  function throwBrick ( onComp, win ) {
    var startPos = new THREE.Vector3(-6.95, -420.64, 10);
    var bounceBackPos = new THREE.Vector3(-6.95, -430.64, 10);
    bounceBackPos.x += tornado.assets.loader.RandomNum ( -15, -3 );
    bounceBackPos.y += tornado.assets.loader.RandomNum ( -5, -3 );
    //bounceBackPos.z += tornado.assets.loader.RandomNum ( -5, 5 );
    var windowPos = new THREE.Vector3(-6.95, -420.64, -3.37);
    var geometry = new THREE.BoxGeometry( 0.5, 0.1, 0.3 );

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    tornado.assets.brickMat = tornado.assets.brickMat ||
                              materials.setMaterials("tornado", { name: "brick" });

    var material = tornado.assets.brickMat;
    ////////////
    materials.outlineShader.prototype = new THREE.ShaderMaterial();
     var outlineMaterial = new materials.outlineShader({
       thickness: 0.05,
       color: new THREE.Color("rgb(255, 0, 0)")
     });

     var mats = [material, outlineMaterial];
     var cube = THREE.SceneUtils.createMultiMaterialObject(geometry, mats);
    ///////////
    cube.position.copy(startPos);
    tornado.assets.scene.add( cube );

    if ( win == "ordinary" ) {
      var posTween = new aeTween( cube.position );
      posTween.to( { x: windowPos.x, y: windowPos.y, z: windowPos.z }, brickTravelTime );
      posTween.onComplete = function () {
        if( onComp ) onComp();
        var keepGoingTween = new aeTween( cube.position );
        keepGoingTween.to( { z: windowPos.z - 5 }, brickTravelTime );

        keepGoingTween.onComplete = function () {
          tornado.assets.loader.DisposeObject( cube, { all: true } ) ;
        };
        keepGoingTween.start();
      };

      posTween.start();
    }
    else if ( win == "cardinal" ) {

      var posTween = new aeTween( cube.position );
      posTween.to( { x: windowPos.x, y: windowPos.y, z: windowPos.z }, brickTravelTime );
      posTween.onComplete = function () {
        if( onComp ) onComp();
        var bounceBackTween = new aeTween( cube.position );
        bounceBackTween.to({ x: bounceBackPos.x,
                             y: bounceBackPos.y,
                             z: bounceBackPos.z
                           }, brickTravelTime );
        bounceBackTween.onComplete = function () {
          tornado.assets.loader.DisposeObject( cube, { all: true } ) ;
        };
        bounceBackTween.start();
      };

      posTween.start();
    }

    var rotTween = new aeTween( cube.rotation );
    rotTween.to( { x: -Math.PI * 2 } , 20);
    rotTween.repeat( 100 );
    rotTween.start();
  }

  function fadeToWhite () {
    var amount = tornado.assets.composer.fadeToWhitePass.uniforms.amount;
    var upTime = 15;

    /*var tweenUp = new TWEEN.Tween( amount );
    tweenUp.to( { value: 1 }, upTime );
    tweenUp.start();*/
    var tweenUp = new aeTween(amount);
    tweenUp.to({value: 1}, upTime);
    tweenUp.onComplete = function(){
      tornado.assets.loader.cameraHandler.frame = 225;
    };
    tweenUp.start();
  }

  function fadeBack () {
    var amount = tornado.assets.composer.fadeToWhitePass.uniforms.amount;
    var downTime = 10;

    var tweenDown = new aeTween( amount );
    tweenDown.to( { value: 0 }, downTime );
    tweenDown.start();
  }

  function tweenBloomDown () {
    var amount = tornado.assets.composer.bloomPass.copyUniforms.opacity;
    var tween = new TWEEN.Tween( amount );
    tween.to( { value: 0.3 }, 1000 );
    tween.start();
  }

  function rareLightning () {
    tornado.assets.lightningHandler.minBloom = tornado.bloomSettings.inside.min;
    tornado.assets.lightningHandler.maxBloom = tornado.bloomSettings.inside.max;
    tornado.assets.lightningHandler.minFramesToStrike = 200;
    tornado.assets.lightningHandler.maxFramesToStrike = 400;
  }

  function revealTornado () {
    var revealTime = 150, twistTime = 150, randomOffsetMax = 75;
    var twist = new aeTween(tornado.assets.Hurricane_arm.rotation);
    twist.to({ y: -Math.PI * 2 }, twistTime );
    twist.repeat( 3 );
    twist.start();

    _.each(tornado.assets.Hurricane_arms, function (arm) {
      var amount = arm.material.uniforms.opacVal
      var revealTween = new aeTween(amount);
      revealTween.to({value: 1}, revealTime);
      var delay = Math.round(Math.random() * randomOffsetMax);
      revealTween.delay(delay);
      revealTween.start();
    });
  }

  function randomDebreePos ( pos ) {
    var distance = 20;
    return new THREE.Vector3(
      pos.x + Math.random() * distance,
      pos.y + Math.random() * distance,
      pos.z + Math.random() * distance
    );
  }

  function startLightning  () {
    var lightningHandler = function () {
      this.frame = 0;
      //time
      this.upTime = tornado.lightningTime;
      this.downTime = tornado.lightningTime;
      //directional intensity
      this.maxInt = 0.5;
      this.minInt = 0;
      //bloom
      this.maxBloom = tornado.bloomSettings.outside.max;
      this.minBloom = tornado.bloomSettings.outside.min;
      //strikes
      this.strikes = 2;
      this.nextStrikeFrame = 30;
      this.minFramesToStrike = 50;
      this.maxFramesToStrike = 75;

      this.lightningStrike = function () {
        this.strikes = Math.random() <= 0.5 ? 1 : 2;

        for (var i = 0; i < this.strikes; i++) {
          /*light*/
          var tweenLightDown = new TWEEN.Tween( tornado.assets.directionalLight );
          tweenLightDown.to( { intensity: this.minInt }, this.downTime );

          var tweenLightUp = new TWEEN.Tween( tornado.assets.directionalLight );
          tweenLightUp.to( { intensity: this.maxInt }, this.upTime );
          tweenLightUp.chain(tweenLightDown);
          tweenLightUp.delay((this.upTime + this.downTime) * i);
          tweenLightUp.start();

          /*bloom*/
          var bloomAmount = tornado.assets.composer.bloomPass.copyUniforms.opacity;

          var tweenBloomDown = new TWEEN.Tween( bloomAmount );
          tweenBloomDown.to( { value: this.minBloom }, this.downTime );

          var tweenBloomUp = new TWEEN.Tween( bloomAmount );
          tweenBloomUp.to( { value: this.maxBloom }, this.upTime );
          tweenBloomUp.chain(tweenBloomDown);
          tweenBloomUp.delay((this.upTime + this.downTime) * i);
          tweenBloomUp.start();
        }

        /*reset and roll for next*/
        this.frame = 0;
        this.nextStrikeFrame = this.minFramesToStrike + (Math.floor(Math.random() *
          (this.maxFramesToStrike - this.minFramesToStrike)));
      };

      this.update = function () {
        if(++this.frame == this.nextStrikeFrame) this.lightningStrike();
      };
    };

    tornado.assets.lightningHandler = new lightningHandler();
    animate.updater.addHandler(tornado.assets.lightningHandler);
  };

  function startPhysics ( scene, loader ) {
    var emitterLocation = new THREE.Vector3(26.6, -414.2, 35.3),
    above = new THREE.Vector3(-20, -408, 10),
    size = 0.1,
    spawnTime = 500,
    appearTime = 1000,
    dissapearTime = 1000,
    maxScale = 0.3,
    minScale = 0.03;

    function spawnDebree(){
      var mat = tornado.assets.DebrisMaterial.clone();
      var box = new Physijs.ConvexMesh(tornado.assets.Debris.geometry.clone(), mat);
      box.scale.set(Math.random() * maxScale + minScale,
                    Math.random() * maxScale + minScale,
                    Math.random() * maxScale + minScale);

      var tweenOpacUp = new TWEEN.Tween( mat );
      tweenOpacUp.to( { opacity: 1 }, appearTime );
      tweenOpacUp.start();

      box.position.copy(randomDebreePos(above));
      box.rotation.set(Math.random(), Math.random(), Math.random())
      loader.scene.add( box );
      _.delay(hideDebree, tornado.debreeDestroyTime, {obj: box, material: mat}); //delay destroy for debree
    }

    tornado.intervals.debreeInterval = setInterval( spawnDebree, spawnTime );

    function hideDebree(data) {
        var tweenOpacDown = new TWEEN.Tween( data.material );
        tweenOpacDown.to( { opacity: 0 }, dissapearTime );
        tweenOpacDown.onComplete(function () { loader.DisposeObject(data.obj, {map: true}); });
        tweenOpacDown.start();
    }
  };

  function triggerSlowMo () {
    tornado.assets.rainPS.speed = 0.1;
    tornado.assets.scene.setGravity(tornado.slowMoGravity);
    tornado.debreeDestroyTime = tornado.slowModebreeDestroyTime;
    tornado.assets.lightningHandler.upTime = tornado.slowMoLightningTime;
    tornado.assets.lightningHandler.downTime = tornado.slowMoLightningTime;
    tornado.assets.cloudScrollingUV.speed = tornado.slowMoCloudSpeed;
  }

  var windowWobble = function () {
    var crackTex = THREE.ImageUtils.loadTexture(tornado.mediaFolderUrl+'/models/tornado/crack.jpg');
    var defines = {};
    defines[ "USE_MAP" ] = "";

    this.uniforms = THREE.UniformsUtils.merge( [
      THREE.UniformsLib[ "common" ],
      THREE.UniformsLib[ "fog" ],
      THREE.UniformsLib[ "lights" ],
      THREE.UniformsLib[ "shadowmap" ],
      {
        "ambient"  : { type: "c", value: new THREE.Color( 0xffffff ) },
        "emissive" : { type: "c", value: new THREE.Color( 0x000000 ) },
        "wrapRGB"  : { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) },
        "lightPosition"  : { type: "v3", value: new THREE.Vector3( 0.5, 0.2, 1.0 ) },
        "crackTex" : { type: "t", value: crackTex },
        "time"     : {type: 'f', value: 0},
        "freq"     : {type: 'f', value: 3},
        "amp"      : {type: 'f', value: 1.35},
        "frame"    : {type: 'f', value: 0.075}//,
        //"defines"  : defines
      }
    ]);

    //this.defines = defines;
    this.vertexShader = vSh();
    this.fragmentShader = fSh();
    this.side = 0;
    this.fog = false;
    this.envMap = materials.gloomyCloudsCube;
    this.transparent = true;
    this.uniforms.opacity.value = 0.6;
    //this.uniforms.combine = THREE.MixOperation;
    //this.wireframe = true;
    //this.uniforms.map.value = crackTex;
    this.lights = true;
    this.speed = 0.1;
    this.frame = 0;

    this.update = function() {
      //this.uniforms.time.value += this.speed;
    };

    function vSh() {
      return [
  			"#define LAMBERT",
  			"varying vec3 vLightFront;",
        "varying float zPos;",
        "varying vec3 vNormal;",
  			"varying vec3 vPosition;",
  			//"varying vec2 vUv;",
  			"#ifdef DOUBLE_SIDED",
  			"varying vec3 vLightBack;",
  			"#endif",
        "uniform float time;",
        "uniform float freq;",
        "uniform float frame;",
        "uniform float amp;",
  			THREE.ShaderChunk[ "common" ],
  			THREE.ShaderChunk[ "map_pars_vertex" ],
  			THREE.ShaderChunk[ "lightmap_pars_vertex" ],
  			THREE.ShaderChunk[ "envmap_pars_vertex" ],
  			THREE.ShaderChunk[ "lights_lambert_pars_vertex" ],
  			THREE.ShaderChunk[ "color_pars_vertex" ],
  			THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
  			THREE.ShaderChunk[ "skinning_pars_vertex" ],
  			THREE.ShaderChunk[ "shadowmap_pars_vertex" ],
  			THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

  			"void main() {",
  				THREE.ShaderChunk[ "map_vertex" ],
  				THREE.ShaderChunk[ "lightmap_vertex" ],
  				THREE.ShaderChunk[ "color_vertex" ],

  				THREE.ShaderChunk[ "morphnormal_vertex" ],
  				THREE.ShaderChunk[ "skinbase_vertex" ],
  				THREE.ShaderChunk[ "skinnormal_vertex" ],
  				THREE.ShaderChunk[ "defaultnormal_vertex" ],

  				THREE.ShaderChunk[ "morphtarget_vertex" ],
  				THREE.ShaderChunk[ "skinning_vertex" ],
  				THREE.ShaderChunk[ "default_vertex" ],
  				THREE.ShaderChunk[ "logdepthbuf_vertex" ],

  				THREE.ShaderChunk[ "worldpos_vertex" ],
  				THREE.ShaderChunk[ "envmap_vertex" ],
  				THREE.ShaderChunk[ "lights_lambert_vertex" ],
  				THREE.ShaderChunk[ "shadowmap_vertex" ],

          "float radius = distance(vec2(0.5, 0.5), uv);",
          //"vec3 offsetPos = vec3(position.x, position.y, amp * sin( time + radius * freq) ) ;",
          "vec3 offsetPos = vec3(position.x, position.y, smoothstep(-1., 0., amp*(sin(time) + ( radius + 0.3 ))) - 1.) ;",
          "float f = frame;",
          "if(uv.x > 1. - f || uv.x < f || uv.y > 1. - f || uv.y < f) offsetPos = position;",
          "vec4 pos = modelViewMatrix * vec4(offsetPos, 1.0);",
          "zPos = offsetPos.z;",
          //"vUv = uv;",
          "vNormal = normal;",
          "vPosition = offsetPos;",
          "gl_Position = projectionMatrix * pos;",
           //"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
  			"}"
  		].join("\n");
    }

    function fSh() {
      return [
        "uniform sampler2D crackTex;",
  			"uniform vec3 diffuse;",
  			"uniform vec3 emissive;",
        "uniform vec3 lightPosition;",
        "uniform mat4 modelMatrix;",
  			"uniform float opacity;",
        "varying float zPos;",
        //"varying vec2 vUv;",
        "varying vec3 vNormal;",
  			"varying vec3 vPosition;",

  			"varying vec3 vLightFront;",

  			"#ifdef DOUBLE_SIDED",

  			"	varying vec3 vLightBack;",

  			"#endif",

  			THREE.ShaderChunk[ "common" ],
  			THREE.ShaderChunk[ "color_pars_fragment" ],
  			THREE.ShaderChunk[ "map_pars_fragment" ],
  			THREE.ShaderChunk[ "alphamap_pars_fragment" ],
  			THREE.ShaderChunk[ "lightmap_pars_fragment" ],
  			THREE.ShaderChunk[ "envmap_pars_fragment" ],
  			THREE.ShaderChunk[ "fog_pars_fragment" ],
  			THREE.ShaderChunk[ "shadowmap_pars_fragment" ],
  			THREE.ShaderChunk[ "specularmap_pars_fragment" ],
  			THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

  			"void main() {",

  			"	vec3 outgoingLight = vec3( 0.0 );",	// outgoing light does not have an alpha, the surface does
  			"	vec4 diffuseColor = vec4( diffuse, opacity );",

  				THREE.ShaderChunk[ "logdepthbuf_fragment" ],
  				THREE.ShaderChunk[ "map_fragment" ],
  				THREE.ShaderChunk[ "color_fragment" ],
  				THREE.ShaderChunk[ "alphamap_fragment" ],
  				THREE.ShaderChunk[ "alphatest_fragment" ],
  				THREE.ShaderChunk[ "specularmap_fragment" ],

  			"	#ifdef DOUBLE_SIDED",

  					//"float isFront = float( gl_FrontFacing );",
  					//"gl_FragColor.xyz *= isFront * vLightFront + ( 1.0 - isFront ) * vLightBack;",

  			"		if ( gl_FrontFacing )",
  			"			outgoingLight += diffuseColor.rgb * vLightFront + emissive;",
  			"		else",
  			"			outgoingLight += diffuseColor.rgb * vLightBack + emissive;",

  			"	#else",

  			"		outgoingLight += diffuseColor.rgb * vLightFront + emissive;",

  			"	#endif",

  				THREE.ShaderChunk[ "lightmap_fragment" ],
  				THREE.ShaderChunk[ "envmap_fragment" ],
  				THREE.ShaderChunk[ "shadowmap_fragment" ],

  				THREE.ShaderChunk[ "linear_to_gamma_fragment" ],

  				THREE.ShaderChunk[ "fog_fragment" ],
          //"vec4 crackCol = texture2D( crackTex, vUv );",
  			  //"gl_FragColor = vec4(outgoingLight, diffuseColor.a );",
          //"gl_FragColor = texture2D( crackTex, vUv );",
          //"vec4 texel = texture2D( crackTex, vUv );",
          //"float dProd = dot(vNormal, vec3(vec4( lightPosition, 1.0) * modelMatrix));",

          //"vec3 lightVectorW = normalize(vec3( vec4( lightPosition, 1.0 ) * modelMatrix ) - vPosition);",
          //"float ndl = max(0.5, dot(vNormal, lightVectorW));",
          "gl_FragColor = vec4(outgoingLight, diffuseColor.a);",
  		"}"
  		].join("\n");
      }
    };
    return tornado;

  function addButtons () {
    tornado.buttons.cardinal.add();
    tornado.buttons.ordinary.add();
    tornado.buttons.wind.add();
    //tornado.buttons.reset.add();
  };

  }
}
return tornadoScene;
});
