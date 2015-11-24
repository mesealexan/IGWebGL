define(['events', 'animate'], 
function (events, animate) {

	var preserve = {
		folderName: 'preserve',
		assetNames: ['House', 'Ground', 'Sky', 'PickupTruck', 'Wheelbarrow', 'PaintCans', 'Groundmounds'],
		onStartFunctions: {},
		onLoadFunctions: {},
		onFinishLoadFunctions: {},
		//onUnloadFunctions: {},
		//animationHandlers: {},
		assets: {},
		flags: {}
	};

	preserve.buttons = {
		camera: {
			add: function(){
              events.AddButton({text:"camera", function: toggleCamera, id:"camera"});
          	},
          	remove: function(){ events.RemoveElementByID("camera"); }
		}
	};

	//on start loading
	preserve.onStartFunctions.addLights = function (scene) {
		preserve.assets.ambientLight = new THREE.AmbientLight(0xffffff);
        scene.add(preserve.assets.ambientLight);
	};

	preserve.onStartFunctions.addFlags = function () {
		preserve.flags.perspective = 'far';
	};

	//on loading
	preserve.onLoadFunctions.Ground = function (mesh) {
		var map = mesh.material.materials[0].map;
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
		map.repeat.set(20, 20);
	};

	//on finish loading
	preserve.onFinishLoadFunctions.init = function () {
        events.AddControls();
        events.ToggleControls(false);
        animate.loader.cameraHandler.play(0,1);
        animate.Animate();

        preserve.buttons.camera.add();

    };

	//on unloading

	//private
	function toggleCamera () {
		if (preserve.flags.perspective == 'far') {
			preserve.flags.perspective = 'near';
			animate.loader.cameraHandler.play(60);
		} 
		else {
			preserve.flags.perspective = 'far';
			animate.loader.cameraHandler.play(225, 60);
		}
	}

	return preserve;
});