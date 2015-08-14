watch(animateCamera, "frame", function(prop, action, newvalue, oldvalue){
	switch (newvalue){
		case 1:
			//
		break;
	}
});

function animate(time) {
	setInterval(function(){ 
		renderer.render(scene, camera); 
		TWEEN.update(undefined);	
	}, 1000 / animation.fps);
} 
