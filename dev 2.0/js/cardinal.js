define(["three", "watch", "events", "tween", "underscore", "animate", "audio"],
    function(three, watch, events, tween, underscore, animate, audio){
    var cardinal = {
      folderName: "cardinal",
      onStartFunctions: {},
      onLoadFunctions: {},
      onFinishLoadFunctions: {},
      animationHandlers: {},
      snowHandlers: {},
      assets: {},
      soundNames: ['ig-space-intro', 'ig-whoosh']
    };

    var fadeOutTime = 700;
    var cameraAnimations = {
        animation_1:{ from: 0, to: 158},
        animation_2:{ from: 158, to: 190},
        animation_3:{ frame: 191, speed: 0.05},
        animation_4:{ frame: 192, speed: 0.05},
        animation_5:{ frame: 193, speed: 0.05},
        animation_6:{ frame: 194, speed: 0.05}
    };

    cardinal.assetNames = ['cardinal_horizontal', 'cardinal_vertical', 'cardinal_slice'];

    /***on start functions***/
    cardinal.onStartFunctions.addLights = function(scene){
        scene.add( new THREE.AmbientLight( 0x666666 ) );
        scene.fog = new THREE.Fog(0x13161d, 3000, 6000);

        var light1 = new THREE.PointLight( 0xffffff, 1, 10000 );
        light1.position.set( -2929, 2686, 938 );
        scene.add( light1 );

        var light2 = new THREE.PointLight( 0xffffff, 1, 10000 );
        light2.position.set( 345,3562,-4050 );
        scene.add( light2 );

        var light3 = new THREE.PointLight( 0xffffff, 1, 10000 );
        light3.position.set( 3615,2688,843 );
        scene.add( light3 );
    };

    cardinal.onStartFunctions.addWhitePlane = function (scene) {
        /*var side = 10000;
        var geometry = new THREE.PlaneBufferGeometry( side, side );
        var material = new THREE.MeshLambertMaterial( {color: 0xffffff, ambient: 0xffffff,
            specular: 0xffffff, emissive: 0x333333, side: THREE.FrontSide} );
        var plane = new THREE.Mesh( geometry, material );
        plane.rotation.x -= Math.PI / 2;
        plane.position.set(0, -100, 0);
        plane.frustumCulled = false;
        scene.add( plane );*/
        var radius = 10000;
        var geometry = new THREE.CylinderGeometry( radius, radius, 1, 32 );
        var material = new THREE.MeshLambertMaterial( {color: 0xffffff, ambient: 0xffffff,
            specular: 0xffffff, emissive: 0x333333, side: THREE.FrontSide} );
        var cylinder = new THREE.Mesh( geometry, material );
        cylinder.position.set(0, -100, 0);
        scene.add( cylinder );
    };

    cardinal.onStartFunctions.addLensFlare = function(scene) {
        var textureFlare1 = THREE.ImageUtils.loadTexture( cardinal.mediaFolderUrl+
          "/models/cardinal/Flare_1.png");
        var textureFlare2 = THREE.ImageUtils.loadTexture( cardinal.mediaFolderUrl+
          "/models/cardinal/Flare_2.png");
        var flareColor = new THREE.Color( 0xffffff );
        var smallCircles = 10;
        var smallCircleMinSize = 1;
        var smallCircleMaxSize = 10;
        var smallCircleMinDistance = 0.01;
        var smallCircleCloseness = 300;

        var lensFlare = new THREE.LensFlare( textureFlare1, 256, 0.0, THREE.AdditiveBlending, flareColor);
        for (var i = 0; i < smallCircles; i++) {
            lensFlare.add( textureFlare2, smallCircleMinSize + (Math.random() * smallCircleMaxSize),
                smallCircleMinDistance + (i / smallCircleCloseness) + (Math.random() / 10),
                THREE.AdditiveBlending );
        }

        lensFlare.position.set( -1127.008, 1232.292, -11  );

        scene.add( lensFlare );
    };
    /***end on start functions***/

    /***on load functions***/
    cardinal.onLoadFunctions.cardinal_vertical = function(mesh){
        mesh.visible = false;
        cardinal.assets.cardinal_vertical = mesh;
    };

    cardinal.onLoadFunctions.cardinal_horizontal = function(mesh){
        cardinal.assets.cardinal_horizontal = mesh;
    };

    cardinal.onLoadFunctions.cardinal_slice = function(mesh){
        mesh.visible = false;
        _.each(mesh.material.materials, function(m){m.opacity = 0});
        cardinal.assets.cardinal_slice = mesh;
    };
    /***end on load functions***/

    /***on finish functions***/
    cardinal.onFinishLoadFunctions.playCamera = function(scene, loader) {
        loader.cameraHandler.play(cameraAnimations.animation_1.from, cameraAnimations.animation_1.to,
            function(){cardinal.buttons.slice.add();},
            animate.Animate);
    };

    cardinal.onFinishLoadFunctions.addWatch = function(scene, loader){
        watch.watch(loader.cameraHandler, "frame", function(prop, action, newValue, oldValue) {
            reactToFrame(oldValue);
        });
    };

    cardinal.onFinishLoadFunctions.storeLoader = function(scene, loader){
        cardinal.assets.loaderComponent = loader;
    };

    cardinal.onFinishLoadFunctions.addControls = function(){
        var c = {
            noZoom: true,
            noPan: true,
            maxPolarAngle: 1.6,
            minPolarAngle: 1.3,
            rotateSpeed: 0.11,
            minAzimuthAngle: -0.3,
            maxAzimuthAngle: 0.3
        };
        events.AddControls(c);
        events.ToggleControls(false);
    };

    cardinal.onFinishLoadFunctions.AddMouseDownEvent = function(){
        events.AddMouseDownEvent( function() { TWEEN.removeAll(); });
    };

    cardinal.onFinishLoadFunctions.playSound = function(){
      audio.sounds.igspaceintro.play();
      audio.sounds.igspaceintro.fade(0.2, 0.6, 12000);
    };
    /***end on finish functions***/

    function tweenCamToMain(fun){
        var tweenBackSpeed = 2;
        var anim = cameraAnimations.animation_2;
        cardinal.assets.loaderComponent.cameraHandler.tween(
            anim.from, tweenBackSpeed, fun);
    }

    function tweenCamToSliceMain(fun){
        var tweenBackSpeed = 0.05;
        var anim = cameraAnimations.animation_2;
        cardinal.assets.loaderComponent.cameraHandler.tween(
            anim.to, tweenBackSpeed, fun);
    }

    function reactToFrame(frame){
        switch (frame){
            case 100: //anim 1 mid way, vertical window out of frustum
                cardinal.assets.cardinal_vertical.visible = true;
                break;
            case 155:
                events.AddMouseUpEvent( tweenCamToMain );
                break;
            case 156: //finished anim 1
                events.ToggleControls(true);
                //events.AddMouseUpEvent( tweenCamToMain );
                //controls.minAzimuthAngle = - 0.3;
                //controls.maxAzimuthAngle = 0.3;
                //cameraTweenSpeed = 1;
                //controls.target.copy(camera.target);
                //toggleInput(true);
                //cameraDestinationFrame = newvalue;
                //toggleElement(menu, 'visible');
                break;
            case 159: //going to slice
                //cancelAllTweens();
                //toggleElement(menu, 'hidden');
                //toggleInput(false);
                break;
            case 189: //going back to both windows
                //cancelAllTweens();
                //toggleInput(false);
                //toggleElement(sliceMenu, 'hidden');
                //toggleElement(backButton, 'hidden');
                //break;
            case 191: //finished anim 2
                //controls.minAzimuthAngle = 0.33;
                //controls.maxAzimuthAngle = 0.7;
                //cameraTweenSpeed = 0.05;
                //controls.target.copy(camera.target);
                //toggleInput(true);
                //cameraDestinationFrame = newvalue;
                //toggleElement(sliceMenu, 'visible');
                //toggleElement(backButton, 'visible');
                break;
        }
    }

    cardinal.buttons ={
        slice: {
            add: function(){
                events.AddButton({text:"go to slice",
                    function: function(){ tweenCamToMain(cardinal.goToSlice) },
                    id:"goSlice", once: true});
            },
            remove: function(){ events.RemoveElementByID("goSlice"); }
        },
        backToMain: {
            add: function(){
                events.AddButton({text:"back", function: cardinal.backToMain,
                    id:"backToMain", once: true});
            },
            remove: function(){ events.RemoveElementByID("backToMain"); }
        },
        backToSlice: {
            add: function(){
                events.AddButton({text:"back", function: cardinal.zoomOnSlice.backToSlice,
                    id:"backToSlice", once: true});
            },
            remove: function(){ events.RemoveElementByID("backToSlice"); }
        },
        sealantA:{
            add: function(){
                events.AddButton({text:"sealantA", function: cardinal.zoomOnSlice.sealantA,
                    id:"sealantA", once: true});
            },
            remove: function(){ events.RemoveElementByID("sealantA"); }
        },
        sealantB:{
            add: function(){
                events.AddButton({text:"sealantB", function: cardinal.zoomOnSlice.sealantB,
                    id:"sealantB", once: true});
            },
            remove: function(){ events.RemoveElementByID("sealantB"); }
        },
        spacer:{
            add: function(){
                events.AddButton({text:"spacer", function: cardinal.zoomOnSlice.spacer,
                    id:"spacer", once: true});
            },
            remove: function(){ events.RemoveElementByID("spacer"); }
        },
        dessicant:{
            add: function(){
                events.AddButton({text:"dessicant", function: cardinal.zoomOnSlice.dessicant,
                    id:"dessicant", once: true});
            },
            remove: function(){ events.RemoveElementByID("dessicant"); }
        }
    };

    cardinal.zoomOnSlice = {
         sealantA: function(){
            var anim = cameraAnimations.animation_3;
             events.ToggleControls(false);
             events.RemoveMouseUpEvent( tweenCamToSliceMain );
            cardinal.assets.loaderComponent.cameraHandler.tween(
                anim.frame, anim.speed,
                function(){//on complete
                    manageEmissive.modify(anim.frame);
                    cardinal.buttons.sealantB.add();
                    cardinal.buttons.spacer.add();
                    cardinal.buttons.dessicant.add();
                    cardinal.buttons.backToSlice.add();
                });
             manageEmissive.resetAllSlice();
             events.EmptyElementByID("cameraButtons");
        },
        sealantB: function(){
            var anim = cameraAnimations.animation_4;
            events.ToggleControls(false);
            events.RemoveMouseUpEvent( tweenCamToSliceMain );
            cardinal.assets.loaderComponent.cameraHandler.tween(
                anim.frame, anim.speed,
                function(){//on complete
                    manageEmissive.modify(anim.frame);
                    cardinal.buttons.sealantA.add();
                    cardinal.buttons.spacer.add();
                    cardinal.buttons.dessicant.add();
                    cardinal.buttons.backToSlice.add();
                });
            manageEmissive.resetAllSlice();
            events.EmptyElementByID("cameraButtons");
        },
        spacer: function(){
            var anim = cameraAnimations.animation_5;
            events.ToggleControls(false);
            events.RemoveMouseUpEvent( tweenCamToSliceMain );
            cardinal.assets.loaderComponent.cameraHandler.tween(
                anim.frame, anim.speed,
                function(){//on complete
                    manageEmissive.modify(anim.frame);
                    cardinal.buttons.sealantA.add();
                    cardinal.buttons.sealantB.add();
                    cardinal.buttons.dessicant.add();
                    cardinal.buttons.backToSlice.add();
                });
            manageEmissive.resetAllSlice();
            events.EmptyElementByID("cameraButtons");
        },
        dessicant: function(){
            var anim = cameraAnimations.animation_6;
            events.ToggleControls(false);
            events.RemoveMouseUpEvent( tweenCamToSliceMain );
            cardinal.assets.loaderComponent.cameraHandler.tween(
                anim.frame, anim.speed,
                function(){//on complete
                    manageEmissive.modify(anim.frame);
                    cardinal.buttons.sealantA.add();
                    cardinal.buttons.sealantB.add();
                    cardinal.buttons.spacer.add();
                    cardinal.buttons.backToSlice.add();
                });
            manageEmissive.resetAllSlice();
            events.EmptyElementByID("cameraButtons");
        },
        backToSlice: function(){
            var speed = 0.1;
            events.ToggleControls(true);
            events.AddMouseUpEvent( tweenCamToSliceMain );
            cardinal.assets.loaderComponent.cameraHandler.tween(
                cameraAnimations.animation_2.to, speed,
                function(){//on complete
                    cardinal.buttons.sealantA.add();
                    cardinal.buttons.sealantB.add();
                    cardinal.buttons.spacer.add();
                    cardinal.buttons.dessicant.add();
                    cardinal.buttons.backToMain.add();
                });
            manageEmissive.resetAllSlice();
            events.EmptyElementByID("cameraButtons");
        }
    };

    var manageEmissive = {
        sealantA_ID: 4,
        sealantB_ID: 6,
        spacerSlice_ID: 2,
        dessicant_ID: 3,
        modify: function (frame){
            var sliceSelectedC = new THREE.Color(0x3498db);
            var mats = cardinal.assets.cardinal_slice.material.materials;
            switch (frame){
                case 191:
                    mats[manageEmissive.sealantA_ID].emissive = sliceSelectedC;
                    break;
                case 192:
                    mats[manageEmissive.sealantB_ID].emissive = sliceSelectedC;
                    break;
                case 193:
                    mats[manageEmissive.spacerSlice_ID].emissive = sliceSelectedC;
                    break;
                case 194:
                    mats[manageEmissive.dessicant_ID].emissive = sliceSelectedC;
                    break;
            }
            audio.sounds.igwhoosh.play();
        },
        resetAllSlice: function () {
            var mats = cardinal.assets.cardinal_slice.material.materials;
            _.each(mats, function(m){ m.emissive = m.defaultEmissive; });
        }
    };

    cardinal.goToSlice = function(){
        cardinal.assets.cardinal_slice.visible = true;
        cardinal.buttons.slice.remove();
        events.RemoveMouseUpEvent(tweenCamToMain);
        events.AddMouseUpEvent(tweenCamToSliceMain);

        events.Controls.minAzimuthAngle = 0.1;
        events.Controls.maxAzimuthAngle = 0.9;
        events.ToggleControls(false);

        _.each(cardinal.assets.cardinal_vertical.material.materials, function(mat){
            mat.transparent = true;
            animate.TweenOpacity(mat, 0, fadeOutTime, undefined,
                function(){cardinal.assets.cardinal_vertical.visible = false;});//on complete
        });

        _.each(cardinal.assets.cardinal_horizontal.material.materials,
            function(mat){//on complete
            mat.transparent = true;
            animate.TweenOpacity(mat, 0, fadeOutTime);
        });

        _.each(cardinal.assets.cardinal_slice.material.materials,
            function(mat){ animate.TweenOpacity(mat, mat.maxOpacity, fadeOutTime); });

        cardinal.assets.loaderComponent.cameraHandler.play(
            cameraAnimations.animation_2.from,
            cameraAnimations.animation_2.to,
            function(){//on complete
                cardinal.buttons.sealantA.add();
                cardinal.buttons.sealantB.add();
                cardinal.buttons.spacer.add();
                cardinal.buttons.dessicant.add();
                cardinal.buttons.backToMain.add();
                events.ToggleControls(true);
            }
        );
    }

    cardinal.backToMain = function(){
        cardinal.assets.cardinal_vertical.visible = true;
        events.EmptyElementByID("cameraButtons");
        events.RemoveMouseUpEvent(tweenCamToSliceMain);
        events.AddMouseUpEvent(tweenCamToMain);

        events.Controls.minAzimuthAngle = - 0.3;
        events.Controls.maxAzimuthAngle = 0.3;
        events.ToggleControls(false);

        _.each(cardinal.assets.cardinal_vertical.material.materials, function(mat){
            animate.TweenOpacity(mat, mat.maxOpacity, fadeOutTime);
        });

        _.each(cardinal.assets.cardinal_horizontal.material.materials, function(mat){
            animate.TweenOpacity(mat, mat.maxOpacity, fadeOutTime);
        });

        _.each(cardinal.assets.cardinal_slice.material.materials, function(mat){
            animate.TweenOpacity(mat, 0, fadeOutTime, undefined,
                function(){cardinal.assets.cardinal_slice.visible = false;});//on complete
        });

        cardinal.assets.loaderComponent.cameraHandler.play(
            cameraAnimations.animation_2.to,
            cameraAnimations.animation_2.from,
            function(){
                cardinal.buttons.slice.add();
                events.ToggleControls(true);
            }//on complete
        );
    }

    return cardinal;
});
