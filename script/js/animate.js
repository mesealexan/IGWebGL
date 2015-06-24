watch(animateCamera, "frame", function(prop, action, newvalue, oldvalue){
	//console.log(newvalue)
	switch (newvalue){
		case 100: //vertical window out of frustum
			//loadObject('cardinal_vertical', undefined, addToScene, windowVertical);
			windowVertical.mesh.visible = true;
		break;
		case 158: //finished anim 1
			toggleElement(menu, 'visible');			
		break;
		case 159: //going to slice
			toggleElement(menu, 'hidden');			
		break;
		case 188: //between slice and both windows
			windowVertical.mesh.visible = !animateCamera.forward;
			windowHorizontal.mesh.visible = !animateCamera.forward;
			slice.mesh.visible = animateCamera.forward;
		break;
		case 189: //going back to both windows
			toggleElement(cutMenu, 'hidden');
			toggleElement(backButton, 'hidden');
		break;
		case 190: //finished anim 2
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