define(["underscore", "updater", "tween", "EffectComposer",
"CopyShader", "ShaderPass", "RenderPass", "BloomPass", "ConvolutionShader", "MaskPass"],
    function(underscore, updater, tween, EffectComposer,
      CopyShader, ShaderPass, RenderPass, BloomPass, ConvolutionShader, MaskPass){
    var animate = {
      fps: 30
    };//public functionality

    /***private fields***/
    var frameID = 0;//keeps track of frame number, can be used to cancelAnimationFrame
    //delta time (capped framerate) variables
    var then = _.now();
    var start = then;
    var now = undefined;
    var delta = undefined;//actual time between current and last frame
    var interval = 1000 / animate.fps;//ideal time in ms between frames
    /***end private fields***/

    /***private functions***/
    function resizeWindow(){
      var newSize = {
        width: $(animate.container).width(),
        height: $(animate.container).height()
      };
      animate.renderer.setSize( newSize.width, newSize.height );
		  animate.camera.aspect	= newSize.width / newSize.height;
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
    animate.container = undefined;//html element for webGL renderer
    animate.renderer = undefined;
    animate.camera = undefined;
    animate.loader = undefined;
    animate.updater = new updater();
		animate.composer = undefined;
    /***end public fields***/

    animate.Animate = function(systemDelta){
        frameID = requestAnimationFrame(animate.Animate);
        now = _.now();
        delta = now - then;
        if(delta >= interval){
            then = now - (delta % interval);
            TWEEN.update();
            animate.updater.UpdateHandlers();
            //animate.renderer.render(animate.loader.scene, animate.camera);
            //animate.composer.render();
            animate.RenderFunction();
        }
    };

    animate.StopAnimating = function () { cancelAnimationFrame(frameID); };

    animate.RenderFunction = function () {

    }

    animate.SetDefaultRenderFunction = function () {
      animate.RenderFunction = function(){animate.renderer.render(animate.loader.scene, animate.camera)};
    };
    animate.SetCustomRenderFunction = function (fun) { animate.RenderFunction = fun; };

    animate.SetCustomFramerate = function (f) {
      animate.fps = f;
      interval = 1000 / animate.fps
    };
    animate.SetDefaultFramerate = function () {
      animate.fps = 30;
      interval = 1000 / animate.fps;
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
