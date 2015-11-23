define(["animate", "events", "animationHandler"], function (animate, events, animationHandler) {
  var tornado = {
    folderName: "tornado",
    assetNames: ["Floor_gird", "Background_clouds", "Earth_shell", "Earth_clouds"],
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

  tornado.onStartFunctions.addGround = function(scene){
    /*
    x:-358.5
    y:33.8
    z:-71.6
    len:2190
    wid:1265
    from X:-358
    to X:-110
    time: 8s
    */
  };

  /***on load functions***/
  tornado.onLoadFunctions.Earth_shell = function (mesh) {

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
    tornado.animationHandlers.cloudsAnim.play(0, 138);
  };

  /***on finish functions***/
  tornado.onFinishLoadFunctions.applyComposer = function(scene){
    var composer = new FadeToWhiteComposer();
    animate.SetCustomRenderFunction(function(){composer.render()});
  };

  tornado.onFinishLoadFunctions.addControls = function () {
      events.AddControls();
      events.ToggleControls(false);
  };

  /***on unload functions***/
  tornado.onUnloadFunctions.resetRenderFunction = function(){
    animate.SetDefaultRenderFunction();
  };

  tornado.onUnloadFunctions.resetFramerate = function(){
    animate.SetDefaultFramerate();
  };

  var FadeToWhiteComposer = function() {
    fadeToWhite = {
      uniforms: {
        "tDiffuse": { type: "t", value: null },
        "amount":   { type: "f", value: 0 }
      }
      ,
      vertexShader: [
        "varying vec2 vUv;",
        "void main() {",
          "vUv = uv;",
          "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
        "}"
      ].join( "\n" )
      ,
      fragmentShader: [
        "uniform sampler2D tDiffuse;",
        "varying vec2 vUv;",
        "uniform float amount;",

        "void main() {",
          "vec4 tex = texture2D(tDiffuse, vUv);",
          "gl_FragColor = vec4(tex.r + amount, tex.g + amount, tex.b + amount, tex.a);",
        "}"
      ].join( "\n" )
    };

    var rtParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat, stencilBuffer: true };
    var renderTarget = new THREE.WebGLRenderTarget( animate.renderSize.width,
      animate.renderSize.height, rtParameters );

    var composer = new THREE.EffectComposer( animate.renderer, renderTarget );
    composer.addPass( new THREE.RenderPass( animate.loader.scene, animate.camera ) );

    var effect = new THREE.ShaderPass( fadeToWhite );
    effect.renderToScreen = true;
    composer.addPass( effect );

    return composer;
  };

  return tornado;
});
