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
	finished: false,
	frame: -1,
	play: function(from, to){
		animateCamera.stop(animation_interval);
		animateCamera.frame = from;
		animateCamera.finished = false;
		
		animation_interval = setInterval(function(){
		if(animateCamera.checkPlayback(from, to)){
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
	stop: function(){
		animateCamera.finished = true;
		animateCamera.frame = 0;
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
		var destination = new THREE.Vector3(animation.frames[frame].camera.x, 
			animation.frames[frame].camera.z, 
			-animation.frames[frame].camera.y);

		var tween = new TWEEN.Tween( camera.position )
	    tween.to( { x: destination.x, y: destination.y, z: destination.z }, 2000 );
	    tween.onUpdate( function () {
	    	//camera.lookAt
        });
	    tween.start();
	}
}

var manageCameraAnimations = {
	//both windows perspective
	playAnim_1: function(){
		animateCamera.play(camera_frames.animation_1.from, camera_frames.animation_1.to);
	},
	//to slice
	playAnim_2: function () {
		toggleElement(menu, 'hidden');
		animateCamera.play(camera_frames.animation_2.from, camera_frames.animation_2.to);
		if(!slice.inScene) loadObject('cardinal_slice', undefined, addToScene, slice);
		if(slice.mesh)slice.mesh.visible = true;
		windowVertical.mesh.visible = false;
		windowHorizontal.mesh.visible = false;
	},
	//go to slice
	playAnim_3: function () {
		// manageVisibility.fadeOut(windowVertical.mesh.material.materials, windowsFadeTick);
		// manageVisibility.fadeOut(windowHorizontal.mesh.material.materials, windowsFadeTick);
		// camAtPosition1 = false;
		// currentAnimationIndex = 2;
		//windowVertical.mesh.visible = false;
		//windowHorizontal.mesh.visible = false;
		//text.mesh.visible = false;

		//dont add slice every time, toggle visibility instead
		//if(!slice.inScene) addToScene(slice.mesh);
		//else manageVisibility.fadeIn(slice.mesh.material.materials, windowsFadeTick);
		//slice.mesh.visible = true;

		// animateCamera.play(cameraAnimations[2]);
		// menu.style.visibility = "hidden";

		// setTimeout(function(){ 
		// 	camAtPosition2 = true;
		// 	camPosition2.copy(camera.position);
		// 	backButton.style.visibility = "visible";
		// 	closeUpMenu.style.visibility = "visible"; 
		// }, cameraAnimations[2].duration);	
	},
	//reverse to both windows perspective
	playAnim_3_reverse: function () {
		// manageVisibility.fadeIn(windowVertical.mesh.material.materials, windowsFadeTick);
		// manageVisibility.fadeIn(windowHorizontal.mesh.material.materials, windowsFadeTick)
		// manageVisibility.fadeOut(slice.mesh.material.materials, windowsFadeTick);
		// camAtPosition2 = false;
		// currentAnimationIndex = 2;
		// windowVertical.mesh.visible = true;
		// windowHorizontal.mesh.visible = true;
		// text.mesh.visible = true;
		// //slice.mesh.visible = false;
		// backButton.style.visibility = "hidden";
		// closeUpMenu.style.visibility = "hidden";
		// animateCamera.play(cameraAnimations[2], undefined, true);

		// setTimeout(function(){ 
		// 	camAtPosition1 = true;
		// 	menu.style.visibility = "visible";
		// }, cameraAnimations[2].duration);		
	},
	//different zoom ins on slice
	playZoomInAnim: function (num) {
		// if(!animateCamera.finished) return;
		// if(num == currentAnimationIndex) return;
		// if(currentAnimationIndex > 2){
		// 	zoomedOnSlice = true;
		// 	animateCamera.play(cameraAnimations[currentAnimationIndex], undefined, true);

		// 	setTimeout(function(){
		// 		animateCamera.play(cameraAnimations[num]);
		// 	}, cameraAnimations[currentAnimationIndex].duration);}
		// else {
		// 	animateCamera.play(cameraAnimations[num]);
		// 	zoomedOnSlice = true;
		// }
		// currentAnimationIndex = num;
	},
	back: function() {
		if(animateCamera.frame == camera_frames.animation_2.to){
			//toggleElement(cutMenu, 'hidden');
			//toggleElement(backButton, 'hidden');
			slice.mesh.visible = false;
			windowVertical.mesh.visible = true;
			windowHorizontal.mesh.visible = true;
			animateCamera.play(camera_frames.animation_2.to, camera_frames.animation_2.from);
		}
		//back to slice
		// if(zoomedOnSlice){
		// 	zoomedOnSlice = false;
		// 	animateCamera.play(cameraAnimations[currentAnimationIndex], undefined, true);
		// 	currentAnimationIndex = 2;
		// } 
		// //back to both windows perspective
		// else manageCameraAnimations.playAnim_3_reverse();
	}
}

function degreesToRadians (deg) { return deg * (Math.PI / 180); }
