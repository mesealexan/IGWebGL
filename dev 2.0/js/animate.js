define(["underscore", "loader", "updater", "tween"],
    function(underscore, loader, updater, tween){
    var animate = {};//public functionality

    /***private fields***/
    var frameID = 0;//keeps track of frame number, can be used to cancelAnimationFrame
    //delta time variables
    var then = _.now();
    var now = undefined;
    var fps = 30;//should NOT change, all JSON files exported at 30 fps
    var delta = undefined;//actual time between current and last frame
    var interval = 1000 / fps;//ideal time in ms between frames
    /***end private fields***/

    /***public fields***/
    animate.renderer = undefined;
    animate.camera = undefined;
    animate.loader = undefined;
    animate.updater = new updater();
    /***end public fields***/

    animate.Animate = function(){
        frameID = requestAnimationFrame(animate.Animate);
        now = _.now();
        delta = now - then;
        if(delta > interval){
            then = now - (delta % interval);
            animate.updater.UpdateHandlers();
            TWEEN.update(undefined);//don't pass time, fixed tween.js for iOS
            animate.renderer.render(animate.loader.scene, animate.camera);
        }
    };
        
    animate.StopAnimating = function () { cancelAnimationFrame(frameID); };

    //handlers instantiated by scene meshes for updating transform data
    animate.PositionHandler = function(mesh, animation){
        this.frame = -1;
        this.update = function(){
            if(++this.frame < animation.frames.length){
                var curFrame = animation.frames[this.frame];
                mesh.position.set(curFrame.position.x, curFrame.position.z, curFrame.position.y);
            }else animate.updater.removeHandler(this);
        }
    };

    animate.PositionRotationHandler = function(mesh, animation){
        this.frame = -1;
        this.update = function(){
            if(++this.frame < animation.frames.length){
                var curFrame = animation.frames[this.frame];
                mesh.position.set(curFrame.position.x, curFrame.position.z, curFrame.position.y);

                mesh.rotation.setFromQuaternion (
                    new THREE.Quaternion(
                        curFrame.rotation.x, curFrame.rotation.z,
                       -curFrame.rotation.y, curFrame.rotation.w
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

    return animate;
});
