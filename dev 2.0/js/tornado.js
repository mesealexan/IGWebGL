define(["animate", "events", "animationHandler", "composers", "watch", "tween", "materials", "underscore"],
function (animate, events, animationHandler, composers, watch, tween, materials, underscore) {
  var tornado = {
    folderName: "tornado",
    assetNames: ["Floor_gird", "Background_clouds", "Earth_shell", "Earth_clouds", "House",
     "Floor_grass", "Hurricane_arm", "Debris"],
    soundNames: [],
    onStartFunctions: {},
    onLoadFunctions: {},
    onUnloadFunctions: {},
    onFinishLoadFunctions: {},
    animationHandlers: {},
    intervals: {},
    assets: {},
    gravity: new THREE.Vector3(0, -15, -15 )
  };

  /***on start functions***/
  tornado.onStartFunctions.setFramerate = function(scene){
    animate.SetCustomFramerate(25);
  };

  tornado.onStartFunctions.setPhysics = function(scene){
    scene.setGravity(tornado.gravity);
    scene.update = function() { scene.simulate( undefined, 1 ); };
  };

  tornado.onStartFunctions.addLights = function(scene){
    scene.add(new THREE.AmbientLight(0xffffff));
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

    var scrollingUV = function(){
      this.frame = 0;
      this.maxFrame = 200;
      this.speed = 0.0005;
      this.update = function () {
        if(++this.frame == this.maxFrame) animate.updater.removeHandler(this);
        else mesh.material.map.offset.x += this.speed;
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

  /***on finish functions***/
  tornado.onFinishLoadFunctions.applyComposer = function(scene){
    tornado.assets.composer = new composers.Bloom_AdditiveColor({str: 0.6});
    animate.SetCustomRenderFunction( function(){ tornado.assets.composer.render(); } );
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

  tornado.onFinishLoadFunctions.jumpAhead = function(scene, loader) {
    tweenBloomDown();
    loader.cameraHandler.frame = 250;
    setTimeout(function(){animate.updater.removeHandler(loader.cameraHandler)}, 2500);
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

  function reactToFrame(frame) {
    switch (frame) {
      case 10:
        revealTornado();
        break;
      case 230:
        fadeToWhite();
        tweenBloomDown();
        break;
      case 240:
        fadeBack();
        break;
    }
  }

  function fadeToWhite() {//fades to white
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

  return tornado;
});
