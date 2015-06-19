var cameraAnimations = [];

//ms
var transitionWait_1_2 = 5000;

function modifyCameraUp (degrees) {	
	var radians = this.degreesToRadians(degrees);	
	var vector3 = new THREE.Vector3(0, Math.cos(radians), Math.sin(radians));	
	var up = new THREE.Vector3( 0, 0, 1 );
	vector3.applyAxisAngle( up, radians );
	return vector3;
}

var animateCamera = {
	paused: false,
	finished: false,
	frame: -1,
	play: function(animation, startFrom, reverse){
		animateCamera.stop(animation_interval);
		if(startFrom != undefined) animateCamera.frame = startFrom;
		animation_interval = setInterval(function(){
		if(animateCamera.checkPlayback(animation, reverse)){
			if(reverse != undefined)
			{				
				if(!reverse) animateCamera.frame++;
				else animateCamera.frame--;
			}
			else animateCamera.frame++;
			if(animation.type == 'Targetcamera')
			{
				var newUp = modifyCameraUp(animation.frames[animateCamera.frame].rollAngle);
				camera.up.set(newUp.x, newUp.y, newUp.z);

				var lookAt = new THREE.Vector3(animation.frames[animateCamera.frame].target.x, 
					animation.frames[animateCamera.frame].target.z, 
					-animation.frames[animateCamera.frame].target.y);
				camera.lookAt(lookAt);
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
		},1000/animation.fps)
	}, 
	pause: function(){
		clearInterval(animation_interval);
	},
	stop: function(){
		animateCamera.frame = 0;
		clearInterval(animation_interval);
	},
	checkPlayback: function(animation, reverse){
		if(reverse != undefined)
		{
			if(!reverse && animateCamera.frame < animation.frames.length-1) return true;
			else if(!reverse && animateCamera.frame >= animation.frames.length-1) 
				//Finished playing normally, 'reverse' argument was 'false'				
				animateCamera.stop();

			if(reverse && animateCamera.frame > -1) return true;
			else if(reverse && animateCamera.frame < 1) 
				//Finished playing in reverse
				animateCamera.stop();
		}
		else {
			if(animateCamera.frame < animation.frames.length-1)
				return true;
			else return false;
		}
		
	}
}

var manageCameraAnimations = {
	playAnim_1: function(){
		animateCamera.play(cameraAnimations[0]);
		setTimeout(function(){ manageCameraAnimations.playAnim_2() }, 
			cameraAnimations[0].duration + transitionWait_1_2);		
	},
	playAnim_2: function () {
		loadObject('cardinal_vertical', cardinal2materials, addToScene, windowVertical);
		animateCamera.frame = 0;
		animateCamera.play(cameraAnimations[1]);
		setTimeout(function(){ menuButtons.style.visibility = "visible" }, 
			cameraAnimations[1].duration);	
	},
	playAnim_3: function () {
		windowVertical.mesh.visible = false;
		windowHorizontal.mesh.visible = false;
		text.mesh.visible = false;
		loadObject('slice', cardinal2materials, addToScene, slice);
	}
}

function degreesToRadians (deg) { return deg * (Math.PI / 180); }