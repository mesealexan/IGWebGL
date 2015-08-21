
// var animationHandler = function(mesh){
// 	this.mesh = mesh.mesh;
// 	this.interval = setInterval(function(){},fps);	
// }

// animationHandler.prototype.play = function(from, to) {
// 	var interval = this.interval;	
// 	var lastKeyframe = from;
// 	var currentKeyframe = from;
// 	var geometry = this.mesh;
// 	var thick = 0;
// 		clearInterval(interval);
// 		interval = setInterval(function(){
// 			thick++
// 		var duration = (to - from) * fps;
// 		var keyframes = to - from ;
// 		var interpolation = duration / keyframes;
// 		var time = thick * interpolation;
		
// 		var keyframe = 0;
// 			keyframe = Math.floor( time / interpolation )+from;
// 		if ( keyframe != currentKeyframe ){
// 			geometry.morphTargetInfluences[ lastKeyframe ] = 0;
// 			geometry.morphTargetInfluences[ currentKeyframe ] = 1;
// 			geometry.morphTargetInfluences[ keyframe ] = 0;
// 			lastKeyframe = currentKeyframe;
// 			currentKeyframe = keyframe;
// 						console.log(currentKeyframe)
// 			}
// 		if (keyframe != 0)
// 			{
// 			geometry.morphTargetInfluences[ keyframe ] = ( time % interpolation ) / interpolation;
// 			geometry.morphTargetInfluences[ lastKeyframe ] = 1 - ( time % interpolation ) / interpolation;
// 			}
// 			if(currentKeyframe === to - 1){
// 				geometry.morphTargetInfluences[ lastKeyframe ] = 0;
// 				console.log('done')
// 				clearInterval(interval);
// 			}
// 	},fps);
// };

// animationHandler.prototype.loop = function(from, to) {
// 	var lastKeyframe = from;
// 	var currentKeyframe = from;
// 	var geometry = this.mesh;
// 	var thick = 0;
// 		clearInterval(this.interval);
// 		interval = setInterval(function(){
// 			thick++
// 		var duration = (to - from) * fps;
// 		var keyframes = to - from ;
// 		var interpolation = duration / keyframes;
// 		var time = thick * interpolation;
		
// 		var keyframe = 0;
// 			keyframe = Math.floor( time / interpolation )+from;
// 		if ( keyframe != currentKeyframe ){
// 			geometry.morphTargetInfluences[ lastKeyframe ] = 0;
// 			geometry.morphTargetInfluences[ currentKeyframe ] = 1;
// 			geometry.morphTargetInfluences[ keyframe ] = 0;
// 			lastKeyframe = currentKeyframe;
// 			currentKeyframe = keyframe;
// 						console.log(currentKeyframe)
// 			}
// 		if (keyframe != 0)
// 			{
// 			geometry.morphTargetInfluences[ keyframe ] = ( time % interpolation ) / interpolation;
// 			geometry.morphTargetInfluences[ lastKeyframe ] = 1 - ( time % interpolation ) / interpolation;
// 			}
// 			if(currentKeyframe === to - 1){
// 				thick = 0;
// 			}
// 	},fps);
// };


// animationHandler.prototype.loopMorphs = function(geometry,startKeyframe,endKeyframe){

// 	var duration = (endKeyframe - startKeyframe) * fps;
// 	var keyframes = endKeyframe - startKeyframe ;
// 	var interpolation = duration / keyframes;
// 	var time = Date.now() % duration;
// 	var keyframe = 0;
// 		keyframe = Math.floor( time / interpolation )+startKeyframe;

// 	if ( keyframe != this.currentKeyframe ){
// 		geometry.morphTargetInfluences[ this.lastKeyframe ] = 0;
// 		geometry.morphTargetInfluences[ this.currentKeyframe ] = 1;
// 		geometry.morphTargetInfluences[ keyframe ] = 0;
// 		this.lastKeyframe = this.currentKeyframe;
// 		this.currentKeyframe = keyframe;
// 		}
// 		if (keyframe != 0)
// 		{
// 		geometry.morphTargetInfluences[ keyframe ] = ( time % interpolation ) / interpolation;
// 		geometry.morphTargetInfluences[ this.lastKeyframe ] = 1 - ( time % interpolation ) / interpolation;
// 		}

// };

animationHandler.prototype = new genericHandler();
var ah1 = new animationHandler();
var ah2 = new animationHandler();
var ah3 = new animationHandler();

function animationHandler(){
	var mesh;
	var loop = false;

	this.setMesh = function(m) { mesh = m.mesh; }

	this.play = function(from, to){
		this.basePlay(from, to);
	}

	this.loop = function(from, to){
		loop = true;
		this.basePlay(from, to);
	}

	this.update = function () {
		if(this.checkPlayback(this.from, this.to)){			
			mesh.morphTargetInfluences[ this.frame - 1 ] = 0;
			mesh.morphTargetInfluences[ this.frame ] = 1;
			mesh.morphTargetInfluences[ this.frame + 1 ] = 0;
		}
		else { 			
			if(loop){
				this.stop();
				mesh.morphTargetInfluences[ this.to ] = 0; 
				mesh.morphTargetInfluences[ this.from ] = 1; 
				this.basePlay(this.from, this.to + 1);
			}
			else this.stop();
		} //reached the end
	}
}

// animationHandler.prototype.play = function(from, to) {
// 	var interval = this.interval;	
// 	var lastKeyframe = from;
// 	var currentKeyframe = from;
// 	var geometry = this.mesh;
// 	var thick = 0;
// 		clearInterval(interval);
// 		interval = setInterval(function(){
// 			thick++
// 		var duration = (to - from) * fps;
// 		var keyframes = to - from ;
// 		var interpolation = duration / keyframes;
// 		var time = thick * interpolation;
		
// 		var keyframe = 0;
// 			keyframe = Math.floor( time / interpolation )+from;
// 		if ( keyframe != currentKeyframe ){
// 			geometry.morphTargetInfluences[ lastKeyframe ] = 0;
// 			geometry.morphTargetInfluences[ currentKeyframe ] = 1;
// 			geometry.morphTargetInfluences[ keyframe ] = 0;
// 			lastKeyframe = currentKeyframe;
// 			currentKeyframe = keyframe;
// 						console.log(currentKeyframe)
// 			}
// 		if (keyframe != 0)
// 			{
// 			geometry.morphTargetInfluences[ keyframe ] = ( time % interpolation ) / interpolation;
// 			geometry.morphTargetInfluences[ lastKeyframe ] = 1 - ( time % interpolation ) / interpolation;
// 			}
// 			if(currentKeyframe === to - 1){
// 				geometry.morphTargetInfluences[ lastKeyframe ] = 0;
// 				console.log('done')
// 				clearInterval(interval);
// 			}
// 	},fps);
// };

// animationHandler.prototype.loop = function(from, to) {
// 	var lastKeyframe = from;
// 	var currentKeyframe = from;
// 	var geometry = this.mesh;
// 	var thick = 0;
// 		clearInterval(this.interval);
// 		interval = setInterval(function(){
// 			thick++
// 		var duration = (to - from) * fps;
// 		var keyframes = to - from ;
// 		var interpolation = duration / keyframes;
// 		var time = thick * interpolation;
		
// 		var keyframe = 0;
// 			keyframe = Math.floor( time / interpolation )+from;
// 		if ( keyframe != currentKeyframe ){
// 			geometry.morphTargetInfluences[ lastKeyframe ] = 0;
// 			geometry.morphTargetInfluences[ currentKeyframe ] = 1;
// 			geometry.morphTargetInfluences[ keyframe ] = 0;
// 			lastKeyframe = currentKeyframe;
// 			currentKeyframe = keyframe;
// 						console.log(currentKeyframe)
// 			}
// 		if (keyframe != 0)
// 			{
// 			geometry.morphTargetInfluences[ keyframe ] = ( time % interpolation ) / interpolation;
// 			geometry.morphTargetInfluences[ lastKeyframe ] = 1 - ( time % interpolation ) / interpolation;
// 			}
// 			if(currentKeyframe === to - 1){
// 				thick = 0;
// 			}
// 	},fps);
// };


// animationHandler.prototype.loopMorphs = function(geometry,startKeyframe,endKeyframe){

// 	var duration = (endKeyframe - startKeyframe) * fps;
// 	var keyframes = endKeyframe - startKeyframe ;
// 	var interpolation = duration / keyframes;
// 	var time = Date.now() % duration;
// 	var keyframe = 0;
// 		keyframe = Math.floor( time / interpolation )+startKeyframe;

// 	if ( keyframe != this.currentKeyframe ){
// 		geometry.morphTargetInfluences[ this.lastKeyframe ] = 0;
// 		geometry.morphTargetInfluences[ this.currentKeyframe ] = 1;
// 		geometry.morphTargetInfluences[ keyframe ] = 0;
// 		this.lastKeyframe = this.currentKeyframe;
// 		this.currentKeyframe = keyframe;
// 		}
// 		if (keyframe != 0)
// 		{
// 		geometry.morphTargetInfluences[ keyframe ] = ( time % interpolation ) / interpolation;
// 		geometry.morphTargetInfluences[ this.lastKeyframe ] = 1 - ( time % interpolation ) / interpolation;
// 		}

// };