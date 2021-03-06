define(["underscore", "updater", "tween", "EffectComposer", "CopyShader", "ShaderPass", "RenderPass",
  "BloomPass", "ConvolutionShader", "MaskPass", "BokehPass", "BokehShader", "SSAOShader", "camPan"],
function(underscore, updater, tween, EffectComposer, CopyShader, ShaderPass, RenderPass,
  BloomPass, ConvolutionShader, MaskPass, BokehPass, BokehShader, SSAOShader, camPan){
    var animate = {
      fps: 30,
      asleep: false,
      container: undefined, //html element for webGL renderer
      renderer: undefined,
      camera: undefined,
      loader: undefined,
      updater: new updater(),
      composer: undefined,
      onLoadProgress: { },
      lowPowerTimeoutID: undefined,// id used for sleep mode,
      panTimeoutID: undefined,
      lastSystemDelta: 0
    };//public functionality

    /***private fields***/
    var frameID = 0;// keeps track of frame number, can be used to cancelAnimationFrame
    // delta time (capped framerate) variables
    var then = _.now();
    var start = then;
    var now = undefined;
    var delta = undefined; // actual time between current and last frame
    var interval = 1000 / animate.fps; // ideal time in ms between frames
    // timeout ( power saving mode ) variables
    var timeoutTime = 120000; // ms
    var panTime = 600;
    /***end private fields***/

    window.addEventListener('orientationchange', onOrientationChange);
    function onOrientationChange(){ resizeWindow(); }

    /***private functions***/
    function resizeWindow(){

      animate.renderSize = {
        width:  $(animate.container).width(),
        height: $(animate.container).height()
      };

      animate.renderer.setSize( animate.renderSize.width, animate.renderSize.height );

      if ( animate.composer ) {

        animate.composer.setSize( animate.renderSize.width , animate.renderSize.height );

        animate.composer.fxaaPass.uniforms[ 'resolution' ].value.set(
          1 / animate.renderSize.width,
          1 / animate.renderSize.height
        );

        animate.composer.reset();

      }

      animate.camera.aspect	= animate.renderSize.width / animate.renderSize.height;
      animate.camera.updateProjectionMatrix();

    }

    function startWindowAutoResize() {
      window.addEventListener('resize', resizeWindow, false);
    }

    function stopWindowAutoResize() {
      window.removeEventListener('resize', resizeWindow);
    }


    /***end private functions***/

    /***public fields***/

    /***end public fields***/
    animate.Animate = function( systemDelta ){
      frameID = requestAnimationFrame( animate.Animate );
      now = _.now();
      delta = now - then;
      if( delta >= interval ) {
        then = now - (delta % interval);
        animate.renderer.clear();
        animate.loader.scene.simulate(); // run physics
        TWEEN.update();
        animate.updater.UpdateHandlers( performance.now() );
        animate.RenderFunction();
      }
    };

    animate.StopAnimating = function () {
      cancelAnimationFrame(frameID);
    };

    animate.RenderFunction = function () { };

    animate.Fullscreen = function(){
      var elem = document.documentElement;//document.getElementById(animate.containerID);
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      }
      resizeWindow();
    }

    animate.SetDefaultRenderFunction = function () {
  		animate.ResizeWindow();
      animate.RenderFunction =
        function () {
          animate.renderer.render( animate.loader.scene, animate.camera )
        };
    };

    animate.SetCustomRenderFunction = function (fun) {
  		animate.ResizeWindow();
      animate.RenderFunction = fun;
    };

    animate.SetCameraDelaultValues = function(){
      animate.camera.near = animate.camera.defaultNear;
      animate.camera.far = animate.camera.defaultFar;
      animate.camera.updateProjectionMatrix();
    };

    animate.SetCustomFramerate = function ( f ) {
      animate.fps = f;
      interval = 1000 / animate.fps
    };

    animate.SetDefaultFramerate = function () {
      animate.fps = 30;
      interval = 1000 / animate.fps;
    };

    animate.StartTimeout = function (obj) {
      obj = obj || {};
      if ( !obj.noLowPower ) animate.StartLowPowerTimeout();
      if ( !obj.noPan ) animate.StartPanTimeout();
    };

    animate.StartPanTimeout = function () {
      animate.panTimeoutID = _.delay( function(){ animate.cPan.Start() }, panTime );
    };

    animate.ClearPanTimeout = function () {
      if ( animate.panTimeoutID != undefined ) clearTimeout ( animate.panTimeoutID );
      animate.panTimeoutID = undefined;
    };

    animate.StartLowPowerTimeout = function () {
      animate.lowPowerTimeoutID = _.delay( animate.Sleep, timeoutTime );
    };

    animate.ClearLowPowerTimeout = function () {
      if ( animate.lowPowerTimeoutID != undefined ) clearTimeout ( animate.lowPowerTimeoutID );
      animate.lowPowerTimeoutID = undefined;
    };

    animate.StopPan = function () {
      animate.cPan.Stop();
    }

    animate.ResetTimeout = function () {
      if( animate.panTimeoutID != undefined ) { // timeout not requested by scene yet
        animate.ClearPanTimeout();
        animate.StartPanTimeout();
      }

      if( animate.lowPowerTimeoutID != undefined ) { // timeout not requested by scene yet
        animate.ClearLowPowerTimeout();
        animate.StartLowPowerTimeout();
      }

      if ( animate.asleep == true ) animate.Awake();
    };

    animate.Sleep = function () {
      animate.asleep = true;
      animate.loader.LowPowerScreen.show();
      animate.StopAnimating();
    };

    animate.Awake = function () {
      animate.asleep = false;
      animate.loader.LowPowerScreen.hide();
      animate.Animate();
    };

    //handlers instantiated by scene meshes for updating transform data
    animate.PositionHandler = function(mesh, animation){
        this.frame = -1;
        this.update = function(){
            if(++this.frame < animation.frames.length){
                var curFrame = animation.frames[this.frame];
                mesh.position.set(curFrame.position.x, curFrame.position.z, curFrame.position.y);
            }
            else animate.updater.removeHandler(this);
        }
    };

    animate.PositionRotationHandler = function(mesh, animation){
        this.frame = -1;
        this.update = function(){
            if(++this.frame < animation.frames.length){
                var curFrame = animation.frames[this.frame];
                mesh.position.set(curFrame.position.x, curFrame.position.z, -curFrame.position.y);

                mesh.rotation.setFromQuaternion (
                    new THREE.Quaternion(
                        curFrame.rotation.x,
                        curFrame.rotation.z,
                       -curFrame.rotation.y,
                        curFrame.rotation.w
                    ).normalize());
            }else animate.updater.removeHandler(this);
        }
    };

    animate.RotateZ = function(direction, time, repeat) {
        //direction 1 cw, -1 ccw
        var tween = new TWEEN.Tween( this.rotation );
        tween.to( { z: -Math.PI * 2 * direction}, time );
        if(repeat != undefined) tween.repeat( repeat );
        tween.start();
    };

    animate.TweenOpacity = function(obj, to, time, delayTime, onComp) {
        var tween = new TWEEN.Tween( obj );
        if(delayTime != undefined) tween.delay(delayTime);
        if(onComp) tween.onComplete(function(){onComp();});
        tween.to( { opacity: to }, time );
        tween.start();
    };

    animate.StartWindowAutoResize = startWindowAutoResize;
    animate.StopWindowAutoResize = stopWindowAutoResize;
    animate.ResizeWindow = resizeWindow;

    return animate;
});
