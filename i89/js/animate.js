var updater = new updater();

var animSettings = {
	then: Date.now(),
	now: undefined,
	fps: 30,
	delta: undefined,
	frame: 0
}
animSettings.interval = 1000 / animSettings.fps;

function animate (time) {
	requestAnimationFrame(animate);
	animSettings.now = Date.now();
	animSettings.delta = animSettings.now - animSettings.then;

	if (animSettings.delta > animSettings.interval){
		animSettings.then = animSettings.now - (animSettings.delta % animSettings.interval);
		updater.updateHandlers();	
		renderer.render(scene, camera); 
	} 
}

function updater () {
	this.handlers = [];

	this.addHandler = function(h){ this.handlers.push(h) }

	this.removeHandler = function(h){
		var index = this.handlers.indexOf(h);
		if(index > -1) this.handlers.splice(index, 1);
	}

	this.updateHandlers = function () {
		for (key in this.handlers) this.handlers[key].update();
	}	
}

//addWatch(animSettings, "frame")

function addWatch (obj, val) {
	watch(obj, val, function(prop, action, newvalue, oldvalue){
    console.log(newvalue)
		switch (newvalue){
			case 0:
				//
			break;
		}
	})
}

