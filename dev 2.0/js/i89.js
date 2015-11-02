define(["animationHandler", "snowHandler", "watch", "animate", "events", "audio"],
    function(animationHandler, snowHandler, watch, animate, events, audio){
    var i89 = {};
    i89.folderName = "i89";
    i89.assetNames = ['floor', 'walls', 'snow', 'bck', 'grid', 'heat_source',
        'text', 'winterNight', 'winterNight', 'moon', 'logo', 'frame', 'window_plane',
        'heat_wave', 'heat_wave_refract', 'heat_wave_reflect', 'i89'];

    i89.soundNames = ["i89-coldnight-intro", "i89-heater-loop", "i89-camera-zoom", "i89-toggle-glasstype"];

    i89.onStartFunctions = {};
    i89.onLoadFunctions = {};
    i89.onFinishLoadFunctions = {};
    i89.animationHandlers = {};
    i89.snowHandlers = {};
    i89.assets = {};

    /***on start functions***/
    i89.onStartFunctions.addSnow = function(scene){
        var sh1 = new snowHandler({posX: 0, posY: -200, width: 400, depth: 400, num: 300});
        var sh2 = new snowHandler({posX: 190, posY: 250, width: 100, depth: 500, num: 200});
        var sh3 = new snowHandler({posX: 0, posY: 600, width: 400, depth: 400, num: 300});
        sh1.start(scene);
        sh2.start(scene);
        sh3.start(scene);
        animate.updater.stopAllSnow();//stop snow as soon as it spawns
    };

    i89.onStartFunctions.addLights = function(scene){
        scene.add(new THREE.AmbientLight(0xffffff));
        var spotLight = new THREE.SpotLight(0xb99bfd);
        spotLight.position.set(980, 1049, -656);
        spotLight.target.position.set(34, 0, 85);
        scene.add( spotLight );
    };
    /***end on start functions***/

    /***on load functions***/
    i89.onLoadFunctions.i89 = function(mesh){
        i89.assets.i89 = mesh;
        switchWindow.i89_off();
    };

    i89.onLoadFunctions.logo = function(mesh){
        mesh.visible = false;
        i89.assets.logo = mesh;
    };

    i89.onLoadFunctions.bck = function(mesh){
        var bck2 = mesh.clone();
        bck2.material.side = THREE.DoubleSide;
        bck2.scale.z = -1;
        bck2.quaternion.set ( 0, 1, 0, 0);
        mesh.add(bck2);
    };

    i89.onLoadFunctions.heat_wave = function(mesh){
        var heat_wave2 = mesh.clone();
        var heat_wave3 = mesh.clone();
        mesh.visible = false;
        mesh.frustumCulled =
            heat_wave2.frustumCulled =
                heat_wave3.frustumCulled = false;
        mesh.position.x += 4;
        heat_wave2.position.x += 26;
        heat_wave3.position.x += 46;
        mesh.add(heat_wave2);
        mesh.add(heat_wave3);
        i89.animationHandlers.ah1 = new animationHandler();
        i89.animationHandlers.ah1.setMesh([mesh, heat_wave2, heat_wave3]);
        i89.assets.heat_wave = mesh;

    };

    i89.onLoadFunctions.heat_wave_refract = function(mesh){
        mesh.visible = false;
        mesh.position.x += 4;
        i89.animationHandlers.ah2 = new animationHandler();
        i89.animationHandlers.ah2.setMesh(mesh);
        i89.assets.heat_wave_refract = mesh;
    };

    i89.onLoadFunctions.heat_wave_reflect = function(mesh){
        var heat_wave_reflect2 = mesh.clone();
        var heat_wave_reflect3 = mesh.clone();
        mesh.visible = false;
        mesh.position.x += 4;
        mesh.add(heat_wave_reflect2);
        mesh.add(heat_wave_reflect3);
        heat_wave_reflect2.position.x += 26;
        heat_wave_reflect3.position.x += 46;
        i89.animationHandlers.ah3 = new animationHandler();
        i89.animationHandlers.ah3.setMesh([mesh, heat_wave_reflect2, heat_wave_reflect3]);
        i89.assets.heat_wave_reflect = mesh;
        i89.assets.heat_wave_reflect2 = heat_wave_reflect2;
        i89.assets.heat_wave_reflect3 = heat_wave_reflect3;

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
                events.AddButton({text:"i89 off", function: switchWindow.toggleOFF, id:"i89_off"});
            },
            remove: function(){ events.RemoveElementByID("i89_off"); }
        },
        i89_on: {
            add: function(){
                events.AddButton({text:"i89 on", function: switchWindow.toggleON, id:"i89_on"});
            },
            remove: function(){ events.RemoveElementByID("i89_on"); }
        },
        outside:{
            add: function(){
                events.AddButton({text:"outside",
                    function: function(){tweenCamera("outside")},
                    id:"outside"});
            },
            remove: function(){ events.RemoveElementByID("outside"); }
        },
        inside:{
            add: function(){
                events.AddButton({text:"inside",
                    function: function(){tweenCamera("inside")},
                    id:"inside"});
            },
            remove: function(){ events.RemoveElementByID("inside"); }
        },
        inClose:{
            add: function(){
                events.AddButton({text:"inClose",
                    function: function(){tweenCamera("inClose")},
                    id:"inClose"});
            },
            remove: function(){ events.RemoveElementByID("inClose"); }
        }
    };

    function tweenCamera(pos){
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
                animate.camera.outside = true;
                events.ToggleControls(false);
                //$("#insideClose").toggle();
                tween.to( { x: [facingWallPos.x, outsidePos.x],
                    y: [facingWallPos.y, outsidePos.y],
                    z: [facingWallPos.z, outsidePos.z]}, tweenTime );
                tween.onComplete(function(){
                    animate.camera.outside = true;
                    animate.camera.inside = false;
                    animate.camera.inClose = false;
                });
                tween.onUpdate( function () {animate.camera.lookAt(windowPos); });
                break;
            case "inside":
                if(animate.camera.inside) return;
                animate.camera.inside = true;
                if(animate.camera.position.floor().equals(insidePos)) return;
                tween.to( { x: [facingWallPos.x, insidePos.x],
                    y: [facingWallPos.y, insidePos.y],
                    z: [facingWallPos.z, insidePos.z]}, tweenTime );
                tween.onComplete(function(){
                    //$("#insideClose").toggle();
                    //animate.camera.inside = true;
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
                //$("#backOut").toggle();
                tween.to( { x: insidePos.x,
                    y: insidePos.y,
                    z: insidePos.z}, tweenTime );
                tween.onUpdate( function() {camera.lookAt(windowPos) });
                tween.onComplete(function(){
                    //$("#insideClose").toggle();
                    //$("#outside").toggle();
                    //$("#inside").toggle();
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
            case 220:
                audio.sounds.i89coldnightintro.fade(1.0, 0.0, 3000);
                break;
            case 287:
                audio.sounds.i89heaterloop.play();
                audio.sounds.i89heaterloop.fade(0.0, 1.0, 1000);
                heatWaves.playWave1();
                break;
            case 320:
                audio.sounds.i89heaterloop.fade(1.0, 0.6, 2000);
                break;
            case 404:
                heatWaves.loopWave1();
                heatWaves.playWave2();
                break;
            case 521:
                heatWaves.loopWave2();
                break;
            case 638:
                audio.sounds.i89heaterloop.fade(0.6, 1.0, 2000);
                switchWindow.i89_on();
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
                //i89.buttons.inClose.add();
                audio.sounds.i89heaterloop.fade(1.0, 0.0, 5000);
                //$('#cameraButtons').toggle();
                //toggleInput(true);
                break;
        }
    }

    var switchWindow = function () {
        var fadeTime = 300, fading = false, off = true, on = false;
        return{
            toggleON: function(){
                if(fading || on) return;
                i89.buttons.i89_off.add();
                i89.buttons.i89_on.remove();
                switchWindow.i89_on();
                audio.sounds.i89toggleglasstype.play();
            },
            toggleOFF: function(){
                if(fading || off) return;
                i89.buttons.i89_on.add();
                i89.buttons.i89_off.remove();
                switchWindow.i89_off();
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
                i89.assets.heat_wave_refract.visible = true;
                i89.animationHandlers.ah2.play(0, 115);
            }
            ,
            loopWave2: function(){
                i89.animationHandlers.ah2.loop(115, 195)
            }
            ,
            playWave3: function(){
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
});
