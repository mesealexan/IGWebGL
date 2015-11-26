define(['events', 'animate', 'tween', 'materials'], 
function (events, animate, tween, materials) {

	var preserve = {
		folderName: 'preserve',
		assetNames: ['House', 'Ground', 'Sky', 'PickupTruck', 'Wheelbarrow', 'PaintCans', 'Groundmounds', 'Windows'],
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
		preserve.assets.ambientLight = new THREE.AmbientLight(0xbbbbbb);
        scene.add(preserve.assets.ambientLight);

        preserve.assets.directionalLight = new THREE.DirectionalLight(0x999999, 1);
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
	preserve.onLoadFunctions.Windows = function (mesh, loader) {
		mesh.material.materials[0].transparent = true;
		mesh.material.materials[0].opacity = 1;

		var dirtMap = THREE.ImageUtils.loadTexture(materials.mediaFolderUrl+'/models/preserve/preserve_window_diffuse.jpg');
        var dirtOpac = THREE.ImageUtils.loadTexture(materials.mediaFolderUrl+'/models/preserve/preserve_window_opacity.jpg');

		materials.NeatGlassDirt.prototype = new THREE.ShaderMaterial();
		
		var temp_mat = new materials.NeatGlassDirt({maxDirt: 0.6});
		temp_mat.uniforms.map.value = dirtMap;
		temp_mat.uniforms.opacMap.value = dirtOpac;
		var temp_geo = mesh.geometry.clone();

		preserve.assets.glass_dirt = new THREE.Mesh(temp_geo, temp_mat);
		preserve.assets.glass_dirt.position.z = -2;
		loader.scene.add(preserve.assets.glass_dirt);
	};

	preserve.onLoadFunctions.Ground = function (mesh) {
		mesh.material.materials[0].bumpScale = 60;

		var map = mesh.material.materials[0].map;
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
		map.repeat.set(20, 20);

		var tmap = mesh.material.materials[0].bumpMap;
		tmap.wrapS = THREE.RepeatWrapping;
        tmap.wrapT = THREE.RepeatWrapping;
		tmap.repeat.set(20, 20);
	};

	preserve.onLoadFunctions.Groundmounds = function (mesh) {
		mesh.material.materials[0].bumpScale = 0.3;
		//
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
					preserve.assets.glass_dirt.material.Start();
				}
				else {
					preserve.flags.castDust = false;
					clearInterval(dust_interval);
					preserve.assets.glass_dirt.material.Clean();
				}
			}
		};

		return ret;
	}

	return preserve;
});