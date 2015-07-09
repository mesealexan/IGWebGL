watch(animateCamera, "frame", function(prop, action, newvalue, oldvalue){
	switch (newvalue){
		case 1:
			_window.mesh.visible = false;
		break;
		case 169:
			fixed_glass.plane4.mesh.material.tween(coatingTime);
			setTimeout(function(){ removeFromScene(fixed_glass.plane4);}, coatingTime);
			pouring.mesh.visible = true;
		break;
		case 218:
			pouring.mesh.visible = false;
		break;
		case 240:
			pouring.mesh.visible = true;
			fixed_glass.plane5.mesh.material.tween(coatingTime);
			setTimeout(function(){ removeFromScene(fixed_glass.plane5);}, coatingTime);
		break;
		case 288:
			pouring.mesh.visible = false;
		break;
		case 310:		
			pouring.mesh.visible = true;
			mobile_glass.plane.mesh.material.tween(coatingTime);
			setTimeout(function(){ removeFromScene(fixed_glass.plane6);}, coatingTime);	
		break;
		case 358:
			pouring.mesh.visible = false;
		break;
		case 375:
			_window.mesh.visible = true;
		break;
		case 410:
			mobile_glass.mesh.visible = false;
		break;
		case 450:
			enableBackground();
		break;
		case 469:
			toggleElement(menu, 'visible');		
		break;
		case 479:
			window_shadow.mesh.material.materials[0].tweenOpacity(1, window_shadow_appearTime, 300);
			window_shadow.mesh.visible = true;
		break;
		case 499:
			scene.remove(rail.mesh);
			controls.target = camera.target;
			text.mesh.visible = false;
			toggleInput(true);
		break;
	}
});

function animate(time) {
	setInterval(function(){ 
		renderer.render(scene, camera); 
		TWEEN.update(undefined);	
	}, 1000 / animation.fps);
} 
