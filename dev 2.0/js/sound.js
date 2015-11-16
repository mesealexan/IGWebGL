define(['events', 'animate', 'animationHandler'], function (events, animate, animationHandler) {
	var sound = {};
	sound.folderName = 'sound';
	sound.assetNames = ['avion_mesh', 'truck_mesh'];
	//sound.soundNames = [];
	sound.onStartFunctions = {};
	sound.onLoadFunctions = {};
	sound.onFinishLoadFunctions = {};
	//sound.onUnloadFunctions = {};
	//sound.animationHandlers = {};
	//sound.timeouts = {};
	sound.animations = {};
	sound.assets = {};

	//on start loading
	sound.onStartFunctions.addLights = function (scene) {
		sound.assets.ambientLight = new THREE.AmbientLight(0xffffff);
        scene.add(sound.assets.ambientLight);
	};

	//on loading
	sound.onLoadFunctions.avion_mesh = function (mesh, loader) {
		sound.animations.avion_01 = new animate.PositionRotationHandler(mesh, loader.ParseJSON('media/models/sound/avion_01_key.json'));
		sound.animations.avion_02 = new animate.PositionRotationHandler(mesh, loader.ParseJSON('media/models/sound/avion_02_key.json'));
		sound.assets.avion_mesh = mesh;
		sound.assets.avion_mesh.visible = false;
	}

	sound.onLoadFunctions.truck_mesh = function (mesh, loader) {
		sound.animations.truck_01 =  new animate.PositionRotationHandler(mesh, loader.ParseJSON('media/models/sound/truck_01_key.json'));
		sound.assets.truck_mesh = mesh;
		sound.assets.truck_mesh.visible = false;
	}

	//on finish loading
    sound.onFinishLoadFunctions.addControls = function () {
        events.AddControls();
        events.ToggleControls(false);
    };

    sound.onFinishLoadFunctions.playAnimations = function () {
    	//plane outside
    	setTimeout(function(){
    		sound.assets.avion_mesh.visible = true;
    		animate.updater.addHandler(sound.animations.avion_01)
    	}, 1000);

 		//plane inside
    	setTimeout(function(){
    		animate.updater.addHandler(sound.animations.avion_02)
    	}, 8000);
    	
    	//truck
    	setTimeout(function(){
    		sound.assets.truck_mesh.visible = true;
    		animate.updater.addHandler(sound.animations.truck_01)
    	}, 1000);
    }

    //on unloading

    //private

	return sound;
});