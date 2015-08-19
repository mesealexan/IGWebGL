var lastKeyframe = 0, currentKeyframe = 0;
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
		if(heat_wave.mesh) loopMorphs(heat_wave.mesh,26000,1,799);
	}, 30);
} 

function loopMorphs(geometry,seconds,startKeyframe,endKeyframe)
{
	console.log(geometry)
	var duration = seconds;
	var keyframes = endKeyframe - startKeyframe ;
	var interpolation = duration / keyframes;
	var time = Date.now() % duration;
	var keyframe = 0;
		keyframe = Math.floor( time / interpolation )+startKeyframe;
	if ( keyframe != currentKeyframe ){
		geometry.morphTargetInfluences[ lastKeyframe ] = 0;
		geometry.morphTargetInfluences[ currentKeyframe ] = 1;
		geometry.morphTargetInfluences[ keyframe ] = 0;
		lastKeyframe = currentKeyframe;
		currentKeyframe = keyframe;
		}
		if (keyframe != 0)
		{
		geometry.morphTargetInfluences[ keyframe ] = ( time % interpolation ) / interpolation;
		geometry.morphTargetInfluences[ lastKeyframe ] = 1 - ( time % interpolation ) / interpolation;
		}
	}