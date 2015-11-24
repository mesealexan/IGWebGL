define(['events'], 
function (events) {

	var preserve = {
		folderName: 'preserve',
		assetNames: ['House', 'Ground', 'Sky', 'PickupTruck', 'Wheelbarrow', 'PaintCans', 'Groundmounds'],
		onStartFunctions: {},
		onLoadFunctions: {},
		onFinishLoadFunctions: {},
		onUnloadFunctions: {},
		animationHandlers: {},
		assets: {},
		flags: {}
	};

	//on start loading
	preserve.onStartFunctions.addLights = function (scene) {
		preserve.assets.ambientLight = new THREE.AmbientLight(0xffffff);
        scene.add(preserve.assets.ambientLight);
	};

	//on loading
	preserve.onLoadFunctions.Ground = function (mesh) {
		var map = mesh.material.materials[0].map;
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
		map.repeat.set(20, 20);
	};

	//on finish loading
	preserve.onFinishLoadFunctions.addControls = function () {
        events.AddControls();
        events.ToggleControls(false);
    };

	//on unloading

	//private

	return preserve;
});