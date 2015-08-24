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
                //play wave 1
                heat_wave.mesh.visible = heat_wave2.visible = heat_wave3.visible = true;
                ah1.play(0, 86);
			break;
            case 197:
                //loop wave 1, play wave 2
                heat_wave_refract.mesh.visible = true;
                ah1.loop(86, 161);
                ah2.play(0, 86);
            break;
            case 285:
                //STOP 1
                ah2.loop(86, 162);
                //ch.pause();
                toggleInput(true);
            break;
            case 300:
                //play wave 3
                heat_wave_reflect.mesh.visible = heat_wave_reflect2.visible =
                    heat_wave_reflect3.visible = true;
                ah3.play(0, 87);
            break;
            case 389:
                //STOP 3
                ah3.loop(87, 162);
            break;
		}
	})
}