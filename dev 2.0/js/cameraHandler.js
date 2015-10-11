define(["genericHandler", "animate"], function(genericHandler, animate){
    CameraHandler.prototype = new genericHandler();
    function CameraHandler(anim) {
        var animation = anim;

        this.setSource = function(p) { animation = (p) };

        this.play = function(from, to){
            if(!animation) {console.error("missing animation!"); return;}
            if(from == undefined) from = this.frame + 1;
            if(to == undefined) to = animation.frames.length - 1;
            this.basePlay(from, to);
        };

        this.update = function () {
            if(this.checkPlayback(this.from, this.to)){
                var newUp = this.modifyCameraUp(animation.frames[this.frame].rollAngle);
                animate.camera.up.set(newUp.x, newUp.y, newUp.z);

                var lookAt = new THREE.Vector3(
                    animation.frames[this.frame].target.x,
                    animation.frames[this.frame].target.z,
                    -animation.frames[this.frame].target.y);

                animate.camera.target = lookAt;
                //todo: link controls here
                //controls.target.copy(lookAt);
                animate.camera.lookAt(lookAt);
                animate.camera.fov = animation.frames[this.frame].fov;
                animate.camera.updateProjectionMatrix();

                animate.camera.position.set(
                    (animation.frames[this.frame].position.x),
                    (animation.frames[this.frame].position.z),
                    -(animation.frames[this.frame].position.y));
            }
            else {animate.camera.lookAt(animate.camera.target); this.stop();} //reached the end
        };

        this.tween = function (frame, speed, onComplete) {
            /***position***/
            var startPos = animate.camera.position;
            var destination = new THREE.Vector3(
                animation.frames[frame].position.x,
                animation.frames[frame].position.z,
                -animation.frames[frame].position.y);
            var distance = startPos.distanceTo(destination);
            var time = distance / speed;

            var posTween = new TWEEN.Tween( animate.camera.position );
            posTween.easing(TWEEN.Easing.Cubic.InOut);
            posTween.to( { x: destination.x, y: destination.y, z: destination.z }, time );
            posTween.start();
            posTween.onComplete(function() { if(onComplete) onComplete() });

            /***rotation***/
            var rollAngle = animation.frames[frame].rollAngle;
            var newUp = this.modifyCameraUp(rollAngle);

            var angleTween = new TWEEN.Tween( animate.camera.up );
            angleTween.easing(TWEEN.Easing.Cubic.InOut);
            angleTween.to( { x: newUp.x, y: newUp.y, z: newUp.z }, time );
            angleTween.start();

            /***target***/
            var target = new THREE.Vector3(animation.frames[frame].target.x,
                animation.frames[frame].target.z,
                -animation.frames[frame].target.y);

            var targetTween = new TWEEN.Tween( animate.camera.target )
            targetTween.easing(TWEEN.Easing.Cubic.InOut);
            targetTween.to( { x: target.x, y: target.y, z: target.z }, time );
            targetTween.start();
            targetTween.onUpdate( function () { animate.camera.lookAt(animate.camera.target) });

            /***fov***/
            var fovTween = new TWEEN.Tween( animate.camera );
            fovTween.to( { fov: animation.frames[frame].fov + fovModifier }, time);
            fovTween.start();
            fovTween.onUpdate( function () { animate.camera.updateProjectionMatrix() });
        };

        this.modifyCameraUp = function (degrees) {
            var radians = this.degreesToRadians(degrees);
            var newUp = new THREE.Vector3(0, Math.cos(radians), Math.sin(radians));
            var up = new THREE.Vector3( 0, 0, 1 );
            newUp.applyAxisAngle( up, radians );
            return newUp;
        };

        this.degreesToRadians = function (deg) { return deg * (Math.PI / 180) };
    }
    return CameraHandler;
});