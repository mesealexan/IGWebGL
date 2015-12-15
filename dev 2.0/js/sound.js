define(['scene', 'events', 'animate', 'events', 'tween', 'animationHandler', 'watch', 'materials', 'aeTween'],
function (scene, events, animate, events, tween, animationHandler, watch, materials, aeTween) {

return function(){
	var sound = new scene();
	sound.folderName = 'sound';
	sound.addAssets(['avion_mesh', 'truck_mesh', 'road_mesh', 'house_mesh', 'enviroment_cylinder',
		'windowframe_mesh', 'window_mesh', 'ground_plane_mesh', 'ring_01_mesh', 'ring_02_mesh', 'ring_03_mesh',
		'graphic_bars_mesh', 'graphic_plane', 'graphic_text100dB', 'graphic_text160dB', 'graphic_text50dB',
		'graphic_text80dB', 'text_mesh']);
	sound.dummyFrame = undefined;
	sound.flags = {};
	sound.textFadeFrameTime = 25;

	var dummyFrame = function(){
		this.maxFrame = 750;
		this.frame = 0;
		this.update = function () {
				if (this.frame == this.maxFrame) animate.updater.removeHandler(this);
				this.frame++;
		};
	}

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
      },
      cardinal: {
          add: function(){
              events.AddButton({text:"toggle cardinal", function: toggleCardinal, id:"cardinal"});
          },
          remove: function(){ events.RemoveElementByID("cardinal"); }
      }
    };

	//on start loading
	sound.onStartFunctions.storeScene = function (scene, loader) {
		sound.assets.scene = scene;
		sound.assets.loader = loader;
	};

	sound.onStartFunctions.addLights = function (scene) {
		sound.assets.ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(sound.assets.ambientLight);
	};

	sound.onStartFunctions.addFlags = function () {
		sound.flags.isCardinal = false;
    sound.flags.perspective = 'outside';
	};

	//on loading

	sound.onLoadFunctions.text_mesh = function (mesh, loader) {
		var material = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true});
		materials.outlineShader.prototype = new THREE.ShaderMaterial();
		var outlineMaterial = new materials.outlineShader({
			thickness: 2,
			color: new THREE.Color("rgb(150,150,150)")
		});

		var mats = [material, outlineMaterial];
		var multiMesh = THREE.SceneUtils.createMultiMaterialObject(mesh.geometry, mats);
		loader.DisposeObject(mesh);
		loader.scene.add(multiMesh);
		sound.assets.text_mesh = multiMesh;
		/*mesh.material = mesh.material.materials[0];
		mesh.material.transparent = true;
		sound.assets.text_mesh = mesh;*/
	};
	sound.onLoadFunctions.avion_mesh = function (mesh, loader) {
		sound.assets.avion_mesh = mesh;
		sound.assets.avion_mesh.visible = false;
		sound.assets.avion_01_key = loader.ParseJSON(animate.loader.mediaFolderUrl+'/models/sound/avion_01_key.JSON');
		sound.assets.avion_02_key = loader.ParseJSON(animate.loader.mediaFolderUrl+'/models/sound/avion_02_key.JSON');
	};

	sound.onLoadFunctions.truck_mesh = function (mesh, loader) {
		sound.assets.truck_mesh = mesh;
		sound.assets.truck_mesh.visible = false;
		sound.assets.truck_key = loader.ParseJSON(animate.loader.mediaFolderUrl+'/models/sound/truck_01_key.JSON');
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
    //mesh.material.materials[0]
		mesh.visible = false;
		sound.assets.ring_01_mesh = mesh;
	};

	sound.onLoadFunctions.ring_02_mesh = function (mesh) {
		mesh.visible = false;
		sound.assets.ring_02_mesh = mesh;
	};

	sound.onLoadFunctions.ring_03_mesh = function (mesh) {
		mesh.visible = false;
		sound.assets.ring_03_mesh = mesh;
	};

  sound.onLoadFunctions.graphic_bars_mesh = function (mesh) {
    sound.assets.graphic_bars_mesh = mesh;
    sound.assets.graphic_bars_mesh.visible = false;
  };

    sound.onLoadFunctions.graphic_plane = function (mesh) {
        sound.assets.graphic_plane = mesh;
        sound.assets.graphic_plane.material.materials[1].transparent = true;
        sound.assets.graphic_plane.visible = false;
    };

    sound.onLoadFunctions.graphic_text100dB = function (mesh) {
        sound.assets.graphic_text100dB = mesh;
        sound.assets.graphic_text100dB.visible = false;
    };

    sound.onLoadFunctions.graphic_text160dB = function (mesh) {
        sound.assets.graphic_text160dB = mesh;
        sound.assets.graphic_text160dB.visible = false;
    };

    sound.onLoadFunctions.graphic_text50dB = function (mesh) {
        mesh.visible = false;
        sound.assets.graphic_text50dB = mesh;
    };

    sound.onLoadFunctions.graphic_text80dB = function (mesh) {
        mesh.visible = false;
        sound.assets.graphic_text80dB = mesh;
    };

    sound.onLoadFunctions.window_mesh = function (mesh) {
        mesh.material.materials[0].transparent = true;
        mesh.material.materials[0].color.set(0x331a00);
        sound.assets.window_mesh = mesh;
    };

	//on finish loading

	sound.onFinishLoadFunctions.playCamera = function(scene, loader) {
		loader.cameraHandler.play(0, 1, onCompleteFirstPlay);

		function onCompleteFirstPlay(){
			animate.camera.position.x -= 300;
			loader.cameraHandler.tween(0, .03, onCompleteTween, TWEEN.Easing.Cubic.In);
		}

		function onCompleteTween(){
			tweenText();
			playStuff(sound.assets.scene, sound.assets.loader)
			loader.cameraHandler.play(undefined, undefined, function(){});
		};

		animate.Animate();
	};

	/*sound.onFinishLoadFunctions.playCamera = function(scene, loader) {
			 loader.cameraHandler.play(undefined,undefined,undefined,//from, to and onComplete undefined
				 animate.Animate);
	};*/

    sound.onFinishLoadFunctions.addControls = function () {
        events.AddControls();
        events.ToggleControls(false);
    };

    function playStuff (scene, loader) {
			sound.dummyFrame = new dummyFrame();
    	sound.assets.states = new states(scene);
      sound.assets.rings = new soundRings(scene);
			animate.updater.addHandler(sound.dummyFrame);
      watch.watch(sound.dummyFrame, "frame", function(prop, action, newValue, oldValue) {
          reactToFrame(oldValue);
      });
    };

    //on unloading
		sound.onUnloadFunctions.unload = function(){
		};

    //private
    function states (scene) {
    	var curState = undefined, temp_mesh = undefined, temp_anim = undefined;
      	var ret = {
	        truck: {
		        start: function () {
		            ret.stop("truck");
		            temp_mesh = sound.assets.truck_mesh.clone();
		            scene.add(temp_mesh);
		            temp_anim = new animate.PositionRotationHandler(temp_mesh, sound.assets.truck_key);
                if (sound.flags.perspective == 'inside') temp_anim.frame = 90;
		            animate.updater.addHandler(temp_anim);
                temp_mesh.visible = true;
                sound.assets.rings.dummy.truck_text();
		        }
						,
		        stop: function () {
		        	animate.updater.removeHandler(temp_anim);
		          scene.remove(temp_mesh);
		        }
	        }
					,
	        plane: {
	          	start: function () {
								var temp_key;
		            ret.stop("plane");
                    temp_mesh = sound.assets.avion_mesh.clone();
                    scene.add(temp_mesh);
		            if (sound.flags.perspective == 'inside') {
                  temp_key = sound.assets.avion_02_key;
                  temp_anim = new animate.PositionRotationHandler(temp_mesh, temp_key);
                  temp_anim.frame = 90;
                  animate.updater.addHandler(temp_anim);
                }
		            else {
		            	temp_key = sound.assets.avion_01_key;
                  temp_anim = new animate.PositionRotationHandler(temp_mesh, temp_key);
                  animate.updater.addHandler(temp_anim);
		            }
                temp_mesh.visible = true;
                sound.assets.rings.dummy.plane_text();
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

    function reactToFrame (frame) {
			  switch (frame) {
            case 50:
                sound.assets.states.truck.start();
                sound.assets.rings.outside.start();
                break;
            case 250:
                sound.assets.states.plane.start();
                break;
            case 420:
                sound.assets.rings.outside.stop();
                break;
            case 500:
                sound.flags.perspective = 'inside';
                sound.assets.states.truck.start();
                sound.assets.rings.inside.start();
                break;
            case 650:
                sound.assets.states.plane.start();
                break;
            case 750:
                sound.buttons.truck.add();
                sound.buttons.plane.add();
                sound.buttons.cardinal.add();
                break;
        }
    }

    function soundRings (scene) {
        var temp_rings = [], ring_scales = [], ring_max_scale, ring_tweens = [], ring_opacity_tweens = [];

        var temp_graph = sound.assets.graphic_bars_mesh.clone();
        var temp_graph_plane = sound.assets.graphic_plane.clone();
        var side_graph = sound.assets.graphic_bars_mesh.clone();
        var side_graph_plane = sound.assets.graphic_plane.clone();
        var temp_text100db = sound.assets.graphic_text100dB.clone();
        var temp_text160db = sound.assets.graphic_text160dB.clone();
        var side_text100db = sound.assets.graphic_text100dB.clone();
        var side_text160db = sound.assets.graphic_text160dB.clone();

        var side_text50db = sound.assets.graphic_text50dB.clone();
        var side_text80db = sound.assets.graphic_text80dB.clone();

        temp_graph.material.materials[0].transparent = true;
        temp_graph.material.materials[0].opacity = 0;
        temp_graph.visible = true;

        side_graph.material.materials[0].transparent = true;
        side_graph.material.materials[0].opacity = 0;
        side_graph.visible = true;

        for (var i = 0; i < temp_graph_plane.material.materials.length; i++ ) {
            temp_graph_plane.material.materials[i].transparent = true;
            temp_graph_plane.material.materials[i].opacity = 0;
        }

        temp_graph_plane.visible = true;
        side_graph_plane.visible = true;

        temp_text100db.material.materials[0].transparent = true;
        temp_text100db.material.materials[0].opacity = 0;
        temp_text100db.visible = true;

        side_text100db.material.materials[0].transparent = true;
        side_text100db.material.materials[0].opacity = 0;

        temp_text160db.material.materials[0].transparent = true;
        temp_text160db.material.materials[0].opacity = 0;
        temp_text160db.visible = true;

        side_text160db.material.materials[0].transparent = true;
        side_text160db.material.materials[0].opacity = 0;

        temp_graph.material.materials[0].morphTargets = true;

        var temp_anim = new animationHandler();
        temp_anim.setMesh(temp_graph);

        side_graph.material.materials[0].morphTargets = true;

        var side_anim = new animationHandler();
        side_anim.setMesh(side_graph);

        side_text50db.material.materials[0].transparent = true;
        side_text50db.material.materials[0].opacity = 0;

        side_text80db.material.materials[0].transparent = true;
        side_text80db.material.materials[0].opacity = 0;

        var graph_opacity_tween_01 = new TWEEN.Tween(temp_graph.material.materials[0]).to({opacity: 1}, 1000);
        var graph_opacity_tween_02 = new TWEEN.Tween(temp_graph_plane.material.materials[0]).to({opacity: 1}, 1000);
        var graph_opacity_tween_03 = new TWEEN.Tween(temp_graph_plane.material.materials[1]).to({opacity: 0.35}, 1000);

        var graph_opacity_tween_01_out = new TWEEN.Tween(temp_graph.material.materials[0]).to({opacity: 0}, 500);
        var graph_opacity_tween_02_out = new TWEEN.Tween(temp_graph_plane.material.materials[0]).to({opacity: 0}, 500);
        var graph_opacity_tween_03_out = new TWEEN.Tween(temp_graph_plane.material.materials[1]).to({opacity: 0}, 500);

        var temp_text100db_tween = new TWEEN.Tween(temp_text100db.material.materials[0]).to({opacity: 1}, 1000);
        var temp_text100db_tween_out = new TWEEN.Tween(temp_text100db.material.materials[0]).to({opacity: 0}, 1000);
        temp_text100db_tween.chain(temp_text100db_tween_out);

        var temp_text160db_tween = new TWEEN.Tween(temp_text160db.material.materials[0]).to({opacity: 1}, 1000);
        var temp_text160db_tween_out = new TWEEN.Tween(temp_text160db.material.materials[0]).to({opacity: 0}, 1000);
        temp_text160db_tween.chain(temp_text160db_tween_out);

        var side_text50db_tween = new TWEEN.Tween(side_text50db.material.materials[0]).to({opacity: 1}, 1000);
        var side_text50db_tween_out = new TWEEN.Tween(side_text50db.material.materials[0]).to({opacity: 0}, 1000);
        side_text50db_tween.chain(side_text50db_tween_out);

        var side_text80db_tween = new TWEEN.Tween(side_text80db.material.materials[0]).to({opacity: 1}, 1000);
        var side_text80db_tween_out = new TWEEN.Tween(side_text80db.material.materials[0]).to({opacity: 0}, 1000);
        side_text80db_tween.chain(side_text80db_tween_out);

        temp_rings[0] = sound.assets.ring_01_mesh.clone();
        temp_rings[1] = sound.assets.ring_02_mesh.clone();
        temp_rings[2] = sound.assets.ring_03_mesh.clone();

        for (var i = 0; i < temp_rings.length; i ++) {
            temp_rings[i].material.materials[0].transparent = true;
            temp_rings[i].material.materials[0].opacity = 0;
            temp_rings[i].visible = true;

            ring_opacity_tweens[i] = new TWEEN.Tween(temp_rings[i].material.materials[0]).to({opacity: 1}, 1000);
            ring_opacity_tweens[i+3] = new TWEEN.Tween(temp_rings[i].material.materials[0]).to({opacity: 0}, 1000);
            ring_opacity_tweens[i].chain(ring_opacity_tweens[i+3]);
            ring_opacity_tweens[i+3].chain(ring_opacity_tweens[i]);
        }

        var ret = {
            dummy: {
                truck_text: function() {
                    if (sound.flags.perspective == 'outside') temp_text100db_tween_out.delay(4000);
                    if (sound.flags.perspective == 'inside') {
                        temp_text100db_tween_out.delay(2000);
                        if (sound.flags.isCardinal) {
                            side_text100db.visible = false;
                            side_text50db.visible = true;
                            side_text50db_tween_out.delay(2000);
                            side_text50db_tween.start();
                        }
                        else {
                            side_text50db.visible = false;
                            side_text100db.visible = true;
                        }
                    }

                    temp_text100db_tween.start();
                },

                plane_text: function() {
                    if (sound.flags.perspective == 'outside') temp_text160db_tween_out.delay(4000);
                    if (sound.flags.perspective == 'inside') {
                        temp_text160db_tween_out.delay(2000);
                        if (sound.flags.isCardinal) {
                            side_text160db.visible = false;
                            side_text80db.visible = true;
                            side_text80db_tween_out.delay(2000);
                            side_text80db_tween.start();

                        }
                        else {
                            side_text80db.visible = false;
                            side_text160db.visible = true;
                        }
                    }

                    temp_text160db_tween.start();
                },
            },

            outside: {
                start: function () {
                    temp_graph.position.y = 92;
                    temp_graph.position.z = -330;

                    temp_graph_plane.position.x = 4;
                    temp_graph_plane.position.y = 110;
                    temp_graph_plane.position.z = -330;

                    temp_text100db.position.x = -1;
                    temp_text100db.position.y = 110;
                    temp_text100db.position.z = -330;

                    temp_text160db.position.x = -2;
                    temp_text160db.position.y = 110;
                    temp_text160db.position.z = -330;

                    graph_opacity_tween_01.start();
                    graph_opacity_tween_02.start();
                    graph_opacity_tween_03.start();

                    scene.add(temp_graph);
                    scene.add(temp_graph_plane);
                    scene.add(temp_text100db);
                    scene.add(temp_text160db);
                    temp_anim.loop(0, 30);

                    ring_scales[0] = new THREE.Vector3(0.8, 0.8, 0.8);
                    ring_scales[1] = new THREE.Vector3(0.6, 0.6, 0.6);
                    ring_scales[2] = new THREE.Vector3(0.5, 0.5, 0.5);
                    ring_max_scale = new THREE.Vector3(1, 1, 1);

                    for (var i = 0; i < temp_rings.length; i ++) {
                        temp_rings[i].position.y = 110;
                        temp_rings[i].position.z = -330;
                        temp_rings[i].scale.copy(ring_scales[i]);

                        ring_tweens[i] = new TWEEN.Tween(temp_rings[i].scale).to(ring_max_scale, 1000);
                        ring_tweens[i+3] = new TWEEN.Tween(temp_rings[i].scale).to(ring_scales[i], 1000);
                        ring_tweens[i].chain(ring_tweens[i+3]);
                        ring_tweens[i+3].chain(ring_tweens[i]);

                        ring_opacity_tweens[i].start();
                        ring_tweens[i].start();
                        scene.add(temp_rings[i]);
                    }
                },

                stop: function () {
                    var ring_tweens_out = [];
                    for (var i = 0; i < temp_rings.length; i ++) {
                        ring_opacity_tweens[i].stop();
                        ring_opacity_tweens[i+3].stop();
                        ring_tweens_out[i] = new TWEEN.Tween(temp_rings[i].material.materials[0]).to({opacity: 0}, 500).start();
                        //must include these somehow in ring_tweens_out[i].onComplete
                        //scene.remove(temp_rings[i]);
                        ring_tweens[i].stop();
                        ring_tweens[i+3].stop();
                    }

                    temp_anim.stop();

                    graph_opacity_tween_01_out.onComplete(function(){
                        scene.remove(temp_graph);
                    }).start();

                    graph_opacity_tween_02_out.onComplete(function(){
                        scene.remove(temp_graph_plane);
                    }).start();

                    graph_opacity_tween_03_out.start();

                }

            },

            inside: {

                start: function () {
                    temp_graph.position.y = 99;
                    temp_graph.position.z = -199;
                    temp_graph.position.x = 6;
                    temp_graph.rotation.y = Math.PI/2;
                    temp_graph.scale.set(0.5, 0.5, 0.5);

                    side_graph.position.y = 99;
                    side_graph.position.z = -180;
                    side_graph.position.x = -100;
                    side_graph.rotation.y = Math.PI/2;
                    side_graph.scale.set(0.5, 0.5, 0.5);

                    temp_graph_plane.position.x = 7;
                    temp_graph_plane.position.y = 109;
                    temp_graph_plane.position.z = -200;
                    temp_graph_plane.rotation.y = Math.PI/2;
                    temp_graph_plane.scale.set(0.5, 0.5, 0.5);

                    side_graph_plane.position.x = -99;
                    side_graph_plane.position.y = 109;
                    side_graph_plane.position.z = -181;
                    side_graph_plane.rotation.y = Math.PI/2;
                    side_graph_plane.scale.set(0.5, 0.5, 0.5);

                    temp_text100db.position.x = 6;
                    temp_text100db.position.y = 110;
                    temp_text100db.position.z = -200;
                    temp_text100db.rotation.y = Math.PI/2;
                    temp_text100db.scale.set(0.5, 0.5, 0.5);

                    side_text100db.position.x = -100;
                    side_text100db.position.y = 110;
                    side_text100db.position.z = -180;
                    side_text100db.rotation.y = Math.PI/2;
                    side_text100db.scale.set(0.5, 0.5, 0.5);

                    temp_text160db.position.x = 6;
                    temp_text160db.position.y = 110;
                    temp_text160db.position.z = -200.5;
                    temp_text160db.rotation.y = Math.PI/2;
                    temp_text160db.scale.set(0.5, 0.5, 0.5);

                    side_text160db.position.x = -100;
                    side_text160db.position.y = 110;
                    side_text160db.position.z = -179.5;
                    side_text160db.rotation.y = Math.PI/2;
                    side_text160db.scale.set(0.5, 0.5, 0.5);

                    side_text80db.position.x = -100;
                    side_text80db.position.y = 93;
                    side_text80db.position.z = -177;
                    side_text80db.rotation.y = Math.PI/2;
                    side_text80db.scale.set(0.5, 0.5, 0.5);

                    side_text50db.position.x = -100;
                    side_text50db.position.y = 93;
                    side_text50db.position.z = -178;
                    side_text50db.rotation.y = Math.PI/2;
                    side_text50db.scale.set(0.5, 0.5, 0.5);

                    graph_opacity_tween_01.start();
                    graph_opacity_tween_02.start();
                    graph_opacity_tween_03.start();

                    scene.add(temp_graph);
                    scene.add(temp_graph_plane);

                    scene.add(side_graph);
                    scene.add(side_graph_plane);
                    scene.add(side_text100db);
                    scene.add(side_text160db);
                    scene.add(side_text50db);
                    scene.add(side_text80db);

                    temp_anim.loop(0, 30);
                    side_anim.loop(0, 30);

                    ring_scales[0] = new THREE.Vector3(0.4, 0.4, 0.4);
                    ring_scales[1] = new THREE.Vector3(0.3, 0.3, 0.3);
                    ring_scales[2] = new THREE.Vector3(0.25, 0.25, 0.25);
                    ring_max_scale = new THREE.Vector3(0.5, 0.5, 0.5);

                    for (var i = 0; i < temp_rings.length; i ++) {
                        temp_rings[i].position.y = 110;
                        temp_rings[i].position.z = -200;
                        temp_rings[i].position.x = 6;
                        temp_rings[i].scale.copy(ring_scales[i]);
                        temp_rings[i].rotation.y = Math.PI/2;

                        ring_tweens[i] = new TWEEN.Tween(temp_rings[i].scale).to(ring_max_scale, 1000);
                        ring_tweens[i+3] = new TWEEN.Tween(temp_rings[i].scale).to(ring_scales[i], 1000);
                        ring_tweens[i].chain(ring_tweens[i+3]);
                        ring_tweens[i+3].chain(ring_tweens[i]);

                        ring_opacity_tweens[i].start();
                        ring_tweens[i].start();
                        scene.add(temp_rings[i]);
                    }
                },

                stop: function () {

                }

            }

        };
        return ret;
    }

    function toggleCardinal () {
        sound.flags.isCardinal = !sound.flags.isCardinal;
        var tween_01_out = new TWEEN.Tween(sound.assets.window_mesh.material.materials[0]).to({opacity: 0}, 500)
        .onComplete(function(){
            if (sound.flags.isCardinal) sound.assets.window_mesh.material.materials[0].color.set(0xffffff);
            else sound.assets.window_mesh.material.materials[0].color.set(0x331a00);
        });
        var tween_01_in = new TWEEN.Tween(sound.assets.window_mesh.material.materials[0]).to({opacity: 1}, 500);
        tween_01_out.chain(tween_01_in);
        tween_01_out.start();
    }

		function tweenText(){
				var textTween = new aeTween(sound.assets.text_mesh.children[0].material );
		    textTween.to( { opacity: 0 }, sound.textFadeFrameTime );
		    textTween.start();

				var textTween2 = new aeTween(sound.assets.text_mesh.children[1].material.uniforms.opacity );
		    textTween2.to( { value: 0 }, sound.textFadeFrameTime );
		    textTween2.start();
		}

	return sound;
}
});
