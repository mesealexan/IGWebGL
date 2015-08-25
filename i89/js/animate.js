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

function addWatch (obj, val) {
	watch(obj, val, function(prop, action, newvalue/*, oldvalue*/){
		switch (newvalue){
			case 110:
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
		}
	})
}

var heatWaves = function(){
   return{
       playWave1: function(){
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
           ah2.loop(86, 162);
       }
       ,
       playWave3: function(){
           heat_wave_reflect.mesh.visible =
           heat_wave_reflect2.visible =
           heat_wave_reflect3.visible = true;
           ah3.play(0, 87);
       }
       ,
       loopWave3: function(){
           ah3.loop(87, 162);
       }
   }
}();