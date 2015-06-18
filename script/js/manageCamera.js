function modifyCameraUp (degrees) {	
	var radians = this.degreesToRadians(degrees);	
	var vector3 = new THREE.Vector3(0, Math.cos(radians), Math.sin(radians));	
	var up = new THREE.Vector3( 0, 0, 1 );
	vector3.applyAxisAngle( up, radians );
	return vector3;
}

function animateCamera(animation){
	clearInterval(animation_interval);
	var i = -1;
	animation_interval = setInterval(function(){
	if(i<animation.frames.length-1){
		i++;

		if(animation.type == 'Targetcamera'){
			var newUp = modifyCameraUp(animation.frames[i].rollAngle);
			camera.up.set(newUp.x, newUp.y, newUp.z);

			var lookAt = new THREE.Vector3(animation.frames[i].target.x, animation.frames[i].target.z, 
				-animation.frames[i].target.y);
			camera.lookAt(lookAt);
		}
		else{ //free camera

			var euler = new THREE.Euler(
				degreesToRadians(animation.frames[i].quaternion.x), 
				degreesToRadians(animation.frames[i].quaternion.z), 
				degreesToRadians(animation.frames[i].quaternion.y), 'XYZ');
			camera.rotation.copy(euler)
			//camera.rotation.copy(quaternion);
			//console.log(camera.rotation)
			//camera.setRotationFromQuaternion(quaternion);

			//camera.quaternion.copy(quaternion);
			//console.log(camera.quaternion)
			//var axis = new THREE.Vector3( animation.frames[i].quaternion.x, 
			//animation.frames[i].quaternion.z, animation.frames[i].quaternion.y).normalize();
			//quaternion.setFromAxisAngle(axis, animation.frames[i].quaternion.w);
			//camera.rotation.setFromQuaternion ( quaternion );
			//quaternion.normalize();
			//rotationVector.applyQuaternion( quaternion );
			//console.log(quaternion)
			//console.log(quaternion)
			//camera.rotation.set(rotationVector.x, rotationVector.y, rotationVector.z);
			//console.log(camera.rotation)
			// var a = new THREE.Euler( animation.frames[i].quaternion.x, 
			// 	animation.frames[i].quaternion.y, animation.frames[i].quaternion.z );
			// camera.quaternion.setFromEuler( a )
		} 

		camera.fov = animation.frames[i].fov;
		camera.updateProjectionMatrix();

		camera.position.set((animation.frames[i].camera.x),(animation.frames[i].camera.z),
			-(animation.frames[i].camera.y));

		
	}
	},1000/animation.fps);
}

function degreesToRadians (deg) { return deg * (Math.PI / 180); }