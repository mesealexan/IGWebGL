var cameraAnimations = [];
var currentAnimationIndex = undefined;
var zoomedOnSlice = undefined;
//ms
var transitionWait_1_2 = 1000;

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
		animateCamera.finished = false;
		if(reverse) animateCamera.frame = animation.frames.length - 1;
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
		animateCamera.finished = true;
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
			else animateCamera.stop();
		}
		
	}
}

var manageCameraAnimations = {
	//horizontal window
	playAnim_1: function(){
		currentAnimationIndex = 0;
		animateCamera.play(cameraAnimations[0]);
		setTimeout(function(){ 
			manageCameraAnimations.playAnim_2() 
		}, cameraAnimations[0].duration + transitionWait_1_2);		
	},
	//both windows perspective
	playAnim_2: function () {
		currentAnimationIndex = 1;
		loadObject('cardinal_vertical', cardinal2materials, addToScene, windowVertical);
		animateCamera.frame = 0;
		animateCamera.play(cameraAnimations[1]);
		setTimeout(function(){ 
			menu.style.visibility = "visible" 
		}, cameraAnimations[1].duration);	
	},
	//go to slice
	playAnim_3: function () {
		currentAnimationIndex = 2;
		windowVertical.mesh.visible = false;
		windowHorizontal.mesh.visible = false;
		text.mesh.visible = false;
		loadObject('slice', cardinal2materials, addToScene, slice);		
		animateCamera.play(cameraAnimations[2]);
		menu.style.visibility = "hidden";
		setTimeout(function(){ 
			backButton.style.visibility = "visible";
			closeUpMenu.style.visibility = "visible"; 
		}, cameraAnimations[2].duration);	
	},
	//reverse to both windows perspective
	playAnim_3_reverse: function () {
		currentAnimationIndex = 2;
		windowVertical.mesh.visible = true;
		windowHorizontal.mesh.visible = true;
		text.mesh.visible = true;
		slice.mesh.visible = false;
		backButton.style.visibility = "hidden";
		closeUpMenu.style.visibility = "hidden";
		animateCamera.play(cameraAnimations[2], undefined, true);
		setTimeout(function(){ 
			menu.style.visibility = "visible" 
		}, cameraAnimations[2].duration);		
	},
	//different zoom ins on slice
	playZoomInAnim: function (num) {
		if(!animateCamera.finished) return;
		if(num == currentAnimationIndex) return;
		if(currentAnimationIndex > 2){
			zoomedOnSlice = true;
			animateCamera.play(cameraAnimations[currentAnimationIndex], undefined, true);
			setTimeout(function(){
				animateCamera.play(cameraAnimations[num]);
			}, cameraAnimations[currentAnimationIndex].duration);}
		else {
			animateCamera.play(cameraAnimations[num]);
			zoomedOnSlice = true;
		}
		currentAnimationIndex = num;
	},
	back: function() {
		//back to slice
		if(zoomedOnSlice){
			zoomedOnSlice = false;
			animateCamera.play(cameraAnimations[currentAnimationIndex], undefined, true);
			currentAnimationIndex = 2;
		} 
		//back to both windows perspective
		else manageCameraAnimations.playAnim_3_reverse();
	}
}

function degreesToRadians (deg) { return deg * (Math.PI / 180); }