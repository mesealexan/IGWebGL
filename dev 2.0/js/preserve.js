define(['events', 'animate', 'tween'], 
function (events, animate, tween) {

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
		},
		dust: {
			add: function(){
              events.AddButton({text:"dust", function: preserve.assets.dust.toggleDust, id:"dust"});
          	},
          	remove: function(){ events.RemoveElementByID("dust"); }
		}
	};

	//on start loading
	preserve.onStartFunctions.addLights = function (scene) {
		preserve.assets.ambientLight = new THREE.AmbientLight(0x666666);
        scene.add(preserve.assets.ambientLight);

        preserve.assets.directionalLight = new THREE.DirectionalLight(0xbbbbbb, 1);
		preserve.assets.directionalLight.position.set( 0, 256, 256 );
		scene.add( preserve.assets.directionalLight );

		var helper = new THREE.DirectionalLightHelper(preserve.assets.directionalLight, 256);
		scene.add(helper);
	};

	preserve.onStartFunctions.addFlags = function () {
		preserve.flags.perspective = 'far';
		preserve.flags.castDust = false;
	};

	//on loading
	preserve.onLoadFunctions.Ground = function (mesh) {
		var map = mesh.material.materials[0].map;
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
		map.repeat.set(20, 20);
	};

	preserve.onLoadFunctions.House = function (mesh) {
		mesh.material.materials[0].shading = 1;
		mesh.material.materials[0].bumpScale = 0.3;
	};

	//on finish loading
	preserve.onFinishLoadFunctions.init = function (scene) {
        events.AddControls();
        events.ToggleControls(false);
        animate.loader.cameraHandler.play(0,1);
        animate.Animate();

        preserve.assets.dust = new generateDust(scene);

        preserve.buttons.camera.add();
        preserve.buttons.dust.add();
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

	function generateDust (scene) {
		var map = THREE.ImageUtils.loadTexture(animate.loader.mediaFolderUrl+'/models/preserve/dust_particle.png');
		var material = new THREE.SpriteMaterial( { map: map } );
		var dust_interval = undefined;

		function shootDust () {
			var max = 500, min = -500;
			var dust = new THREE.Sprite(material.clone());
			dust.scale.set(512, 512);
			dust.material.opacity = 0;
			dust.position.x = -1600 + (Math.floor(Math.random() * (max - min + 1)) + min);
			dust.position.z = 1300 + (Math.floor(Math.random() * (max - min + 1)) + min);
			dust.position.y = -128;

			var dust_tween_y = new TWEEN.Tween(dust.position).to({y: 128}, 4000)
			.onComplete(function(){
				scene.remove(dust);
			});

			var dust_tween_opacity_in = new TWEEN.Tween(dust.material).to({opacity: 1}, 2000);
			var dust_tween_opacity_out = new TWEEN.Tween(dust.material).to({opacity: 0}, 2000);
			dust_tween_opacity_in.chain(dust_tween_opacity_out);

			scene.add(dust);
			dust_tween_y.start();
			dust_tween_opacity_in.start();
		}

		var ret = {
			toggleDust: function () {
				if (preserve.flags.castDust == false) {
					preserve.flags.castDust = true;
					dust_interval = setInterval(shootDust, 500);
				}
				else {
					preserve.flags.castDust = false;
					clearInterval(dust_interval);
				}
			}
		};

		return ret;
	}

	return preserve;
});