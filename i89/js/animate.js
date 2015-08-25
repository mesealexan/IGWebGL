var updater = new Updater();

var animSettings = {
	then: Date.now(),
	now: undefined,
	fps: 30,
	delta: undefined,
	frame: 0
};
animSettings.interval = 1000 / animSettings.fps;

function animate (/*time*/) {
	requestAnimationFrame(animate);
	animSettings.now = Date.now();
	animSettings.delta = animSettings.now - animSettings.then;
    TWEEN.update(undefined);

	if (animSettings.delta > animSettings.interval){
		animSettings.then = animSettings.now - (animSettings.delta % animSettings.interval);
		updater.updateHandlers();	
		renderer.render(scene, camera); 
	} 
}

function Updater () {
	this.handlers = [];

	this.addHandler = function(h){ this.handlers.push(h) };

	this.removeHandler = function(h){
		var index = this.handlers.indexOf(h);
		if(index > -1) this.handlers.splice(index, 1);
	};

	this.updateHandlers = function () {
		for (var key in this.handlers) this.handlers[key].update();
	}	;
}
//controls.maxAzimuthAngle = -0.9
//controls.minAzimuthAngle = -1.6
//controls.maxPolarAngle = Math.PI / 2
//controls.minPolarAngle = 1
function addWatch (obj, val) {
	watch(obj, val, function(prop, action, newvalue/*, oldvalue*/){
		switch (newvalue){
			case 110:
                //heatWaves.scaleWindowPlane();
                heatWaves.playWave1();
			break;
            case 197:
                heatWaves.loopWave1();
                heatWaves.playWave2();
            break;
            case 285:
                //ch.pause();
                //toggleInput(true);
                heatWaves.loopWave2();
            break;
            case 300:
                heatWaves.playWave3();
            break;
            case 389:
                heatWaves.loopWave3();
            break;
            case 719:
                toggleInput(true);
            break;
		}
	})
}

var heatWaves = function(){
return{
   playWave1: function(){
       window_plane.mesh.visible =
       heat_wave.mesh.visible =
       heat_wave2.visible =
       heat_wave3.visible = true;
       ah1.play(0, 86);
   }
   ,
   loopWave1: function(){
       ah1.loop(86, 161);
   }
   ,
   playWave2: function(){
       heat_wave_refract.mesh.visible = true;
       ah2.play(0, 86);
   }
   ,
   loopWave2: function(){
       fade.out(i89, 200);
       ah2.loop(86, 162);
   }
   ,
   playWave3: function(){
       fade.in(i89, 200);
       fade.out(heat_wave_refract, 1000);
       heat_wave_reflect.mesh.visible =
       heat_wave_reflect2.visible =
       heat_wave_reflect3.visible = true;
       ah3.play(0, 87);
   }
   ,
   loopWave3: function(){
       ah3.loop(87, 162);
   }
   ,
   scaleWindowPlane: function(){
       var time = 1000, maxScale = 1.95;
       var scaleUp = new TWEEN.Tween( window_plane.mesh.scale );
       scaleUp.to( { x: maxScale, y: maxScale, z: 1 }, time );
       scaleUp.repeat(Infinity);
       scaleUp.yoyo(true);
       scaleUp.start();

       var posTween = new TWEEN.Tween( window_plane.mesh.position );
       posTween.to( { y: - 73 }, time );
       posTween.repeat(Infinity);
       posTween.yoyo(true);
       posTween.start();
   }
}
}();

var fade = function(obj, time){
    if(time == undefined) time = 1000;
    function tweenOpac(obj, val, time){
        for (var i = 0; i < obj.mesh.material.materials.length; i++){
            var mat = obj.mesh.material.materials[i];
            var fade = new TWEEN.Tween( mat );

            if(val == 0){
                mat.maxOpacity = mat.opacity;
                mat.transparent = true;
                fade.onComplete(function () {obj.mesh.visible = false});
                fade.to( { opacity: val }, time );
            }
            else {
                obj.mesh.visible = true;
                fade.to( { opacity: mat.maxOpacity }, time );
            }

            fade.start();
        }
    }
return{
    out: function(obj, time){
        tweenOpac(obj, 0, time);
    }
    ,
    in: function(obj, time){
        tweenOpac(obj, 1, time);
    }
}
}();
