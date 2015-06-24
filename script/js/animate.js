watch(animateCamera, "frame", function(prop, action, newvalue, oldvalue){
	//console.log(newvalue)
	switch (newvalue){
		case 100: //vertical window out of frustum
			loadObject('cardinal_vertical', undefined, addToScene, windowVertical);
		break;
		case 158: //finished anim 1
			toggleElement(menu, 'visible');			
		break;
		case 159: //going to slice
			toggleElement(menu, 'hidden');			
		break;
		case 170: //between slice and both windows
			//windowVertical.mesh.visible = !windowVertical.mesh.visible;
			//windowHorizontal.mesh.visible = !windowHorizontal.mesh.visible;
			//slice.mesh.visible = !slice.mesh.visible;
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
	renderer.render(scene, camera);
	TWEEN.update(time);
} 