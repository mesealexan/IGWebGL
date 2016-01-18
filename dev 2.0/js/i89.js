define(["scene", "animationHandler", "snowHandler", "watch", "animate", "events", "audio", "callback", "composers", "text"],
function(scene, animationHandler, snowHandler, watch, animate, events, audio, callback, composers, text){
var i89Scene = {
  scene: {}
  ,
  callbacks: {
    heaterStart: {
      sampleCall1: function(){ console.log("started heater waves"); }
    },
    heaterDone: {
      sampleCall2: function(){ console.log("heater waves played once, will now loop."); }
    },
    refractWaveStart: {
      sampleCall3: function(){ console.log("started refract wave"); }
    },
    refractWaveDone: {
      sampleCall4: function(){ console.log("refract wave played once, will now loop."); }
    },
    reflectWaveStart: {
      sampleCall5: function(){ console.log("started reflect waves"); }
    },
    reflectWaveDone: {
      sampleCall6: function(){ console.log("reflect waves played once, will now loop."); }
    },
    i89off: {
      sampleCall7: function(){ console.log("i89 off"); }
    },
    i89on: {
      sampleCall8: function(){ console.log("i89 on"); }
    },
    goOutsideStart: {
      sampleCall9: function(){ console.log("started going outside"); }
    },
    goOutsideDone: {
      sampleCall10: function(){ console.log("finished going outside"); }
    },
    goInsideStart: {
      sampleCall10: function(){ console.log("started going inside"); }
    },
    goInsideDone: {
      sampleCall11: function(){ console.log("finished going inside"); }
    },
    introAnimDone: {
      sampleCall12: function(){ console.log("finished intro animation"); }
    }
  }
  ,
  constructor: function(){
    var i89 = new scene();
    i89.folderName = "i89";
    i89.addAssets(['house', 'snow', 'bck', 'grid', 'heat_source',
        'inside_text', /*'outside_text',*/ 'moon', 'logo', 'frame', 'window_plane',
        'heat_wave', 'heat_wave_refract', 'heat_wave_reflect', 'i89']);
    i89.addSounds(["i89-coldnight-intro", "i89-heater-loop", "i89-camera-zoom", "i89-toggle-glasstype"]);

    /***on start functions***/
    i89.onStartFunctions.storeScene = function (scene, loader) {
      i89.assets.scene = scene;
      i89.assets.loader = loader;
    };

    i89.onStartFunctions.addSnow = function(scene){
        var sh1 = new snowHandler({posX: 0, posY: -200, width: 400, depth: 400, num: 250});
        var sh2 = new snowHandler({posX: 200, posY: 250, width: 100, depth: 500, num: 150});
        var sh3 = new snowHandler({posX: 0, posY: 600, width: 400, depth: 400, num: 250});
        sh1.start(scene);
        sh2.start(scene);
        sh3.start(scene);
        //animate.updater.stopAllSnow();//stop snow as soon as it spawns
    };

    i89.onStartFunctions.addLights = function(scene){
        //scene.add(new THREE.AmbientLight(0xb090c2));
        scene.add(new THREE.AmbientLight(0xcccccc));
        var spotLight = new THREE.SpotLight(0xb99bfd);
        spotLight.position.set(980, 1049, -656);
        spotLight.target.position.set(34, 0, 85);
        scene.add( spotLight );
    };

   i89.onStartFunctions.makeText = function(scene){
      var string = "Frigid outside";
      var settings = {
        size: 20,
        curveSegments: 4,
        height: 0.1,
        bevelEnabled: false,
        style: "normal",
        weight: "normal",
        font: "bank gothic"
        //font: "helvetiker"
      };

      var geom = text.Make(string, settings);
      geom.computeBoundingBox();
      geom.computeVertexNormals();

      var centerOffset = -0.5 * ( geom.boundingBox.max.x - geom.boundingBox.min.x );
      var mat = new THREE.MeshBasicMaterial({transparent: true});

      i89.assets.outsideText = new THREE.Mesh(geom, mat);
      i89.assets.outsideText.rotateY(-Math.PI / 2);
      i89.assets.outsideText.position.set(-679, 614, 135);
      scene.add(i89.assets.outsideText);
    };
    /***end on start functions***/

    /***on load functions***/
    i89.onLoadFunctions.outside_text= function(mesh, loader){
      mesh.material = new THREE.MeshBasicMaterial({color: 0xffffff});
    };

    i89.onLoadFunctions.i89 = function(mesh){
        i89.assets.i89 = mesh;
        i89.switchWindow.i89_off();
    };

    i89.onLoadFunctions.logo = function(mesh){
        mesh.visible = false;
        i89.assets.logo = mesh;
    };

    i89.onLoadFunctions.bck = function(mesh){
        mesh.material = mesh.material.materials[0];
        mesh.material.side = THREE.DoubleSide;
        var bck2 = new THREE.Mesh(mesh.geometry.clone(), mesh.material.clone());
        //var clone = mesh.material.map.clone();
        //clone.needsUpdate = true;
        //console.log(mesh.material.map)
        //console.log(clone)
        //bck2.material.map = clone;
        /*bck2.material.map.wrapS = THREE.RepeatWrapping;
        bck2.material.map.repeat.x = -1;
        bck2.material.map.needsUpdate = true;
        bck2.quaternion.set ( 0, 1, 0, 0);
        i89.assets.scene.add(bck2);*/
        //bck2.material.map.repeat.x = -1;
        bck2.quaternion.set ( 0, 1, 0, 0);
        i89.assets.scene.add(bck2);
    };

    i89.onLoadFunctions.heat_wave = function(mesh){
        var heat_wave2 = mesh.clone();
        var heat_wave3 = mesh.clone();
        mesh.visible = false;
        mesh.frustumCulled =
            heat_wave2.frustumCulled =
                heat_wave3.frustumCulled = false;
        mesh.position.x += 4;
        heat_wave2.position.x += 24;
        heat_wave3.position.x += 44;
        mesh.add(heat_wave2);
        mesh.add(heat_wave3);
        i89.animationHandlers.ah1 = new animationHandler();
        i89.animationHandlers.ah1.setMesh([mesh, heat_wave2, heat_wave3]);
        i89.assets.heat_wave = mesh;

        i89.animationHandlers.ah1.onComplete = function(){
          callback.go(i89Scene.callbacks.heaterDone);
          i89.animationHandlers.ah1.onComplete = undefined;
        };
    };

    i89.onLoadFunctions.heat_wave_refract = function(mesh){
        mesh.visible = false;
        mesh.position.x += 4;
        i89.animationHandlers.ah2 = new animationHandler();
        i89.animationHandlers.ah2.setMesh(mesh);
        i89.assets.heat_wave_refract = mesh;

        i89.animationHandlers.ah2.onComplete = function(){
          callback.go(i89Scene.callbacks.refractWaveDone);
          i89.animationHandlers.ah2.onComplete = undefined;
        };
    };

    i89.onLoadFunctions.heat_wave_reflect = function(mesh){
        var heat_wave_reflect2 = mesh.clone();
        var heat_wave_reflect3 = mesh.clone();
        mesh.visible = false;
        mesh.position.x += 4;
        mesh.add(heat_wave_reflect2);
        mesh.add(heat_wave_reflect3);
        heat_wave_reflect2.position.x += 24;
        heat_wave_reflect3.position.x += 44;
        i89.animationHandlers.ah3 = new animationHandler();
        i89.animationHandlers.ah3.setMesh([mesh, heat_wave_reflect2, heat_wave_reflect3]);
        i89.assets.heat_wave_reflect = mesh;
        i89.assets.heat_wave_reflect2 = heat_wave_reflect2;
        i89.assets.heat_wave_reflect3 = heat_wave_reflect3;

        i89.animationHandlers.ah3.onComplete = function(){
          callback.go(i89Scene.callbacks.reflectWaveDone);
          i89.animationHandlers.ah3.onComplete = undefined;
        };

    };

    i89.onLoadFunctions.window_plane = function(mesh){
        mesh.visible = false;
        mesh.scale.set(1.5, 1.5, 1);
        mesh.position.set(0, -35, 0);
        i89.assets.window_plane = mesh;
        heatWaves.scaleWindowPlane();
    };
    /***on end load functions***/

    /***on finish functions***/
    i89.onFinishLoadFunctions.applyComposer = function(scene){
      i89.assets.composer = new composers.Bloom_AdditiveColor({
        str: 0.6,
        bok: {
          foc: 1,
          ape: 0.08
        }
      });
      animate.SetCustomRenderFunction( function(){ i89.assets.composer.render(); } );
      events.addDOF_GUI(i89);
    };

    i89.onFinishLoadFunctions.playCamera = function(scene, loader) {
       loader.cameraHandler.play(undefined,undefined,undefined,//from, to and onComplete undefined
         animate.Animate);
    };

    i89.onFinishLoadFunctions.addWatch = function(scene, loader){
        watch.watch(loader.cameraHandler, "frame", function(prop, action, newValue, oldValue) {
            reactToFrame(oldValue);
        });
    };

    i89.onFinishLoadFunctions.addControls = function(){
        var c = {
            noZoom: true,
            noPan: true,
            maxPolarAngle: Math.PI / 2,
            minPolarAngle: 1,
            rotateSpeed: 0.5,
            minAzimuthAngle: -1.6,
            maxAzimuthAngle: -0.9
        };

        events.AddControls(c);
        events.ToggleControls(false);
    };

    i89.onFinishLoadFunctions.playSound = function(){
        audio.sounds.i89coldnightintro.play();
    };
    /***end on finish functions***/

    i89.buttons = {
        i89_off: {
            add: function(){
                events.AddButton({text:"i89 off", function: i89.switchWindow.toggleOFF, id:"i89_off"});
            },
            remove: function(){ events.RemoveElementByID("i89_off"); }
        },
        i89_on: {
            add: function(){
                events.AddButton({text:"i89 on", function: i89.switchWindow.toggleON, id:"i89_on"});
            },
            remove: function(){ events.RemoveElementByID("i89_on"); }
        },
        outside:{
            add: function(){
                events.AddButton({text:"outside",
                    function: function(){i89.tweenCamera("outside")},
                    id:"outside"});
            },
            remove: function(){ events.RemoveElementByID("outside"); }
        },
        inside:{
            add: function(){
                events.AddButton({text:"inside",
                    function: function(){i89.tweenCamera("inside")},
                    id:"inside"});
            },
            remove: function(){ events.RemoveElementByID("inside"); }
        },
        inClose:{
            add: function(){
                events.AddButton({text:"inClose",
                    function: function(){i89.tweenCamera("inClose")},
                    id:"inClose"});
            },
            remove: function(){ events.RemoveElementByID("inClose"); }
        }
    };

    i89.tweenCamera = function(pos){
        //cancelAllTweens();
        var outsidePos = new THREE.Vector3(-118, 111, -372),
            inCloseLookAtPos = new THREE.Vector3( 14, 80, 0),
            windowPos = new THREE.Vector3( 24, 38, 137),
            facingWallPos = new THREE.Vector3( -300, 100 ,0),
            insidePos = new THREE.Vector3(-424.235, 111.635, 326.101),
            inClosePos = new THREE.Vector3( -172.235, 111.635, 102.101);
        var tween = new TWEEN.Tween( animate.camera.position );
        var tweenTime = 2000;
        var lookAtTween = undefined;
        switch(pos){
            case "outside":
                if(animate.camera.outside || animate.camera.inClose) return;
                callback.go(i89Scene.callbacks.goOutsideStart);
                animate.camera.outside = true;
                events.ToggleControls(false);
                tween.to( { x: [facingWallPos.x, outsidePos.x],
                    y: [facingWallPos.y, outsidePos.y],
                    z: [facingWallPos.z, outsidePos.z]}, tweenTime );
                tween.onComplete(function(){
                    callback.go(i89Scene.callbacks.goOutsideDone);
                    animate.camera.outside = true;
                    animate.camera.inside = false;
                    animate.camera.inClose = false;
                });
                tween.onUpdate( function () {animate.camera.lookAt(windowPos); });
                break;
            case "inside":
                if(animate.camera.inside) return;
                callback.go(i89Scene.callbacks.goInsideStart);
                animate.camera.inside = true;
                if(animate.camera.position.floor().equals(insidePos)) return;
                tween.to( { x: [facingWallPos.x, insidePos.x],
                    y: [facingWallPos.y, insidePos.y],
                    z: [facingWallPos.z, insidePos.z]}, tweenTime );
                tween.onComplete(function(){
                    callback.go(i89Scene.callbacks.goInsideDone);
                    animate.camera.outside = false;
                    animate.camera.inClose = false;
                    events.ToggleControls(true);
                });
                tween.onUpdate( function () {animate.camera.lookAt(windowPos); });

                lookAtTween = new TWEEN.Tween( events.Controls.target );
                lookAtTween.to( {
                    x: windowPos.x,
                    y: windowPos.y,
                    z: windowPos.z}, tweenTime );
                lookAtTween.onUpdate( function() {
                    animate.camera.lookAt(events.Controls.target);
                });
                lookAtTween.start();
                break;
            case "inClose":
                if(animate.camera.inClose) return;
                animate.camera.inClose = true;
                events.ToggleControls(false);
                tween.to({
                    x: inClosePos.x,
                    y: inClosePos.y,
                    z: inClosePos.z}, tweenTime );
                tween.onComplete(function(){
                    animate.camera.inside = false;
                    animate.camera.outside = false;
                });

                lookAtTween = new TWEEN.Tween( events.Controls.target );
                lookAtTween.to( {
                    x: inCloseLookAtPos.x,
                    y: inCloseLookAtPos.y,
                    z: inCloseLookAtPos.z}, tweenTime );
                lookAtTween.onUpdate( function() {
                    animate.camera.lookAt(events.Controls.target);
                });
                lookAtTween.start();
                break;
            case "backOut":
                tween.to( { x: insidePos.x,
                    y: insidePos.y,
                    z: insidePos.z}, tweenTime );
                tween.onUpdate( function() {camera.lookAt(windowPos) });
                tween.onComplete(function(){
                    camera.inside = true;
                    camera.outside = false;
                    camera.inClose = false;
                });
                break;
        }
        tween.interpolation( TWEEN.Interpolation.CatmullRom );
        tween.start();
    }

    function reactToFrame(frame){
        switch (frame){
            case 1:
              audio.sounds.i89coldnightintro.setVolume(100);
            break;
            case 220:
                //audio.sounds.i89coldnightintro.fade(1.0, 0.0, 3000);
                audio.sounds.i89coldnightintro.fadeTo(0, 3000);
                break;
            case 287:
                audio.sounds.i89heaterloop.setVolume(0);
                audio.sounds.i89heaterloop.play();
                //audio.sounds.i89heaterloop.fade(0.0, 1.0, 1000);
                audio.sounds.i89heaterloop.fadeTo(100, 1000);
                heatWaves.playWave1();
                break;
            case 320:
                //audio.sounds.i89heaterloop.fade(1.0, 0.6, 2000);
                audio.sounds.i89heaterloop.fadeTo(60, 2000);
                break;
            case 404:
                heatWaves.loopWave1();
                heatWaves.playWave2();
                //i89.assets.loader.cameraHandler.setSpeed(2);
                break;
            case 521:
                heatWaves.loopWave2();
                break;
            case 638:
                //audio.sounds.i89heaterloop.fade(0.6, 1.0, 2000);
                audio.sounds.i89heaterloop.fadeTo(100, 2000);
                i89.switchWindow.i89_on();
                i89.assets.logo.visible = true;
                heatWaves.playWave3();
                audio.sounds.i89toggleglasstype.play();
                break;
            case 650:
                audio.sounds.i89camerazoom.play();
                break;
            case 755:
                heatWaves.loopWave3();
                break;
            case 820:
                audio.sounds.i89camerazoom.play();
                break;
            case 868:
                events.ToggleControls(true);
                animate.camera.inside = true;
                i89.buttons.i89_off.add();
                i89.buttons.outside.add();
                i89.buttons.inside.add();
                //audio.sounds.i89heaterloop.fade(1.0, 0.0, 5000);
                audio.sounds.i89heaterloop.fadeTo(0, 5000);
                callback.go(i89Scene.callbacks.introAnimDone);
                break;
        }
    }

    i89.switchWindow = function () {
        var fadeTime = 300, fading = false, off = true, on = false;
        return{
            toggleON: function(){
                if(fading || on) return;
                callback.go(i89Scene.callbacks.i89on);
                i89.buttons.i89_off.add();
                i89.buttons.i89_on.remove();
                i89.switchWindow.i89_on();
                audio.sounds.i89toggleglasstype.stop();
                audio.sounds.i89toggleglasstype.play();
            },
            toggleOFF: function(){
                if(fading || off) return;
                callback.go(i89Scene.callbacks.i89off);
                i89.buttons.i89_on.add();
                i89.buttons.i89_off.remove();
                i89.switchWindow.i89_off();
                audio.sounds.i89toggleglasstype.stop();
                audio.sounds.i89toggleglasstype.play();
            },
            i89_on: function  () {
                if(fading || on) return;
                fading = true; on = true; off = false;
                fade.out(i89.assets.heat_wave_refract, fadeTime);
                fade.in(i89.assets.heat_wave_reflect, fadeTime);
                fade.in(i89.assets.heat_wave_reflect2, fadeTime);
                fade.in(i89.assets.heat_wave_reflect3, fadeTime);
                fade.in(i89.assets.window_plane, fadeTime);
                fade.out(i89.assets.i89, fadeTime,
                function(){//on complete
                    fade.in(i89.assets.logo, fadeTime);
                    fade.in(i89.assets.i89, fadeTime,
                        function(){fading = false;});//on complete
                });
            }
            ,
            i89_off: function () {
                if(fading || off) return;
                fading = true; off = true; on = false;
                fade.in(i89.assets.heat_wave_refract, fadeTime);
                fade.out(i89.assets.heat_wave_reflect, fadeTime);
                fade.out(i89.assets.heat_wave_reflect2, fadeTime);
                fade.out(i89.assets.heat_wave_reflect3, fadeTime);
                fade.out(i89.assets.window_plane, fadeTime);
                fade.out(i89.assets.logo, fadeTime);
                fade.out(i89.assets.i89, fadeTime,
                    function(){//on complete
                        fade.in(i89.assets.i89, fadeTime,
                            function(){fading = false;})//on complete
                    });
            }
        }
    }();

    var heatWaves = function(){
        return{
            playWave1: function(){
                callback.go(i89Scene.callbacks.heaterStart);
                i89.assets.window_plane.visible = true;
                i89.assets.heat_wave.visible = true;
                i89.animationHandlers.ah1.play(0, 115);
            }
            ,
            loopWave1: function(){
                i89.animationHandlers.ah1.loop(115, 195);
            }
            ,
            playWave2: function(){
                callback.go(i89Scene.callbacks.refractWaveStart);
                i89.assets.heat_wave_refract.visible = true;
                i89.animationHandlers.ah2.play(0, 115);
            }
            ,
            loopWave2: function(){
                i89.animationHandlers.ah2.loop(115, 195);
            }
            ,
            playWave3: function(){
                callback.go(i89Scene.callbacks.reflectWaveStart);
                i89.assets.heat_wave_reflect.visible = true;
                i89.animationHandlers.ah3.play(0, 115);
            }
            ,
            loopWave3: function(){
                i89.animationHandlers.ah3.loop(115, 195);
            }
            ,
            scaleWindowPlane: function(){
                var time = 1000, maxScale = 1.95;
                var scaleUp = new TWEEN.Tween( i89.assets.window_plane.scale );
                scaleUp.to( { x: maxScale, y: maxScale, z: 1 }, time );
                scaleUp.repeat(Infinity);
                scaleUp.yoyo(true);
                scaleUp.start();

                var posTween = new TWEEN.Tween( i89.assets.window_plane.position );
                posTween.to( { y: -69 }, time );
                posTween.repeat(Infinity);
                posTween.yoyo(true);
                posTween.start();
            }
        }
    }();

    var fade = function(obj, time){
        if(time == undefined) time = 1000;
        function tweenOpacity(obj, val, time, onComp){
            for (var i = 0; i < obj.material.materials.length; i++){
                var mat = obj.material.materials[i];
                var fade = new TWEEN.Tween( mat );

                if(val == 0){
                    mat.maxOpacity = mat.opacity;
                    mat.transparent = true;
                    fade.onComplete(function () {obj.visible = false});
                    fade.to( { opacity: val }, time );
                }
                else {
                    obj.visible = true;
                    fade.to( { opacity: mat.maxOpacity }, time );
                }
                if(onComp)fade.onComplete(function(){onComp();});
                fade.start();
            }
        }
        return{
            out: function(obj, time, onComp){ tweenOpacity(obj, 0, time, onComp); }
            ,
            in: function(obj, time, onComp){ tweenOpacity(obj, 1, time, onComp); }
        }
    }();
    return i89;
  }
};
return i89Scene;
});
