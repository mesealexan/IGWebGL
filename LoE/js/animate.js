watch(animateCamera, "frame", function(prop, action, newvalue, oldvalue){
	switch (newvalue){
		case 1:
			_window.mesh.visible = false;
		case 94:
			//fixed_glass.plane3.mesh.material.tween(coatingTime);
			//fixed_glass.plane3.silverCoatingMaterial.tween(coatingTime);
		break;
		case 169:
			fixed_glass.plane4.mesh.material.tween(coatingTime);
			//fixed_glass.plane4.silverCoatingMaterial.tween(coatingTime);
		break;
		case 240:
			fixed_glass.plane5.mesh.material.tween(coatingTime);
			//fixed_glass.plane5.silverCoatingMaterial.tween(coatingTime);
		break;
		case 310:		
			mobile_glass.plane.mesh.material.tween(coatingTime);	
			//mobile_glass.plane.silverCoatingMaterial.tween(coatingTime - 120);
		break;
		case 375:
			_window.mesh.visible = true;
		case 402:
			//moveRailDown();
		break;
		case 410:
			mobile_glass.mesh.visible = false;
		break;
		case 460:
			enableBackground();
		break;
		case 499:
			toggleElement(menu, 'visible');		
			scene.remove(rail.mesh);
			controls.target = camera.target;
			text.mesh.visible = false;
			toggleInput(true);
		break;
	}
});

function animate(time) {
	// frameID = requestAnimationFrame(animate);
	// renderer.render(scene, camera);
	// TWEEN.update(time);	
	setInterval(function(){ 
		renderer.render(scene, camera); 
		TWEEN.update(undefined);	
	}, 1000 / animation.fps);
} 
