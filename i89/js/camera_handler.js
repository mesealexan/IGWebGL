CameraHandler.prototype = new GenericHandler();
var ch = new CameraHandler();

function GenericHandler () {
	_this = this;
	this.frame = -1;
	this.from = undefined;
	this.to = undefined;

	this.basePlay = function(from, to){
		this.from = from;
		this.frame = this.from - 1; 
		this.to = --to;

		updater.addHandler(this);
	};

	this.update = function() {};

	this.pause = function() { updater.removeHandler(this) };

	this.stop = function() { this.pause(); this.frame = -1 };

	this.checkPlayback = function(from, to){
		if (from <= to) //regular playback
			if (this.frame++ < to) return true; //still has to play
			else return false; //reached the end
		
		else if (from > to) //reverse playback
			if (this.frame-- > to) return true; //still has to play
			else return false; //reached the end
	};
}

function CameraHandler() {
	var animation;

	this.setSource = function(p) { animation = parseJSON(p) }

	this.play = function(from, to){
		if(from == undefined) from = this.frame + 1;
		if(to == undefined) to = animation.frames.length - 1;
		this.basePlay(from, to);
	}

	this.update = function () {
		if(this.checkPlayback(this.from, this.to)){
			//return;
			var newUp = this.modifyCameraUp(animation.frames[this.frame].rollAngle);
			camera.up.set(newUp.x, newUp.y, newUp.z);

			var lookAt = new THREE.Vector3(
				animation.frames[this.frame].target.x, 
				animation.frames[this.frame].target.z, 
			   -animation.frames[this.frame].target.y);

			camera.target = lookAt;
            controls.target.copy(lookAt);
			camera.lookAt(lookAt);
			camera.fov = animation.frames[this.frame].fov + fovModifier;
			camera.updateProjectionMatrix();

			camera.position.set(
				(animation.frames[this.frame].position.x),
				(animation.frames[this.frame].position.z),
			   -(animation.frames[this.frame].position.y));
		}
		else {camera.lookAt(camera.target); this.stop();} //reached the end
	}

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
	}

	this.modifyCameraUp = function (degrees) {	
		var radians = this.degreesToRadians(degrees);
		var newUp = new THREE.Vector3(0, Math.cos(radians), Math.sin(radians));
		var up = new THREE.Vector3( 0, 0, 1 );
		newUp.applyAxisAngle( up, radians );
		return newUp;
	}

	this.degreesToRadians = function (deg) { return deg * (Math.PI / 180) }
}
