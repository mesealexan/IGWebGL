define(["animationHandler", "snowHandler", "watch", "animate"],
    function(animationHandler, snowHandler, watch, animate){
    var i89 = {};
    i89.folderName = "i89";
    i89.onStartFunctions = {};//called on scene start by loader
    i89.onLoadFunctions = {};//called on load complete, MUST be same name as asset
    i89.onFinishLoadFunctions = {};
    i89.animationHandlers = {};
    i89.snowHandlers = {};
    i89.assets = {};

    i89.assetNames = ['floor', 'walls', 'snow', 'bck', 'grid', 'heat_source',
        'text', 'winterNight', 'winterNight', 'moon', 'logo', 'frame', 'i89',
        'window_plane', 'heat_wave', 'heat_wave_refract', 'heat_wave_reflect'];

    /***on start functions***/
    i89.onStartFunctions.addSnow = function(scene){
        var sh1 = new snowHandler({posX: 0, posY: -200, width: 400, depth: 400, num: 500});
        var sh2 = new snowHandler({posX: 190, posY: 250, width: 100, depth: 500, num: 400});
        var sh3 = new snowHandler({posX: 0, posY: 600, width: 400, depth: 400, num: 500});
        sh1.start(scene);
        sh2.start(scene);
        sh3.start(scene);
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
    /***end on finish functions***/

    function reactToFrame(frame){
        switch (frame){
            case 0:
                //coldnightIntro.play();
                animate.updater.stopAllSnow();
                break;
            case 10:
                switchWindow.i89_off();
                break;
            case 220:
                //coldnightIntro.fade(1.0, 0.0, 3000);
                break;
            case 287:
                //heaterLoop.play();
                //heaterLoop.fade(0.0, 1.0, 1000);
                heatWaves.playWave1();
                break;
            case 320:
                //heaterLoop.fade(1.0, 0.6, 2000);
                break;
            case 404:
                heatWaves.loopWave1();
                heatWaves.playWave2();
                break;
            case 521:
                //ch.pause();
                //toggleInput(true);
                heatWaves.loopWave2();
                break;
            case 638:
                //heaterLoop.fade(0.6, 1.0, 2000);
                switchWindow.i89_on();
                i89.assets.logo.visible = true;
                heatWaves.playWave3();
                break;
            case 670:
                //cameraZoom.play();
                break;
            case 755:
                heatWaves.loopWave3();
                break;
            case 830:
                //cameraZoom.play();
                break;
            case 868:
                //heaterLoop.fade(1.0, 0.0, 5000);
                //$('#cameraButtons').toggle();
                //toggleInput(true);
                break;
        }
    }
    var switchWindow = function () {
        var fadeTime = 300, fading = false, off = true, on = false;
        return{
            toggleON: function(){
                this.i89_on();
                //windowToggleS.play();
            },
            toggleOFF: function(){
                this.i89_off();
                //windowToggleS.play();
            },
            i89_on: function  () {
                if(fading || on) return;
                fading = true;
                on = true;
                off = false;
                fade.out(i89.assets.heat_wave_refract, fadeTime);
                fade.in(i89.assets.heat_wave_reflect, fadeTime);
                fade.in(i89.assets.heat_wave_reflect2, fadeTime);
                fade.in(i89.assets.heat_wave_reflect3, fadeTime);
                fade.in(i89.assets.window_plane, fadeTime);

                fade.out(i89.assets.i89, fadeTime - (fadeTime * 0.1));
                setTimeout(function(){
                    fade.in(i89.assets.logo, fadeTime);
                    fade.in(i89.assets.i89, fadeTime)
                }, fadeTime);
                setTimeout(function(){ fading = false;}, fadeTime * 2);
            }
            ,
            i89_off: function () {
                if(fading || off) return;
                fading = true;
                off = true;
                on = false;
                fade.in(i89.assets.heat_wave_refract, fadeTime);
                fade.out(i89.assets.heat_wave_reflect, fadeTime);
                fade.out(i89.assets.heat_wave_reflect2, fadeTime);
                fade.out(i89.assets.heat_wave_reflect3, fadeTime);
                fade.out(i89.assets.window_plane, fadeTime);
                fade.out(i89.assets.logo, fadeTime);
                fade.out(i89.assets.i89, fadeTime - (fadeTime * 0.1));
                setTimeout(function(){ fade.in(i89.assets.i89, fadeTime) }, fadeTime);
                setTimeout(function(){ fading = false }, fadeTime * 2);
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
        function tweenOpacity(obj, val, time){
            //console.log(obj)
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

                fade.start();
            }
        }
        return{
            out: function(obj, time){ tweenOpacity(obj, 0, time); }
            ,
            in: function(obj, time){ tweenOpacity(obj, 1, time); }
        }
    }();

    GlobalFunctions.i89 = {
        switchWindow: switchWindow
    };

    return i89;
});