var cameraAnimations = [];
var currentAnimationIndex = undefined;
var zoomedOnSlice = undefined;
var camAtPosition1 = false;
var camAtPosition2 = false;
//ms
var transitionWait_1_2 = 0;
var windowsFadeTick = 20;

function modifyCameraUp (degrees) {	
	var radians = this.degreesToRadians(degrees);	
	var vector3 = new THREE.Vector3(0, Math.cos(radians), Math.sin(radians));	
	var up = new THREE.Vector3( 0, 0, 1 );
	vector3.applyAxisAngle( up, radians );
	return vector3;
}

var animateCamera = {
	forward: undefined,
	frame: -1,
	play: function(from, to){
		animateCamera.stop(animation_interval);
		animateCamera.frame = from;
		
		animation_interval = setInterval(function(){
		//console.log(animateCamera.frame)
		if(animateCamera.checkPlayback(from, to)){
			if(animation.type == 'Targetcamera')
			{
				var newUp = modifyCameraUp(animation.frames[animateCamera.frame].rollAngle);
				camera.up.set(newUp.x, newUp.y, newUp.z);

				var lookAt = new THREE.Vector3(animation.frames[animateCamera.frame].target.x, 
					animation.frames[animateCamera.frame].target.z, 
					-animation.frames[animateCamera.frame].target.y);
				camera.target = lookAt
				camera.lookAt(camera.target);

			}
			else //free camera
			{ 
				var euler = new THREE.Euler(
					degreesToRadians(animation.frames[animateCamera.frame].quaternion.x), 
					degreesToRadians(animation.frames[animateCamera.frame].quaternion.z), 
					degreesToRadians(animation.frames[animateCamera.frame].quaternion.y), 'XYZ');
				camera.rotation.copy(euler)
			} 

			camera.fov = animation.frames[animateCamera.frame].fov;
			camera.updateProjectionMatrix();

			camera.position.set((animation.frames[animateCamera.frame].camera.x),(animation
				.frames[animateCamera.frame].camera.z),
				-(animation.frames[animateCamera.frame].camera.y));
		}
		else animateCamera.stop();
		},1000/animation.fps)
	}, 
	stop: function(){
		//animateCamera.frame = 0;
		clearInterval(animation_interval);
	},
	checkPlayback: function(from, to){
		if (from < to){ //regular playback	
			animateCamera.forward = true;
			if (animateCamera.frame < to){ //still has to play
				animateCamera.frame++;
				return true;
			}
			else return false; //reached the end				
		}	
		else if (from > to){ //reverse playback			
			animateCamera.forward = false;
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

		var cameraPos = new TWEEN.Tween( camera.position )
	    cameraPos.to( { x: destination.x, y: destination.y, z: destination.z }, time );
	    cameraPos.start();
	//rotation
    	var rollAngle = animation.frames[frame].rollAngle;    	
    	var newUp = modifyCameraUp(rollAngle);
	    var cameraAng = new TWEEN.Tween( camera.up );
	    cameraAng.to( { x: newUp.x, y: newUp.y, z: newUp.z }, time );
	    cameraAng.start();  
	//target
	    var target = new THREE.Vector3(animation.frames[frame].target.x, 
			animation.frames[frame].target.z, 
			-animation.frames[frame].target.y);

	    var cameraTar = new TWEEN.Tween( camera.target )
	    cameraTar.to( { x: target.x, y: target.y, z: target.z }, time );
	    cameraTar.start();

	    cameraTar.onUpdate( function () {
	   		camera.lookAt(camera.target);
        });    
	}
}

var manageCameraAnimations = {
	playAnim_1: function(){ //both windows perspective
		animateCamera.play(camera_frames.animation_1.from, camera_frames.animation_1.to);
	},	
	playAnim_2: function () { //to slice
		animateCamera.play(camera_frames.animation_2.from, camera_frames.animation_2.to);
		if(!slice.inScene) loadObject('cardinal_slice', undefined, addToScene, slice, false);
	},
	playZoomInAnim: function (anim) { //zoom in further on slice
		zoomedOnSlice = true;
		animateCamera.tween(camera_frames[anim].frame, camera_frames[anim].speed);
	},
	back: function() { //multiple back options			
		if(animateCamera.frame == camera_frames.animation_2.to && //back to both windows
			!zoomedOnSlice){
			animateCamera.play(camera_frames.animation_2.to, camera_frames.animation_2.from);
		}

		if(zoomedOnSlice){ //back to slice
			zoomedOnSlice = false;
			animateCamera.tween(camera_frames.animation_2.to, 0.1);
		} 
	}
}

function degreesToRadians (deg) { return deg * (Math.PI / 180); }
