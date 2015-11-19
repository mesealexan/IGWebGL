define(['events', 'animate', 'events', 'tween', 'animationHandler'], 
function (events, animate, events, tween, animationHandler) {
	var sound = {};
	sound.folderName = 'sound';
	sound.assetNames = ['avion_mesh', 'truck_mesh', 'road_mesh', 'house_mesh', 'enviroment_cylinder', 
	'windowframe_mesh', 'window_mesh', 'ground_plane_mesh', 'ring_01_mesh', 'ring_02_mesh', 'ring_03_mesh',
    'graphic_bars_mesh', 'graphic_plane', 'graphic_text100dB', 'graphic_text160dB'
	];
	//sound.soundNames = [];
	sound.onStartFunctions = {};
	sound.onLoadFunctions = {};
	sound.onFinishLoadFunctions = {};
	//sound.onUnloadFunctions = {};
	sound.animationHandlers = {};
	//sound.timeouts = {};
	//sound.animations = {};
	sound.assets = {};
	sound.flags = {};

	sound.buttons = {
      truck: {
          add: function(){
              events.AddButton({text:"truck", function: sound.assets.states.truck.start, id:"truck"});
          },
          remove: function(){ events.RemoveElementByID("truck"); }
      },
      plane: {
          add: function(){
              events.AddButton({text:"plane", function: sound.assets.states.plane.start, id:"plane"});
          },
          remove: function(){ events.RemoveElementByID("plane"); }
      }
    };

	//on start loading
	sound.onStartFunctions.addLights = function (scene) {
		sound.assets.ambientLight = new THREE.AmbientLight(0xffffff);
        scene.add(sound.assets.ambientLight);
	};

	sound.onStartFunctions.addFlags = function () {
		sound.flags.didYouSeeThePlane = false;
	};

	//on loading
	sound.onLoadFunctions.avion_mesh = function (mesh, loader) {
		sound.assets.avion_mesh = mesh;
		sound.assets.avion_mesh.visible = false;
		sound.assets.avion_01_key = loader.ParseJSON('media/models/sound/avion_01_key.json');
		sound.assets.avion_02_key = loader.ParseJSON('media/models/sound/avion_02_key.json');
	};

	sound.onLoadFunctions.truck_mesh = function (mesh, loader) {
		sound.assets.truck_mesh = mesh;
		sound.assets.truck_mesh.visible = false;
		sound.assets.truck_key = loader.ParseJSON('media/models/sound/truck_01_key.json');
	};

	sound.onLoadFunctions.ground_plane_mesh = function (mesh) {
		var map = mesh.material.materials[0].map;
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
		map.repeat.set(128, 128);
	};

	sound.onLoadFunctions.enviroment_cylinder = function (mesh) {
		mesh.material.materials[0].side = 2;
		mesh.scale.set(0.64, 0.64, 0.64);
	};

	sound.onLoadFunctions.ring_01_mesh = function (mesh) {
		mesh.visible = false;
		sound.assets.ring_01_mesh = mesh.clone();
	};

	sound.onLoadFunctions.ring_02_mesh = function (mesh) {
		mesh.visible = false;
		sound.assets.ring_02_mesh = mesh.clone();
	};

	sound.onLoadFunctions.ring_03_mesh = function (mesh) {
		mesh.visible = false;
		sound.assets.ring_03_mesh = mesh.clone();
	};

    sound.onLoadFunctions.graphic_bars_mesh = function (mesh, loader) {
        sound.assets.graphic_bars_mesh = mesh;
        sound.assets.graphic_bars_mesh.visible = false;
    };

    sound.onLoadFunctions.graphic_plane = function (mesh) {
        sound.assets.graphic_plane = mesh;
        sound.assets.graphic_plane.material.materials[1].transparent = true;
        sound.assets.graphic_plane.visible = false;
    };

    sound.onLoadFunctions.graphic_text100dB = function (mesh) {
        sound.assets.graphic_text100dB = mesh.clone();
        sound.assets.graphic_text100dB.visible = false;
    };

    sound.onLoadFunctions.graphic_text160dB = function (mesh) {
        sound.assets.graphic_text160dB = mesh.clone();
        sound.assets.graphic_text160dB.visible = false;
    };

	//on finish loading
    sound.onFinishLoadFunctions.addControls = function () {
        events.AddControls();
        events.ToggleControls(false);
    };

    sound.onFinishLoadFunctions.playStuff = function (scene) {
    	sound.assets.states = new states(scene);

    	//truck outside
    	setTimeout(function(){
    		sound.assets.states.truck.start();
    	}, 1000);

    	//plane outside
    	setTimeout(function(){
    		sound.assets.states.plane.start();
    	}, 9000);

 		//truck inside
    	setTimeout(function(){
    		sound.assets.states.truck.start();
    		insideRings(scene);
    	}, 16000);

    	//plane inside
    	setTimeout(function(){
    		sound.assets.states.plane.start();
    	}, 22000);

    	//to states
    	setTimeout(function(){
    		sound.buttons.truck.add();
    		sound.buttons.plane.add();
    	}, 27000);
    	outsideRings(scene);
        soundGraph(scene, 'outside');
    };

    //on unloading

    //private
    function states (scene) {
    	var curState = undefined, temp_mesh = undefined, temp_anim = undefined;
      	var ret = {
	        truck: {

		        start: function () {
		            ret.stop("truck"); 
		            temp_mesh = sound.assets.truck_mesh.clone();
		            temp_mesh.visible = true;
		            scene.add(temp_mesh);
		            temp_anim = new animate.PositionRotationHandler(temp_mesh, sound.assets.truck_key);
                    //in case we will need to cut short the animation
                    //temp_anim.frame = 100;
		            animate.updater.addHandler(temp_anim);
		        },

		        stop: function () {
		        	animate.updater.removeHandler(temp_anim);
		          	scene.remove(temp_mesh);
		        }

	        },

	        plane: {

	          	start: function () {
		            ret.stop("plane");
		            if (sound.flags.didYouSeeThePlane) temp_key = sound.assets.avion_02_key;
		            else {
		            	temp_key = sound.assets.avion_01_key;
		            	sound.flags.didYouSeeThePlane = true;
		            }
		            temp_mesh = sound.assets.avion_mesh.clone();
		            temp_mesh.visible = true;
		            scene.add(temp_mesh);
					temp_anim = new animate.PositionRotationHandler(temp_mesh, temp_key);
		            animate.updater.addHandler(temp_anim);
	          	},

	          	stop: function () {
	          		animate.updater.removeHandler(temp_anim);
		          	scene.remove(temp_mesh);
	         	}

	        },
	        
	        stop: function (newState) {
	          	if(curState)ret[curState].stop();
	          	curState = newState;
	        }
	    };
      	return ret;
    }

    //testing
    function outsideRings (scene) {
    	var temp_ring_01 = sound.assets.ring_01_mesh.clone();
    	var temp_ring_02 = sound.assets.ring_02_mesh.clone();
    	var temp_ring_03 = sound.assets.ring_03_mesh.clone();

    	temp_ring_01.visible = true;
    	temp_ring_01.material.materials[0].transparent = true;
    	temp_ring_01.material.materials[0].opacity = 0;
    	temp_ring_01.position.y += 110;
    	temp_ring_01.position.z -= 330;

    	temp_ring_02.visible = true;
    	temp_ring_02.material.materials[0].transparent = true;
    	temp_ring_02.material.materials[0].opacity = 0;
    	temp_ring_02.position.y += 110;
    	temp_ring_02.position.z -= 330;

    	temp_ring_03.visible = true;
    	temp_ring_03.material.materials[0].transparent = true;
    	temp_ring_03.material.materials[0].opacity = 0;
    	temp_ring_03.position.y += 110;
    	temp_ring_03.position.z -= 330;

    	scene.add(temp_ring_01);
    	scene.add(temp_ring_02);
    	scene.add(temp_ring_03);

    	var opacityTween01 = new TWEEN.Tween(temp_ring_01.material.materials[0]).to({opacity: 1}, 2000).delay(1000);
    	var opacityTween02 = new TWEEN.Tween(temp_ring_02.material.materials[0]).to({opacity: 1}, 2000).delay(1000);
    	var opacityTween03 = new TWEEN.Tween(temp_ring_03.material.materials[0]).to({opacity: 1}, 2000).delay(1000);

    	var opacityTweenOut01 = new TWEEN.Tween(temp_ring_01.material.materials[0]).to({opacity: 0}, 2000)
    	.onComplete(function(){
    		scene.remove(temp_ring_01);
    	}).delay(9000);

    	var opacityTweenOut02 = new TWEEN.Tween(temp_ring_02.material.materials[0]).to({opacity: 0}, 2000)
    	.onComplete(function(){
    		scene.remove(temp_ring_02);
    	}).delay(9000);

    	var opacityTweenOut03 = new TWEEN.Tween(temp_ring_03.material.materials[0]).to({opacity: 0}, 2000)
    	.onComplete(function(){
    		scene.remove(temp_ring_03);
    	}).delay(9000);

    	opacityTween01.chain(opacityTweenOut01);
    	opacityTween01.start();

    	opacityTween02.chain(opacityTweenOut02);
    	opacityTween02.start();

    	opacityTween03.chain(opacityTweenOut03);
    	opacityTween03.start();

    	var maxScale = new THREE.Vector3(1, 1, 1);
    	var minScale01 = new THREE.Vector3(0.8, 0.8, 0.8);
    	var minScale02 = new THREE.Vector3(0.6, 0.6, 0.6);
    	var minScale03 = new THREE.Vector3(0.5, 0.5, 0.5);

    	var tween_01a = new TWEEN.Tween(temp_ring_01.scale).to(minScale01, 1000);
    	var tween_01b = new TWEEN.Tween(temp_ring_01.scale).to(maxScale, 1000);
    	tween_01a.chain(tween_01b);
    	tween_01b.chain(tween_01a);

    	var tween_02a = new TWEEN.Tween(temp_ring_02.scale).to(minScale02, 1000);
    	var tween_02b = new TWEEN.Tween(temp_ring_02.scale).to(maxScale, 1000);
    	tween_02a.chain(tween_02b);
    	tween_02b.chain(tween_02a);

    	var tween_03a = new TWEEN.Tween(temp_ring_03.scale).to(minScale03, 1000);
    	var tween_03b = new TWEEN.Tween(temp_ring_03.scale).to(maxScale, 1000);
    	tween_03a.chain(tween_03b);
    	tween_03b.chain(tween_03a);

        tween_01a.start();
        tween_02a.start();
    	tween_03a.start();
    }

    function insideRings (scene) {
    	var temp_ring_01 = sound.assets.ring_01_mesh.clone();
    	var temp_ring_02 = sound.assets.ring_02_mesh.clone();
    	var temp_ring_03 = sound.assets.ring_03_mesh.clone();

    	temp_ring_01.rotation.y = Math.PI/2;
    	temp_ring_01.visible = true;
    	temp_ring_01.material.materials[0].transparent = true;
    	temp_ring_01.material.materials[0].opacity = 0;
    	temp_ring_01.position.y += 110;
    	temp_ring_01.position.z -= 200;
    	temp_ring_01.position.x += 6;

    	temp_ring_02.rotation.y = Math.PI/2;
    	temp_ring_02.visible = true;
    	temp_ring_02.material.materials[0].transparent = true;
    	temp_ring_02.material.materials[0].opacity = 0;
    	temp_ring_02.position.y += 110;
    	temp_ring_02.position.z -= 200;
    	temp_ring_02.position.x += 6;

    	temp_ring_03.rotation.y = Math.PI/2;
    	temp_ring_03.visible = true;
    	temp_ring_03.material.materials[0].transparent = true;
    	temp_ring_03.material.materials[0].opacity = 0;
    	temp_ring_03.position.y += 110;
    	temp_ring_03.position.z -= 200;
    	temp_ring_03.position.x += 6;

    	scene.add(temp_ring_01);
    	scene.add(temp_ring_02);
    	scene.add(temp_ring_03);

    	var opacityTween01 = new TWEEN.Tween(temp_ring_01.material.materials[0]).to({opacity: 0.64}, 3000).delay(1000).start();
    	var opacityTween02 = new TWEEN.Tween(temp_ring_02.material.materials[0]).to({opacity: 0.64}, 3000).delay(1000).start();
    	var opacityTween03 = new TWEEN.Tween(temp_ring_03.material.materials[0]).to({opacity: 0.64}, 3000).delay(1000).start();

    	var maxScale = new THREE.Vector3(0.45, 0.45, 0.45);
    	var minScale01 = new THREE.Vector3(0.2, 0.2, 0.2);
    	var minScale02 = new THREE.Vector3(0.16, 0.16, 0.16);
    	var minScale03 = new THREE.Vector3(0.14, 0.14, 0.14);

    	var tween_01a = new TWEEN.Tween(temp_ring_01.scale).to(minScale01, 1000);
    	var tween_01b = new TWEEN.Tween(temp_ring_01.scale).to(maxScale, 1000);
    	tween_01a.chain(tween_01b);
    	tween_01b.chain(tween_01a);
    	tween_01a.start();

    	var tween_02a = new TWEEN.Tween(temp_ring_02.scale).to(minScale02, 1000);
    	var tween_02b = new TWEEN.Tween(temp_ring_02.scale).to(maxScale, 1000);
    	tween_02a.chain(tween_02b);
    	tween_02b.chain(tween_02a);
    	tween_02a.start();

    	var tween_03a = new TWEEN.Tween(temp_ring_03.scale).to(minScale03, 1000);
    	var tween_03b = new TWEEN.Tween(temp_ring_03.scale).to(maxScale, 1000);
    	tween_03a.chain(tween_03b);
    	tween_03b.chain(tween_03a);
    	tween_03a.start();
    }

    function soundGraph (scene, location) {
        //setup
        var temp_graph = sound.assets.graphic_bars_mesh.clone();
        var temp_graph_plane = sound.assets.graphic_plane.clone();
        var temp_text100db = sound.assets.graphic_text100dB.clone();
        var temp_text160db = sound.assets.graphic_text160dB.clone();

        temp_graph.material.materials[0].transparent = true;
        temp_graph.material.materials[0].opacity = 0;
        temp_graph.visible = true;

        for (var i = 0; i < temp_graph_plane.material.materials.length; i++ ) {
            temp_graph_plane.material.materials[i].transparent = true;
            temp_graph_plane.material.materials[i].opacity = 0;
        }
        temp_graph_plane.visible = true;

        temp_text100db.material.materials[0].transparent = true;
        temp_text100db.material.materials[0].opacity = 0;
        temp_text100db.visible = true;

        temp_text160db.material.materials[0].transparent = true;
        temp_text160db.material.materials[0].opacity = 0;
        temp_text160db.visible = true;

        temp_graph.material.materials[0].morphTargets = true;
        temp_anim = new animationHandler();
        temp_anim.setMesh(temp_graph);

        var graphOpacityTween01 = new TWEEN.Tween(temp_graph.material.materials[0]).to({opacity: 1}, 2000).delay(1000);
        var graphOpacityTweenOut01 = new TWEEN.Tween(temp_graph.material.materials[0]).to({opacity: 0}, 2000)
        .onComplete(function(){
            scene.remove(temp_graph);
        }).delay(9000);

        var graphOpacityTween02 = new TWEEN.Tween(temp_graph_plane.material.materials[0]).to({opacity: 1}, 2000).delay(1000);
        var graphOpacityTweenOut02 = new TWEEN.Tween(temp_graph_plane.material.materials[0]).to({opacity: 0}, 2000)
        .onComplete(function(){
            //scene.remove(temp_graph);
        }).delay(9000);

        var graphOpacityTween03 = new TWEEN.Tween(temp_graph_plane.material.materials[1]).to({opacity: 0.35}, 2000).delay(1000);
        var graphOpacityTweenOut03 = new TWEEN.Tween(temp_graph_plane.material.materials[1]).to({opacity: 0}, 2000)
        .onComplete(function(){
            scene.remove(temp_graph);
        }).delay(9000);

        var text100Tween = new TWEEN.Tween(temp_text100db.material.materials[0]).to({opacity: 1}, 1000).delay(1000);
        var text100TweenOut = new TWEEN.Tween(temp_text100db.material.materials[0]).to({opacity: 0}, 1000).delay(4200);
        var text160Tween = new TWEEN.Tween(temp_text160db.material.materials[0]).to({opacity: 1}, 1000).delay(2100);
        var text160TweenOut = new TWEEN.Tween(temp_text160db.material.materials[0]).to({opacity: 0}, 1000).delay(2000);

        text100Tween.chain(text100TweenOut);
        text100TweenOut.chain(text160Tween);
        text160Tween.chain(text160TweenOut);
        graphOpacityTween01.chain(graphOpacityTweenOut01);
        graphOpacityTween02.chain(graphOpacityTweenOut02);
        graphOpacityTween03.chain(graphOpacityTweenOut03);

        if (location == 'outside') {
            temp_graph.position.y = 92;
            temp_graph.position.z = -330;

            temp_graph_plane.position.x = 4;
            temp_graph_plane.position.y = 110;
            temp_graph_plane.position.z = -330;

            temp_text100db.position.x = -2;
            temp_text100db.position.y = 110;
            temp_text100db.position.z = -330;

            temp_text160db.position.x = -2;
            temp_text160db.position.y = 110;
            temp_text160db.position.z = -330;
        }

        if (location == 'inside' ) {
            // cealut, ne vedem mai tarziu
        }

        //start everything
        scene.add(temp_graph);
        scene.add(temp_graph_plane);
        scene.add(temp_text100db);
        scene.add(temp_text160db);

        temp_anim.loop(0, 30);

        graphOpacityTween01.start();
        graphOpacityTween02.start();
        graphOpacityTween03.start();
        text100Tween.start();
    }

    function insideGraph (scene) {

    }
    //-----

	return sound;
});