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
			camera.fov = animation.frames[animateCamera.frame].fov;
			camera.updateProjectionMatrix();

			camera.position.set(
				(animation.frames[animateCamera.frame].camera.x),
				(animation.frames[animateCamera.frame].camera.z),
				-(animation.frames[animateCamera.frame].camera.y));
		}
		else {camera.lookAt(camera.target); animateCamera.stop();} //reached the end
		},1000/animation.fps)
	}, 
	stop: function(){
		clearInterval(animation_interval);
	},
	checkPlayback: function(from, to){
		if (from < to){ //regular playback
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
	tween: function (frame, speed) {
	//position
		var startPos = camera.position;
		var destination = new THREE.Vector3(
			animation.frames[frame].camera.x, 
			animation.frames[frame].camera.z, 
			-animation.frames[frame].camera.y);

		var distance = startPos.distanceTo(destination);
		var time = distance / speed;

		var posTween = new TWEEN.Tween( camera.position );
		posTween.easing(TWEEN.Easing.Cubic.InOut);
	    posTween.to( { x: destination.x, y: destination.y, z: destination.z }, time );
	    posTween.start();
	//rotation
    	var rollAngle = animation.frames[frame].rollAngle;
    	var newUp = modifyCameraUp(rollAngle);
	    var angleTween = new TWEEN.Tween( camera.up );
	    angleTween.to( { x: newUp.x, y: newUp.y, z: newUp.z }, time );
	    angleTween.start();  
	//target
	    var target = new THREE.Vector3(animation.frames[frame].target.x, 
			animation.frames[frame].target.z, 
			-animation.frames[frame].target.y);

	    var targetTween = new TWEEN.Tween( camera.target )
	    targetTween.to( { x: target.x, y: target.y, z: target.z }, time );
	    targetTween.start();
	    targetTween.onUpdate( function () { camera.lookAt(camera.target) });
	//fov
	    var fovTween = new TWEEN.Tween( camera );
	    fovTween.to( { fov: animation.frames[frame].fov }, time);
	    fovTween.start();

	    fovTween.onUpdate( function () { camera.updateProjectionMatrix() }); 
	}	
}

var manageCameraAnimations = {
	playAnim_1: function(){ //both windows perspective
		animateCamera.play(camera_frames.animation_1.from, camera_frames.animation_1.to);
	},	
	playAnim_2: function () { //to slice
		setTimeout(function(){ manageVisibility.fadeOut(windowVertical, windowFadeTick);
							   manageVisibility.fadeOut(windowHorizontal, windowFadeTick); }, 350);	

		setTimeout(function(){ manageVisibility.fadeIn(slice, windowFadeTick); }, 500);		
		
		animateCamera.play(camera_frames.animation_2.from, camera_frames.animation_2.to);
		if(!slice.inScene) loadObject('cardinal_slice', undefined, addToScene, slice, false);
	},
	playZoomInAnim: function (anim) { //zoom in further on slice
		cancelAllTweens();
		manageEmissive.resetAllSlice();
		manageEmissive.modify(camera_frames[anim].frame);
		zoomedOnSlice = true;
		toggleInput(false);
		animateCamera.tween(camera_frames[anim].frame, camera_frames[anim].speed);
	},
	back: function() { //multiple back options
		if(animateCamera.frame == camera_frames.animation_2.to && //back to both windows
			!zoomedOnSlice){			
			manageVisibility.fadeIn(windowHorizontal, windowFadeTick);		
			manageVisibility.fadeIn(windowVertical, windowFadeTick);			
			manageVisibility.fadeOut(slice, windowFadeTick);
			animateCamera.play(camera_frames.animation_2.to, camera_frames.animation_2.from);
		}

		if(zoomedOnSlice){ //back to slice
			cancelAllTweens();
			manageEmissive.resetAllSlice();
			zoomedOnSlice = false;
			toggleInput(true);
			animateCamera.tween(camera_frames.animation_2.to, 0.05);
		} 
	}
}

function degreesToRadians (deg) { return deg * (Math.PI / 180); }
