watch(animateCamera, "frame", function(prop, action, newvalue, oldvalue){
	//console.log(newvalue)
	switch (newvalue){
		case 100: //anim 1 mid way, vertical window out of frustum
			windowVertical.mesh.visible = true;
		break;
		case 158: //finished anim 1
		    controls.minAzimuthAngle = - 0.3; 
		    controls.maxAzimuthAngle = 0.3;
			cameraTweenSpeed = 1;
			controls.target = camera.target;
			toggleInput(true);
			cameraDestinationFrame = newvalue;
			toggleElement(menu, 'visible');			
		break;
		case 159: //going to slice
			cancelAllTweens();
			toggleElement(menu, 'hidden');	
			toggleInput(false);
		break;
		case 188: //between slice and both windows
			windowVertical.mesh.visible = !animateCamera.forward;
			windowHorizontal.mesh.visible = !animateCamera.forward;
			slice.mesh.visible = animateCamera.forward;
		break;
		case 189: //going back to both windows	
			cancelAllTweens();
			toggleInput(false);
			toggleElement(cutMenu, 'hidden');
			toggleElement(backButton, 'hidden');
		break;
		case 190: //finished anim 2
		    controls.minAzimuthAngle = 0.1; 
		    controls.maxAzimuthAngle = 0.9;
			cameraTweenSpeed = 0.05;
			controls.target = camera.target;
			toggleInput(true);
			cameraDestinationFrame = newvalue;
			toggleElement(cutMenu, 'visible');
			toggleElement(backButton, 'visible');
		break;
	}
});

function animate(time) {
	frameID = requestAnimationFrame(animate);
	if(imagesArray.length === 13){
		renderer.render(scene, camera);
		TWEEN.update(time);		
	}
} 
