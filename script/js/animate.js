watch(animateCamera, "frame", function(prop, action, newvalue, oldvalue){
	switch (newvalue){
		case 100: //anim 1 mid way, vertical window out of frustum
			windowVertical.mesh.visible = true;
		break;
		case 158: //finished anim 1
		    controls.minAzimuthAngle = - 0.3; 
		    controls.maxAzimuthAngle = 0.3;
			cameraTweenSpeed = 1;
			controls.target.copy(camera.target);
			toggleInput(true);
			cameraDestinationFrame = newvalue;
			toggleElement(menu, 'visible');	
		break;
		//replaced by tweening
		/*case 159: //going to slice		
			cancelAllTweens();
			toggleElement(menu, 'hidden');	
			toggleInput(false);
		break;
		case 189: //going back to both windows	
			cancelAllTweens();
			toggleInput(false);
			toggleElement(sliceMenu, 'hidden');
			toggleElement(backButton, 'hidden');
		break;
		case 190: //finished anim 2
		    controls.minAzimuthAngle = 0.33; 
		    controls.maxAzimuthAngle = 0.7;
			cameraTweenSpeed = 0.05;
			controls.target.copy(camera.target);
			toggleInput(true);
			cameraDestinationFrame = newvalue;
			toggleElement(sliceMenu, 'visible');
			toggleElement(backButton, 'visible');
		break;
		*/
	}
});

function animate(time) {
	frameID = requestAnimationFrame(animate);
	renderer.render(scene, camera);
	TWEEN.update(time);	
} 
