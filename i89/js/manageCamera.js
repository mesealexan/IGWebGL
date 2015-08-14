function modifyCameraUp (degrees) {	
	var radians = this.degreesToRadians(degrees);
	var newUp = new THREE.Vector3(0, Math.cos(radians), Math.sin(radians));
	var up = new THREE.Vector3( 0, 0, 1 );
	newUp.applyAxisAngle( up, radians );
	return newUp;
}

var animateCamera = {
	frame: -1,
	play: function(from, to){
		animateCamera.stop(animation_interval);
		//decrement because check below first increments then returns true
		animateCamera.frame = from - 1; 
		//decrement because 0 based
		to--;
		animation_interval = setInterval(function(){
		if(animateCamera.checkPlayback(from, to)){
			var newUp = modifyCameraUp(animation.frames[animateCamera.frame].rollAngle);
			camera.up.set(newUp.x, newUp.y, newUp.z);

			var lookAt = new THREE.Vector3(
				animation.frames[animateCamera.frame].target.x, 
				animation.frames[animateCamera.frame].target.z, 
				-animation.frames[animateCamera.frame].target.y);

			camera.target = lookAt;
			camera.lookAt(lookAt);
			camera.fov = animation.frames[animateCamera.frame].fov + fovModifier;
			camera.updateProjectionMatrix();

			camera.position.set(
				(animation.frames[animateCamera.frame].position.x),
				(animation.frames[animateCamera.frame].position.z),
				-(animation.frames[animateCamera.frame].position.y));
		}
		else {camera.lookAt(camera.target); animateCamera.stop();} //reached the end
		},1000/animation.fps)
	}, 
	stop: function(){
		clearInterval(animation_interval);
	},
	checkPlayback: function(from, to){
		if (from <= to){ //regular playback
			if (animateCamera.frame < to){ //still has to play
				animateCamera.frame++;
				return true;
			}
			else return false; //reached the end
		}	
		else if (from > to){ //reverse playback
			if (animateCamera.frame > to){ //still has to play
				animateCamera.frame--;
				return true;
			}
			else return false; //reached the end	
		}
	},
	tween: function (frame, speed, onComplete) {
	//position
		var startPos = camera.position;
		var destination = new THREE.Vector3(
			animation.frames[frame].position.x, 
			animation.frames[frame].position.z, 
			-animation.frames[frame].position.y);
		var distance = startPos.distanceTo(destination);
		var time = distance / speed;

		var posTween = new TWEEN.Tween( camera.position );
		posTween.easing(TWEEN.Easing.Cubic.InOut);
	    posTween.to( { x: destination.x, y: destination.y, z: destination.z }, time );
	    posTween.start();
	    posTween.onComplete(function() { if(onComplete) onComplete() });
	//rotation
    	var rollAngle = animation.frames[frame].rollAngle;
    	var newUp = modifyCameraUp(rollAngle);

	    var angleTween = new TWEEN.Tween( camera.up );
	    angleTween.easing(TWEEN.Easing.Cubic.InOut);
	    angleTween.to( { x: newUp.x, y: newUp.y, z: newUp.z }, time );
	    angleTween.start();  
	//target
	    var target = new THREE.Vector3(animation.frames[frame].target.x, 
			animation.frames[frame].target.z, 
			-animation.frames[frame].target.y);

	    var targetTween = new TWEEN.Tween( camera.target )
	    targetTween.easing(TWEEN.Easing.Cubic.InOut);
	    targetTween.to( { x: target.x, y: target.y, z: target.z }, time );
	    targetTween.start();
	    targetTween.onUpdate( function () { camera.lookAt(camera.target) });
	//fov
	    var fovTween = new TWEEN.Tween( camera );
	    fovTween.to( { fov: animation.frames[frame].fov + fovModifier }, time);
	    fovTween.start();
	    fovTween.onUpdate( function () { camera.updateProjectionMatrix() }); 
	}	
}

var manageCameraAnimations = {
	playAnim_1: function(){ //both windows perspective
		animateCamera.play(camera_frames.animation_1.from, camera_frames.animation_1.to);
	}
}

function setInitialCameraPos () {
	//position camera at start, no jitter when playback starts
	animateCamera.play(0, 1);
}

function degreesToRadians (deg) { return deg * (Math.PI / 180); }

