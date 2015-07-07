function rotateZ (direction, time, repeat) {
	//direction 1 cw, -1 ccw
	tween = new TWEEN.Tween( this.mesh.rotation );
	tween.to( { z: -Math.PI * 2 * direction}, time );
	if(repeat != undefined) tween.repeat( repeat );
	tween.start();
}

var moveFixedGlass = {	
	frame: -1,
	play: function(){
		var glass_animation_interval = setInterval(function(){
			if(moveFixedGlass.frame++ < fixed_window_animation.frames.length - 1){
				fixed_glass.mesh.position.set(
					(fixed_window_animation.frames[moveFixedGlass.frame].position.x),
					(fixed_window_animation.frames[moveFixedGlass.frame].position.z),
					-(fixed_window_animation.frames[moveFixedGlass.frame].position.y));
			}
			else clearInterval(glass_animation_interval);//reached the end
		},1000/fixed_window_animation.fps);
	}
}

function moveRailDown () {
	//total
	var t_distance = 4151;
	var t_time = 37 / animation.fps;
	//per second
	var s_increment = t_distance / t_time;

	tween = new TWEEN.Tween( rail.mesh.position );
	tween.to( { y: '-' + s_increment.toString() }, 1000 );
	tween.easing(TWEEN.Easing.Quadratic.In);
	tween.repeat( Infinity );
	tween.start();
}

var moveMobileGlass = {	
	frame: -1,
	play: function(){
		glass_animation_interval = setInterval(function(){
			if(moveMobileGlass.frame++ < mobile_window_animation.frames.length - 1){
				mobile_glass.mesh.position.set(
					(mobile_window_animation.frames[moveMobileGlass.frame].position.x),
					(mobile_window_animation.frames[moveMobileGlass.frame].position.z),
					-(mobile_window_animation.frames[moveMobileGlass.frame].position.y));

				mobile_glass.mesh.rotation.setFromQuaternion (
					new THREE.Quaternion(
					(mobile_window_animation.frames[moveMobileGlass.frame].rotation.x),
					(mobile_window_animation.frames[moveMobileGlass.frame].rotation.z),
					-(mobile_window_animation.frames[moveMobileGlass.frame].rotation.y),
					(mobile_window_animation.frames[moveMobileGlass.frame].rotation.w)
					).normalize());
			}
			else clearInterval(glass_animation_interval);//reached the end
		},1000/mobile_window_animation.fps);
	}
}

var moveWindow = {	
	frame: -1,
	play: function(){
		window_animation_interval = setInterval(function(){
			if(moveWindow.frame++ < window_animation.frames.length - 1){
				_window.mesh.position.set(
					(window_animation.frames[moveWindow.frame].position.x),
					(window_animation.frames[moveWindow.frame].position.z),
					-(window_animation.frames[moveWindow.frame].position.y));

				_window.mesh.rotation.setFromQuaternion (
					new THREE.Quaternion(
					(window_animation.frames[moveWindow.frame].rotation.x),
					(window_animation.frames[moveWindow.frame].rotation.z),
					-(window_animation.frames[moveWindow.frame].rotation.y),
					(window_animation.frames[moveWindow.frame].rotation.w)
					).normalize());
			}
			else clearInterval(window_animation_interval);//reached the end
		},1000/window_animation.fps);
	}
}