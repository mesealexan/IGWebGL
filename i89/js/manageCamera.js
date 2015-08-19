var cc = new cameraControls();
cc.setSource("media/camera/camera.JSON");
cc.play();

function cameraControls() {	
	addWatch(this);
	var animation, _this = this;
	this.frame = -1;

	this.setSource = function(path){ animation = parseJSON(path); }

	this.play = function(from, to){
		if(!animation) {console.error("animation undefined!"); return;}
		if(from == undefined) from = this.frame + 1;
		if(to == undefined) to = animation.frames.length - 1;

		this.stop(this.animation_interval);

		//decrement because check below first increments then returns true
		this.frame = from - 1; 
		//decrement because 0 based
		to--;

		this.animation_interval = setInterval(function(){
			if(_this.checkPlayback(from, to)){
				var newUp = _this.modifyCameraUp(animation.frames[_this.frame].rollAngle);
				camera.up.set(newUp.x, newUp.y, newUp.z);

				var lookAt = new THREE.Vector3(
					animation.frames[_this.frame].target.x, 
					animation.frames[_this.frame].target.z, 
				   -animation.frames[_this.frame].target.y);

				camera.target = lookAt;
				camera.lookAt(lookAt);
				camera.fov = animation.frames[_this.frame].fov + fovModifier;
				camera.updateProjectionMatrix();

				camera.position.set(
					(animation.frames[_this.frame].position.x),
					(animation.frames[_this.frame].position.z),
					-(animation.frames[_this.frame].position.y));
			}
			else {camera.lookAt(camera.target); this.stop();} //reached the end
		},1000/animation.fps)
	};

	this.pause = function(){clearInterval(this.animation_interval)};

	this.stop = function(){this.pause(); this.frame = -1};

	this.checkPlayback = function(from, to){
		if (from <= to) //regular playback
			if (this.frame++ < to) return true; //still has to play
			else return false; //reached the end
		
		else if (from > to) //reverse playback
			if (this.frame-- > to) return true; //still has to play						
			else return false; //reached the end	
	};

	this.tween = function (frame, speed, onComplete) {
		/***position***/
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

		/***rotation***/
    	var rollAngle = animation.frames[frame].rollAngle;
    	var newUp = this.modifyCameraUp(rollAngle);

	    var angleTween = new TWEEN.Tween( camera.up );
	    angleTween.easing(TWEEN.Easing.Cubic.InOut);
	    angleTween.to( { x: newUp.x, y: newUp.y, z: newUp.z }, time );
	    angleTween.start();  

		/***target***/
	    var target = new THREE.Vector3(animation.frames[frame].target.x, 
									   animation.frames[frame].target.z, 
			                          -animation.frames[frame].target.y);

	    var targetTween = new TWEEN.Tween( camera.target )
	    targetTween.easing(TWEEN.Easing.Cubic.InOut);
	    targetTween.to( { x: target.x, y: target.y, z: target.z }, time );
	    targetTween.start();
	    targetTween.onUpdate( function () { camera.lookAt(camera.target) });

		/***fov***/
	    var fovTween = new TWEEN.Tween( camera );
	    fovTween.to( { fov: animation.frames[frame].fov + fovModifier }, time);
	    fovTween.start();
	    fovTween.onUpdate( function () { camera.updateProjectionMatrix() }); 
	};

	this.modifyCameraUp = function (degrees) {	
		var radians = this.degreesToRadians(degrees);
		var newUp = new THREE.Vector3(0, Math.cos(radians), Math.sin(radians));
		var up = new THREE.Vector3( 0, 0, 1 );
		newUp.applyAxisAngle( up, radians );
		return newUp;
	};

	this.degreesToRadians = function (deg) { return deg * (Math.PI / 180) }
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

function addWatch (obj) {
	watch(obj, "frame", function(prop, action, newvalue, oldvalue){
	//console.log(newvalue)
	switch (newvalue){
		case 1:
			//
		break;
	}
});
}

