define(["genericHandler", "animate", "tween", "underscore", "events"],
    function(genericHandler, animate, tween, underscore, events){
    CameraHandler.prototype = new genericHandler();
    function CameraHandler(anim) {
        var animation = anim;

        this.started = false;

        this.setSource = function(p) { animation = (p) };

        this.play = function(from, to, onComplete, onStart){
            if(onComplete) this.onComplete = onComplete;
            this.started = true;
            if(!animation) {console.error("missing animation!"); return;}
            if(from == undefined) from = this.frame + 1;
            if(to == undefined) to = animation.frames.length - 1;
            this.basePlay(from, to);
            if(onStart)onStart();
        };

        this.update = function () {
            if(this.checkPlayback(this.from, this.to)){
                var curFrame = animation.frames[this.frame];
                var newUp = this.modifyCameraUp(curFrame.rollAngle);
                animate.camera.up.set(newUp.x, newUp.y, newUp.z);

                var lookAt = new THREE.Vector3(
                    curFrame.target.x,
                    curFrame.target.z,
                   -curFrame.target.y);

                animate.camera.target = lookAt;
                events.Controls.target.copy(lookAt);
                animate.camera.lookAt(lookAt);

                animate.camera.fov = curFrame.fov;
                animate.camera.updateProjectionMatrix();

                animate.camera.position.set(
                    curFrame.position.x,
                    curFrame.position.z,
                   -curFrame.position.y);
            }
            else {//reached the end
                animate.camera.lookAt(animate.camera.target);
                events.Controls.target.copy(animate.camera.target);
                this.stop();
            }
        };

        this.tween = function (frame, speed, onComplete) {
            /***position***/
            var startPos = animate.camera.position;
            var targetFrame = animation.frames[frame];
            var destination = new THREE.Vector3(
                targetFrame.position.x,
                targetFrame.position.z,
               -targetFrame.position.y);
            var distance = startPos.distanceTo(destination);
            var time = distance / speed;

            var posTween = new TWEEN.Tween( animate.camera.position );
            posTween.easing(TWEEN.Easing.Cubic.InOut);
            posTween.to( { x: destination.x, y: destination.y, z: destination.z }, time );
            posTween.onComplete(function() {
                if(onComplete != undefined && typeof onComplete == "function") onComplete();
            });
            posTween.start();

            /***rotation***/
            var rollAngle = targetFrame.rollAngle;
            var newUp = this.modifyCameraUp(rollAngle);
            var angleTween = new TWEEN.Tween( animate.camera.up );
            angleTween.easing(TWEEN.Easing.Cubic.InOut);
            angleTween.to( { x: newUp.x, y: newUp.y, z: newUp.z }, time );
            angleTween.start();

            /***target***/
            var target = new THREE.Vector3(
                targetFrame.target.x,
                targetFrame.target.z,
               -targetFrame.target.y);

            var targetTween = new TWEEN.Tween( animate.camera.target );
            targetTween.easing(TWEEN.Easing.Cubic.InOut);
            targetTween.to( { x: target.x, y: target.y, z: target.z }, time );
            targetTween.onUpdate( function () {
              animate.camera.lookAt(animate.camera.target);
              events.Controls.target.copy(animate.camera.target);
            });
            targetTween.start();

            /***fov***/
            var fovTween = new TWEEN.Tween( animate.camera );
            fovTween.to( { fov: targetFrame.fov }, time);
            fovTween.onUpdate( function () { animate.camera.updateProjectionMatrix() });
            fovTween.start();
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
