define(["animate", "events", "animationHandler", "composers", "watch", "tween",
"materials", "underscore", "particleSystem"],
function (animate, events, animationHandler, composers, watch, tween,
  materials, underscore, particleSystem) {

  var tornado = {
    folderName: "tornado",
    assetNames: ["Floor_gird", "Background_clouds", "Earth_shell", "Earth_clouds", "House",
     "Floor_grass", "Hurricane_arm", "Debris", "Tree_sway"],
    soundNames: [],
    onStartFunctions: {},
    onLoadFunctions: {},
    onUnloadFunctions: {},
    onFinishLoadFunctions: {},
    animationHandlers: {},
    intervals: {},
    assets: {},
    gravity: new THREE.Vector3(0, -15, -15 ),
    bloomSettings: {
      outside: {min: 0.8, max: 1.2},
      inside: {min: 0.4, max: 1}
    }
  };

  tornado.onFinishLoadFunctions.jumpAhead = function(scene, loader) {
    /*tweenBloomDown();
    loader.cameraHandler.frame = 250;
    animate.SetCustomFramerate(30);
    startLightning();
    setTimeout(function(){animate.updater.removeHandler(loader.cameraHandler)}, 2500);*/
    //setTimeout(function(){animate.updater.removeHandler(loader.cameraHandler)}, 1000);
  };

  /***on start functions***/
  tornado.onStartFunctions.startLightning = function () {
    startLightning();
  };

  tornado.onStartFunctions.setFramerate = function(scene){
    animate.SetCustomFramerate(25);
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

  /***on load functions***/
  tornado.onLoadFunctions.Debris = function (mesh) {
    mesh.material.materials[0].transparent = true;
    mesh.material.materials[0].opacity = 0;
    tornado.assets.Debris = mesh;
  };

  tornado.onLoadFunctions.Floor_gird = function (mesh, loader) {
    var PHY_Floor_girdMat = Physijs.createMaterial(
      mesh.material.clone(),
      .6, // medium friction
      .3 // low restitution
    );

    var PHY_Floor_gird = new Physijs.ConvexMesh (mesh.geometry.clone(), PHY_Floor_girdMat, 0 );
    loader.DisposeObject(mesh);
    loader.scene.add( PHY_Floor_gird );
  };

  tornado.onLoadFunctions.Earth_clouds = function (mesh) {
    mesh.material = mesh.material.materials[0];
    mesh.material.morphTargets = true;
    mesh.material.transparent = true;
    mesh.material.map.wrapS = THREE.RepeatWrapping;
    mesh.material.map.wrapT = THREE.RepeatWrapping;
    mesh.visible = false;

    var scrollingUV = function(){
      this.frame = 0;
      this.maxFrame = 200;
      this.speed = 0.0005;
      this.update = function () {
        //if(++this.frame == this.maxFrame) animate.updater.removeHandler(this);
        //else
        mesh.material.map.offset.x += this.speed;
      };
    };

    animate.updater.addHandler(new scrollingUV());
    tornado.animationHandlers.cloudsAnim = new animationHandler();
    tornado.animationHandlers.cloudsAnim.setMesh(mesh);
    tornado.animationHandlers.cloudsAnim.speed = 1;
    tornado.animationHandlers.cloudsAnim.play(0, 138);
  };

  tornado.onLoadFunctions.House = function (mesh, loader) {
    var PHY_houseMat = Physijs.createMaterial(
      mesh.material.clone(),
      .6, // medium friction
      .3 // low restitution
    );

    var PHY_houseMesh = new Physijs.ConvexMesh (mesh.geometry.clone(), PHY_houseMat, 0 );
    loader.DisposeObject(mesh);
    loader.scene.add( PHY_houseMesh );
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
      mesh.add(newArm);
    }
  };

  tornado.onLoadFunctions.Tree_sway = function (mesh, loader) {
    var trees = [mesh];
    var pos1 = new THREE.Vector3(-18.3, -430, -16.8);
    mesh.material.materials[0].morphTargets = true;
    mesh.position.copy(pos1);

    //create left side row of trees
    for (var i = 0; i < 2; i++) {
      var newMesh = mesh.clone();
      newMesh.position.copy(pos1);
      newMesh.position.z += 6 * (i + 1);
      loader.scene.add( newMesh );
      trees.push(newMesh);
    }

    for (var t = 0; t < trees.length; t++) {
      var scaleY = 0.7 + (Math.random() * 0.3);
      trees[t].scale.set(1, scaleY, 1);
      tornado.animationHandlers["ah"+t] = new animationHandler();
      tornado.animationHandlers["ah"+t].setMesh(trees[t]);
      tornado.animationHandlers["ah"+t].setInfluence(scaleY - 0.4);
      tornado.animationHandlers["ah"+t].loop(0, 29);
    }
  };

  /***on finish functions***/
  tornado.onFinishLoadFunctions.applyComposer = function(scene){
    tornado.assets.composer = new composers.Bloom_AdditiveColor({str: tornado.bloomSettings.outside.min });
    animate.SetCustomRenderFunction( function(){ tornado.assets.composer.render(); } );
  };

  tornado.onFinishLoadFunctions.addControls = function () {
      events.AddControls();
      //events.ToggleControls(false);
  };

  tornado.onFinishLoadFunctions.addWatch = function (scene, loader) {
    watch.watch(loader.cameraHandler, "frame", function(prop, action, newValue, oldValue) {
        reactToFrame(oldValue);
    });
  };

  tornado.onFinishLoadFunctions.startPhysics = function (scene, loader) {
    var emitterLocation = new THREE.Vector3(26.6, -414.2, 35.3);
    var above = new THREE.Vector3(-20, -408, 10);
    var size = 0.1;
    var destroyTime = 3000;
    var spawnTime = 250;
    var appearTime = 1000;
    var dissapearTime = 1000;

    tornado.intervals = setInterval( function(){
      var boxMat = Physijs.createMaterial(
        new THREE.MeshBasicMaterial( {color: Math.random() * 0xffffff} ),
        .6, // medium friction
        .3 // low restitution
      );

      var mat = tornado.assets.Debris.material.clone();
      var box = new Physijs.ConvexMesh(tornado.assets.Debris.geometry.clone(), mat);
      box.scale.set(
        Math.random() * 0.3,
        Math.random() * 0.3,
        Math.random() * 0.3
      );

      var tweenOpacUp = new TWEEN.Tween( mat.materials[0] );
      tweenOpacUp.to( { opacity: 1 }, appearTime );
      tweenOpacUp.start();

      box.position.copy(randomDebreePos(above));
      box.rotation.set(Math.random(), Math.random(), Math.random())
      loader.scene.add( box );
      _.delay(hideDebree, destroyTime, {obj: box, material: mat}); //delay destroy for debree
    }, spawnTime );

    function hideDebree(data) {
        var tweenOpacDown = new TWEEN.Tween( data.material.materials[0] );
        tweenOpacDown.to( { opacity: 0 }, dissapearTime );
        tweenOpacDown.onComplete(function () { loader.DisposeObject(data.obj); });
        tweenOpacDown.start();
    }
  }

  tornado.onFinishLoadFunctions.addRain = function (scene) {
    var rainSettings = {
        width: 50,
        height: 50,
        depth: 50,
        num: 300,
        size: {w: 0.1, h: 0.6},
        mapNames: ["water_drop"],
        pos: new THREE.Vector3(0, -408, 40),
        dir: new THREE.Vector3(0, -1, -1),
        speed: 2,
        fixedRot: {x: 0.6, y: 0, z: 0}
    };

    tornado.assets.rainPS = new particleSystem(rainSettings);
    tornado.assets.rainPS.Init(scene);
  };

  /***on unload functions***/
  tornado.onUnloadFunctions.resetRenderFunction = function(){
    animate.SetDefaultRenderFunction();
  };

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
      case 230:
        fadeToWhite();
        animate.SetCustomFramerate(30);
        tweenBloomDown();
        break;
      case 240:
        fadeBack();
        break;
    }
  }

  function fadeToWhite() {
    var amount = tornado.assets.composer.passes[1].uniforms.amount,
       upTime = 400;

    var tweenUp = new TWEEN.Tween( amount );
    tweenUp.to( { value: 1 }, upTime );
    tweenUp.start();
  }

  function fadeBack(){
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

    tornado.assets.lightningHandler.minBloom = tornado.bloomSettings.inside.min;
    tornado.assets.lightningHandler.maxBloom = tornado.bloomSettings.inside.max;
    tornado.assets.lightningHandler.minFramesToStrike = 100;
    tornado.assets.lightningHandler.maxFramesToStrike = 300;
    //console.log(tornado.assets.lightningHandler)
  }

  function revealTornado() {
    var revealTime = 8000, twistTime = 5000, randomOffsetMax = 2000;

    var tistTween = new TWEEN.Tween( tornado.assets.Hurricane_arm.rotation );
    tistTween.to( { y: -Math.PI * 2}, twistTime );
    tistTween.repeat( Infinity );
    tistTween.start();

    _.each(tornado.assets.Hurricane_arms, function (arm) {
      var amount = arm.material.uniforms.opacVal;
      var revealTween = new TWEEN.Tween( amount );
      revealTween.to( { value: 1 }, revealTime );
      revealTween.delay(Math.random() * randomOffsetMax)
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
      this.upTime = 75;
      this.downTime = 75;
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

  return tornado;
});
