define(["animate", "events", "animationHandler", "composers", "watch", "tween", "materials", "underscore"],
function (animate, events, animationHandler, composers, watch, tween, materials, underscore) {
  var tornado = {
    folderName: "tornado",
    assetNames: ["Floor_gird", "Background_clouds", "Earth_shell", "Earth_clouds", "House",
     "Floor_grass", "Hurricane_arm"],
    soundNames: [],
    onStartFunctions: {},
    onLoadFunctions: {},
    onUnloadFunctions: {},
    onFinishLoadFunctions: {},
    animationHandlers: {},
    assets: {}
  };

  /***on start functions***/
  tornado.onStartFunctions.setFramerate = function(scene){
    animate.SetCustomFramerate(25);
  };

  tornado.onStartFunctions.addLights = function(scene){
    scene.add(new THREE.AmbientLight(0xffffff));
  };

  /***on load functions***/
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

  tornado.onLoadFunctions.House = function (mesh) {
    mesh.material.materials[0].side = 2;
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
    tornado.assets.composer = new composers.Bloom_AdditiveColor({str: 1});
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

  /***on unload functions***/
  tornado.onUnloadFunctions.resetRenderFunction = function(){
    animate.SetDefaultRenderFunction();
  };

  tornado.onUnloadFunctions.resetFramerate = function(){
    animate.SetDefaultFramerate();
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
    tween.to( { value: 0 }, 1000 );
    tween.start();
  }

  function revealTornado() {
    var revealTime = 8000, twistTime = 6000, randomOffsetMax = 2000;

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

  return tornado;
});
