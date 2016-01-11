define(["scene", "animate", "events", "animationHandler", "composers", "watch", "tween",
  "materials", "underscore", "particleSystem", "aeTween"],
function (scene, animate, events, animationHandler, composers, watch, tween,
  materials, underscore, particleSystem, aeTween) {

return function(){
  var tornado = new scene();
  tornado.folderName = "tornado";
  tornado.addAssets(["Floor_gird", "Background_clouds", "Earth_shell", "Earth_clouds", "House",
   "Floor_grass", "Hurricane_arm", "Debris", "Tree_sway", "Bush_sway",/* "Wind_1", "Wind_2", "Wind_3",*/
   "House_windows", "GoodWeatherBadWeather"]);
   //scroll clouds
   tornado.cloudSpeed = 0.0002;
   tornado.slowMoCloudSpeed = 0.0001;
   //gravity
   tornado.gravity = new THREE.Vector3(0, -15, -15 );
   tornado.slowMoGravity = new THREE.Vector3(0, -1, -1 );
   //debrees
   tornado.debreeDestroyTime = 3000;
   tornado.nomalModebreeDestroyTime = 3000;
   tornado.slowModebreeDestroyTime = 10000;
   //lightning
   tornado.lightningTime = 75;
   tornado.slowMoLightningTime = 200;
   //bloom
   tornado.bloomSettings = {
     outside: {min: 0.8, max: 1.2},
     inside: {min: 0.4, max: 1}
   };
   //upper scene aseets stored here for disposal
   tornado.upperSceneDisposables = [];
   tornado.lowerSceneObjects = [];

  tornado.onFinishLoadFunctions.jumpAhead = function(scene, loader) {
    /*tweenBloomDown();
    rareLightning();
    loader.cameraHandler.frame = 250;
    animate.SetCustomFramerate(30);
    cleanUpperScene();
    revealLowerScene();
    startPhysics(tornado.assets.scene, tornado.assets.loader);
    //startLightning();
    setTimeout(function(){animate.updater.removeHandler(loader.cameraHandler)}, 1000);
    setTimeout(function(){
      animate.updater.removeHandler(loader.cameraHandler);
      triggerSlowMo();
    }, 2000);
    throwBrick();*/
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
    //animate.updater.addHandler(material);
    var plane = new THREE.Mesh( geometry, material );
    plane.position.set(-6.95, -420.64, -3.37);
    scene.add( plane );
  };

  /***on load functions***/
  tornado.onLoadFunctions.GoodWeatherBadWeather = function (mesh, loader) {
    var material = new THREE.MeshBasicMaterial({color: 0x000000});
    materials.outlineShader.prototype = new THREE.ShaderMaterial();
    var outlineMaterial = new materials.outlineShader({
      thickness: 1,
      color: new THREE.Color("rgb(255,255,255)")
    });
    var mats = [material, outlineMaterial];
    var multiMesh = THREE.SceneUtils.createMultiMaterialObject(mesh.geometry, mats);
    loader.DisposeObject(mesh);
    loader.scene.add(multiMesh);
    tornado.upperSceneDisposables.push(multiMesh);

    multiMesh.position.set(-37, 180, 45);

    var textPosTween = new aeTween(multiMesh.position);
    textPosTween.to({x: 60, z: 170}, 100);
    textPosTween.start();
  }

  /*
  tornado.onLoadFunctions.Wind_1 = function (mesh) {
    tornado.animationHandlers.Wind_1 = prepareWind(mesh, 49)
  }
  tornado.onLoadFunctions.Wind_2 = function (mesh) {
    tornado.animationHandlers.Wind_2 = prepareWind(mesh, 58)
  }
  tornado.onLoadFunctions.Wind_3 = function (mesh) {
    tornado.animationHandlers.Wind_2 = prepareWind(mesh, 48)
  }
  */

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



  tornado.onLoadFunctions.House_windows = function (mesh) {
    tornado.lowerSceneObjects.push(mesh);
    mesh.visible = false;
      mesh.material = materials.setMaterials("cardinal", {name:"Glass"});
  }

  tornado.onLoadFunctions.Background_clouds = function (mesh) {
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

  tornado.onLoadFunctions.Earth_shell = function (mesh) {
    tornado.upperSceneDisposables.push(mesh);
      var ae = new aeTween(mesh.position);
      ae.to({x: 250}, 230);
      ae.start();

      /*materials.vertHeightMat.prototype = new THREE.ShaderMaterial();
      mesh.material = new materials.vertHeightMat();*/

  };

  tornado.onLoadFunctions.Debris = function (mesh) {
    mesh.material.materials[0].transparent = true;
    mesh.material.materials[0].opacity = 0;
    tornado.assets.DebrisMaterial = mesh.material.materials[0];
    tornado.assets.Debris = mesh;
  };

  tornado.onLoadFunctions.Floor_grass = function (mesh, loader) {
    tornado.lowerSceneObjects.push(mesh);
    mesh.visible = false;
  };

  tornado.onLoadFunctions.Floor_gird = function (mesh, loader) {
    tornado.lowerSceneObjects.push(mesh);

    materials.floorGrid.prototype = new THREE.ShaderMaterial();
    mesh.material = new materials.floorGrid();

    mesh.visible = false;
    var PHY_Floor_girdMat = Physijs.createMaterial(
      mesh.material.clone(),
      .6, // medium friction
      .3  // low restitution
    );

    var PHY_Floor_gird = new Physijs.ConvexMesh (mesh.geometry.clone(), PHY_Floor_girdMat, 0 );
    loader.DisposeObject(mesh);
    loader.scene.add( PHY_Floor_gird );

    tornado.lowerSceneObjects.push(PHY_Floor_gird);
    PHY_Floor_gird.visible = false;
  };

  tornado.onLoadFunctions.Earth_clouds = function (mesh) {
    var noiseSize = 256;
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

  tornado.onLoadFunctions.House = function (mesh, loader) {
    var PHY_houseMat = Physijs.createMaterial(
      mesh.material.clone(),
      .6, // medium friction
      .3  // low restitution
    );

    var PHY_houseMesh = new Physijs.ConvexMesh (mesh.geometry.clone(), PHY_houseMat, 0 );
    loader.DisposeObject(mesh);
    loader.scene.add(PHY_houseMesh);
    tornado.lowerSceneObjects.push(PHY_houseMesh);
    PHY_houseMesh.visible = false;
  };

  tornado.onLoadFunctions.Hurricane_arm = function (mesh) {
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

  tornado.onLoadFunctions.Tree_sway = function (mesh, loader) {
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

  tornado.onLoadFunctions.Bush_sway = function (mesh, loader) {
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
     loader.cameraHandler.play(undefined,undefined,undefined,//from, to and onComplete undefined
       animate.Animate);
  };

  tornado.onFinishLoadFunctions.applyComposer = function(scene){
    tornado.assets.composer = new composers.Bloom_AdditiveColor({str: tornado.bloomSettings.outside.min});
    animate.SetCustomRenderFunction( function(){ tornado.assets.composer.render(); } );
    events.addDOF_GUI(tornado);
  };

  tornado.onFinishLoadFunctions.addControls = function () {
      events.AddControls();
      events.ToggleControls(false);
  };

  tornado.onFinishLoadFunctions.addWatch = function (scene, loader) {
    watch.watch(loader.cameraHandler, "frame", function(prop, action, newValue, oldValue) {
        reactToFrame(oldValue);
    });
  };

  tornado.onFinishLoadFunctions.addRain = function (scene) {
    var rainSettings = {
        width: 50,
        height: 50,
        depth: 50,
        num: 300,
        size: {w: 0.1, h: 0.8},
        mapNames: ["water_drop"],
        pos: new THREE.Vector3(0, -408, 40),
        dir: new THREE.Vector3(0, -1, -1),
        speed: 2,
        fixedRot: {x: 0.6, y: 0, z: 0}
    };

    tornado.assets.rainPS = new particleSystem(rainSettings);
    //tornado.assets.rainPS.Init(scene);
  };

  tornado.onFinishLoadFunctions.addLeaves = function (scene) {
    var leavesSettings = {
        width: 50,
        height: 50,
        depth: 50,
        num: 30,
        size: {w: 0.5, h: 0.5},
        mapNames: ["Leaf_1_diff", "Leaf_2_diff", "Leaf_3_diff"],
        pos: new THREE.Vector3(0, -458, 40),
        dir: new THREE.Vector3(0, -1, -1),
        speed: 0.5,
        fixedRot: {x: 0.6, y: 0, z: 0},
        rot: { x: Math.PI / 20, y: Math.PI / 20, z: Math.PI / 20 },
        rndRotInit: true
    };
  };

  /***on unload functions***/
  tornado.onUnloadFunctions.resetFramerate = function(){
    animate.SetDefaultFramerate();
  };

  tornado.onUnloadFunctions.clearIntervals = function(){
    for (var key in tornado.intervals)
      if (tornado.intervals.hasOwnProperty(key))
        clearInterval(tornado.intervals[key]);
  };

  /***private functions***/
  function reactToFrame(frame) {
    switch (frame) {
      case 0:
        revealTornado();
        break;
      case 200:
        fadeToWhite();
        tornado.assets.rainPS.Init(tornado.assets.scene);
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
      case 270:
        //triggerSlowMo();
        break;
      case 280:
        throwBrick();
        events.ToggleControls(true);
        break;
    }
  }

  function cleanUpperScene() {
    _.each(tornado.upperSceneDisposables, function (d) {
      tornado.assets.loader.DisposeObject(d);
    });
  }

  function revealLowerScene () {
    _.each(tornado.lowerSceneObjects, function (o) { o.visible = true; });

  }

  function throwBrick() {
    var startPos =  new THREE.Vector3(-6.95, -400.64, 100);
    var windowPos = new THREE.Vector3(-6.95, -420.64, -3.37);
    var time = 6000;

    var geometry = new THREE.BoxGeometry( 0.5, 0.1, 0.3 );
    var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    var cube = new THREE.Mesh( geometry, material );
    cube.position.copy(startPos);
    tornado.assets.scene.add( cube );

    var posTween = new TWEEN.Tween( cube.position );
    posTween.to( { x: windowPos.x, y: windowPos.y, z: windowPos.z }, time );
    posTween.onComplete(function () {
      cube.visible = false;
      tornado.assets.shatterWindowMaterial.uniforms.amp.value = 0.05;
      animate.updater.addHandler(tornado.assets.shatterWindowMaterial);
    })
    posTween.start();

    var rotTween = new TWEEN.Tween( cube.rotation );
    rotTween.to( { x: -Math.PI * 2 }, 500 );
    rotTween.repeat( Infinity );
    rotTween.start();
  }

  function fadeToWhite() {
    var amount = tornado.assets.composer.passes[1].uniforms.amount,
        upTime = 1000;

    var tweenUp = new TWEEN.Tween( amount );
    tweenUp.to( { value: 1 }, upTime );
    tweenUp.start();
  }

  function fadeBack() {
    var amount = tornado.assets.composer.passes[1].uniforms.amount,
        downTime = 800;

    var tweenDown = new TWEEN.Tween( amount );
    tweenDown.to( { value: 0 }, downTime );
    tweenDown.start();
  }

  function tweenBloomDown() {
    var amount = tornado.assets.composer.passes[2].copyUniforms.opacity;
    var tween = new TWEEN.Tween( amount );
    tween.to( { value: 0.3 }, 1000 );
    tween.start();
  }

  function rareLightning() {
    tornado.assets.lightningHandler.minBloom = tornado.bloomSettings.inside.min;
    tornado.assets.lightningHandler.maxBloom = tornado.bloomSettings.inside.max;
    tornado.assets.lightningHandler.minFramesToStrike = 200;
    tornado.assets.lightningHandler.maxFramesToStrike = 400;
  }

  function revealTornado() {
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

  function randomDebreePos(pos){
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
          var bloomAmount = tornado.assets.composer.passes[2].copyUniforms.opacity;

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

  function startPhysics(scene, loader) {
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

  function triggerSlowMo(){
    tornado.assets.rainPS.speed = 0.1;
    tornado.assets.scene.setGravity(tornado.slowMoGravity);
    tornado.debreeDestroyTime = tornado.slowModebreeDestroyTime;
    tornado.assets.lightningHandler.upTime = tornado.slowMoLightningTime;
    tornado.assets.lightningHandler.downTime = tornado.slowMoLightningTime;
    tornado.assets.cloudScrollingUV.speed = tornado.slowMoCloudSpeed;
  }

  var windowWobble = function () {
    var crackTex = THREE.ImageUtils.loadTexture(tornado.mediaFolderUrl+'/models/tornado/crack.jpg');

    this.uniforms = THREE.UniformsUtils.merge( [
      THREE.UniformsLib[ "common" ],
      THREE.UniformsLib[ "fog" ],
      THREE.UniformsLib[ "lights" ],
      THREE.UniformsLib[ "shadowmap" ],
      {
        "ambient"  : { type: "c", value: new THREE.Color( 0xffffff ) },
        "emissive" : { type: "c", value: new THREE.Color( 0x000000 ) },
        "wrapRGB"  : { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) },
        "crackTex" : { type: "t", value: crackTex },
        "time"     : {type: 'f', value: 0},
        "freq"     : {type: 'f', value: 10},
        "amp"      : {type: 'f', value: 0}
      }
    ]);

    //this.defines = {USE_MAP: true};
    this.vertexShader = vSh();
    this.fragmentShader = fSh();
    this.side = 0;
    this.fog = false;
    this.envMap = materials.cloudCube;
    this.transparent = true;
    this.uniforms.opacity.value = 0.6;
    //this.uniforms.map.value = crackTex;
    this.lights = true;
    this.speed = 50;
    this.frame = 0;

    this.update = function() { this.uniforms.time.value += this.speed; };

    function vSh() {
      return [
  			"#define LAMBERT",
  			"varying vec3 vLightFront;",
        "varying float zPos;",
  			"#ifdef DOUBLE_SIDED",
  			"varying vec3 vLightBack;",
  			"#endif",
        "uniform float time;",
        "uniform float freq;",
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
          /*"float radius = length(position);",
          "vec3 offsetPos = vec3(position.x, position.y, amp * sin(radius * freq + time));",
          "vec4 pos = modelViewMatrix * vec4(offsetPos, 1.0);",
          "zPos = offsetPos.z;",
          "gl_Position = projectionMatrix * pos;",*/
          "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
  			"}"
  		].join("\n");
    }

    function fSh() {
      return [
        "uniform sampler2D crackTex;",
  			"uniform vec3 diffuse;",
  			"uniform vec3 emissive;",
  			"uniform float opacity;",
        "varying float zPos;",

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
          "gl_FragColor = vec4(outgoingLight, diffuseColor.a);",
  		"}"
  		].join("\n");
      }
    };
    return tornado;
}
//  return tornado;
});
