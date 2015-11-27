define(['events', 'animate', 'tween', 'materials', 'animationHandler'], 
function (events, animate, tween, materials, animationHandler) {

	var preserve = {
		folderName: 'preserve',
		assetNames: ['House', 'Ground', 'Sky', 'PickupTruck', 'Wheelbarrow', 'PaintCans', 'Groundmounds', 'Windows', 'WindowPreserved', 'Foil'],
		onStartFunctions: {},
		onLoadFunctions: {},
		onFinishLoadFunctions: {},
		//onUnloadFunctions: {},
		animationHandlers: {},
		assets: {},
		flags: {},
		tweens: {}
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
		},
		foil: {
			add: function(){
              events.AddButton({text:"foil", function: toggleFoil, id:"foil"});
          	},
          	remove: function(){ events.RemoveElementByID("foil"); }
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
		preserve.flags.foilUp = false;
	};

	//on loading
	preserve.onLoadFunctions.Windows = function (mesh, loader) {
		mesh.material.materials[0].transparent = true;
		mesh.material.materials[0].opacity = 1;

		preserve.assets.dirtMap = THREE.ImageUtils.loadTexture(materials.mediaFolderUrl+'/models/preserve/preserve_window_diffuse.jpg');
        preserve.assets.dirtOpac = THREE.ImageUtils.loadTexture(materials.mediaFolderUrl+'/models/preserve/preserve_window_opacity.jpg');

		materials.NeatGlassDirt.prototype = new THREE.ShaderMaterial();
		
		var temp_mat = new materials.NeatGlassDirt({maxDirt: 0.6, morphed: false});
		temp_mat.uniforms.map.value = preserve.assets.dirtMap;
		temp_mat.uniforms.opacMap.value = preserve.assets.dirtOpac;
		var temp_geo = mesh.geometry.clone();

		preserve.assets.glass_dirt = new THREE.Mesh(temp_geo, temp_mat);
		preserve.assets.glass_dirt.position.z = 2;
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

	preserve.onLoadFunctions.WindowPreserved = function (mesh) {
		mesh.material.materials[0].transparent = true;
		//
	};

	preserve.onLoadFunctions.Foil = function (mesh, loader) {
		mesh.material.materials[0].transparent = true;
		mesh.material.materials[0].opacity = 0.64;
		mesh.material.materials[0].morphTargets = true;

		preserve.tweens.foil_in = new TWEEN.Tween(mesh.material.materials[0]).to({opacity: 0}, 3000);
		preserve.tweens.foil_in.easing(TWEEN.Easing.Exponential.In);

		preserve.tweens.foil_out = new TWEEN.Tween(mesh.material.materials[0]).to({opacity: 0.64}, 3000).delay(400);
		preserve.tweens.foil_out.easing(TWEEN.Easing.Exponential.Out);

		preserve.animationHandlers.foil = new animationHandler();
		preserve.animationHandlers.foil.setMesh(mesh);

		materials.NeatGlassDirt.prototype = new THREE.ShaderMaterial();
		
		var temp_mat = new materials.NeatGlassDirt({maxDirt: 0.6, morphed: true});
		temp_mat.uniforms.map.value = preserve.assets.dirtMap;
		temp_mat.uniforms.opacMap.value = preserve.assets.dirtOpac;

		var temp_geo = mesh.geometry.clone();
		temp_geo.morphTargets = mesh.geometry.morphTargets;

		preserve.assets.foil_dirt = new THREE.Mesh(temp_geo, temp_mat);
		preserve.assets.foil_dirt.position.z = 2;

		preserve.tweens.foil_dirt_in = new TWEEN.Tween(preserve.assets.foil_dirt.material.uniforms.opacVal).to({value: 0}, 3000);
		preserve.tweens.foil_dirt_in.easing(TWEEN.Easing.Exponential.In);

		preserve.tweens.foil_dirt_out = new TWEEN.Tween(preserve.assets.foil_dirt.material.uniforms.opacVal).to({value: 0.5}, 3000).delay(400);
		preserve.tweens.foil_dirt_out.easing(TWEEN.Easing.Exponential.Out);

		preserve.animationHandlers.foil_dirt = new animationHandler();
		preserve.animationHandlers.foil_dirt.setMesh(preserve.assets.foil_dirt);

		loader.scene.add(preserve.assets.foil_dirt);
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
        preserve.buttons.foil.add();
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
					preserve.assets.foil_dirt.material.Start();
				}
				else {
					preserve.flags.castDust = false;
					clearInterval(dust_interval);
					preserve.assets.glass_dirt.material.Clean();
					preserve.assets.foil_dirt.material.Clean();
				}
			}
		};

		return ret;
	}

	function toggleFoil () {
		if (preserve.flags.foilUp == false) {
			preserve.flags.foilUp = true;
			preserve.animationHandlers.foil.play(0, 106);
			preserve.animationHandlers.foil_dirt.play(0, 106);
			preserve.tweens.foil_in.start();
			preserve.tweens.foil_dirt_in.start();
		}
		else {
			preserve.flags.foilUp = false;
			preserve.animationHandlers.foil.play(106, 0);
			preserve.animationHandlers.foil_dirt.play(106, 0);
			preserve.tweens.foil_out.start();
			preserve.tweens.foil_dirt_out.start();
		}
	}

	return preserve;
});