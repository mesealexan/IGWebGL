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
	};

  this.stopAllSnow = function() {
      for (var i = 0; i < this.handlers.length; i++) {
          var h = this.handlers[i];
          if(h.constructor == SnowHandler) h.stop();
      }
  }
}

function addWatch (obj, val) {
	watch(obj, val, function(prop, action, newvalue/*, oldvalue*/){
    //console.log(newvalue)
	switch (newvalue){
    case 0:
        coldnightIntro.play();
        updater.stopAllSnow();
    break;
    case 10:
        logo.mesh.visible = false;
        //switchWindow.i89_off();
        heat_wave_refract.mesh.visible = false;
    break;
    case 220:
        coldnightIntro.fade(1.0, 0.0, 3000);
    break;
    case 287:
        heaterLoop.play();
        heaterLoop.fade(0.0, 1.0, 1000);
        heatWaves.playWave1();
    break;
    case 320:
        heaterLoop.fade(1.0, 0.6, 2000);
    break;
    case 404:
        heatWaves.loopWave1();
        heatWaves.playWave2();
      break;
      case 521:
          //ch.pause();
          //toggleInput(true);
          heatWaves.loopWave2();
    break;
    case 638:
        heaterLoop.fade(0.6, 1.0, 2000);
        switchWindow.i89_on();
        //logo.mesh.visible = true;
        heatWaves.playWave3();
    break;
    case 670:
        cameraZoom.play();
    break;
      case 755:
          heatWaves.loopWave3();
    break;
    case 830:
        cameraZoom.play();
    break;
    case 868:
        heaterLoop.fade(1.0, 0.0, 5000);
          $('#cameraButtons').toggle();
          //toggleInput(true);
    break;
    }
	})
}

var switchWindow = function () {
  var fadeTime = 300, fading = false, off = true, on = false;
return{
    toggleON: function(){
        this.i89_on();
        windowToggleS.play();
    },
    toggleOFF: function(){
        this.i89_off();
        windowToggleS.play();
    },
    i89_on: function  () {
    if(fading || on) return;
    fading = true;
    on = true;
    off = false;
    fade.out(heat_wave_refract, fadeTime);
    fade.in(heat_wave_reflect, fadeTime);
    fade.in({mesh: heat_wave_reflect2}, fadeTime);
    fade.in({mesh: heat_wave_reflect3}, fadeTime);
    fade.in(window_plane, fadeTime);

    fade.out(i89, fadeTime - (fadeTime * 0.1));
    setTimeout(function(){ fade.in(logo, fadeTime);fade.in(i89, fadeTime) }, fadeTime);
    setTimeout(function(){ fading = false;}, fadeTime * 2);
    }
    ,
    i89_off: function () {
    if(fading || off) return;
    fading = true;
    off = true;
    on = false;
    fade.in(heat_wave_refract, fadeTime);
    fade.out(heat_wave_reflect, fadeTime);
    fade.out({mesh: heat_wave_reflect2}, fadeTime);
    fade.out({mesh: heat_wave_reflect3}, fadeTime);
    fade.out(window_plane, fadeTime);
    fade.out(logo, fadeTime);
    fade.out(i89, fadeTime - (fadeTime * 0.1));
    setTimeout(function(){ fade.in(i89, fadeTime) }, fadeTime);
    setTimeout(function(){ fading = false }, fadeTime * 2);
    }
}
}();

var heatWaves = function(){
return{
   playWave1: function(){
       window_plane.mesh.visible =
       heat_wave.mesh.visible =
       heat_wave2.visible =
       heat_wave3.visible = true;
       //ah1.play(0, 86);
       ah1.play(0, 115);
   }
   ,
   loopWave1: function(){
       //ah1.loop(86, 161);
       ah1.loop(115, 195);
   }
   ,
   playWave2: function(){
       heat_wave_refract.mesh.visible = true;
       //ah2.play(0, 86);
       ah2.play(0, 115);
   }
   ,
   loopWave2: function(){
       //ah2.loop(86, 162);
       ah2.loop(115, 195)
   }
   ,
   playWave3: function(){
       heat_wave_reflect.mesh.visible =
       heat_wave_reflect2.visible =
       heat_wave_reflect3.visible = true;
       ah3.play(0, 115);
   }
   ,
   loopWave3: function(){
       ah3.loop(115, 195);
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
       posTween.to( { y: -69 }, time );
       posTween.repeat(Infinity);
       posTween.yoyo(true);
       posTween.start();
   }
}
}();

var fade = function(obj, time){
    if(time == undefined) time = 1000;
    function tweenOpac(obj, val, time){
        //console.log(obj)
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
        out: function(obj, time){ tweenOpac(obj, 0, time); }
        ,
        in: function(obj, time){ tweenOpac(obj, 1, time); }
    }
}();
