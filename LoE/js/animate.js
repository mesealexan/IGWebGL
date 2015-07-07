watch(animateCamera, "frame", function(prop, action, newvalue, oldvalue){
	switch (newvalue){
		case 1:
			_window.mesh.visible = false;
		case 120:
			fixed_glass.plane3.mesh.material.tween(coatingTime);
			//fixed_glass.plane3.silverCoatingMaterial.tween(coatingTime);
		break;
		case 195:
			fixed_glass.plane4.mesh.material.tween(coatingTime);
			//fixed_glass.plane4.silverCoatingMaterial.tween(coatingTime);
		break;
		case 265:
			fixed_glass.plane5.mesh.material.tween(coatingTime);
			//fixed_glass.plane5.silverCoatingMaterial.tween(coatingTime);
		break;
		case 339:		
			mobile_glass.plane.mesh.material.tween(coatingTime - 120);	
			//mobile_glass.plane.silverCoatingMaterial.tween(coatingTime - 120);
		break;
		case 375:
			_window.mesh.visible = true;
		case 402:
			moveRailDown();
		break;
		case 410:
			mobile_glass.mesh.visible = false;
		break;
		case 499:
			scene.remove(rail.mesh);
			controls.target = camera.target;
			text.mesh.visible = false;
			toggleInput(true);
			plane.mesh.material.materials[0].tweenOpacity(0, 2000);
		break;
	}
});

function animate(time) {
	frameID = requestAnimationFrame(animate);
	renderer.render(scene, camera);
	TWEEN.update(time);	
} 
