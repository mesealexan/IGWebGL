define(["scene", "three", "watch", "events", "tween", "underscore", "animate", "callback", "composers", "aeTween", "text"],
function(scene, three, watch, events, tween, underscore, animate, callback, composers, aeTween, text){
var cardinalScene = {
  scene: {}
  ,
  callbacks:{
    introAnimHalfway: {
      sampleCall1: function(){ console.log("reached middle of intro animation"); },
      sampleCall1a: function(){ console.info("an event can have multiple callbacks"); }
    },
    introAnimDone: {
      sampleCall2: function(){ console.log("finished intro animation"); }
    },
    goToSliceStart: {
      sampleCall3: function(){ console.log("started going to slice"); }
    },
    goToSliceDone: {
      sampleCall4: function(){ console.log("reached slice"); }
    },
    backToMainStart: {
      sampleCall5: function(){ console.log("started going back to main"); }
    },
    backToMainDone: {
      sampleCall6: function(){ console.log("done going back to main"); }
    },
    goToSealantA_Start: {
      sampleCall7: function(){ console.log("started going to sealant A"); }
    },
    goToSealantA_Done: {
      sampleCall8: function(){ console.log("done going to sealant A"); }
    },
    goToSealantB_Start: {
      sampleCall9: function(){ console.log("started going to sealant B"); }
    },
    goToSealantB_Done: {
      sampleCall10: function(){ console.log("done going to sealant B"); }
    },
    goToSpacerStart: {
      sampleCall11: function(){ console.log("started going to spacer"); }
    },
    goToSpacerDone: {
      sampleCall12: function(){ console.log("done going to spacer"); }
    },
    goToDessicantStart: {
      sampleCall13: function(){ console.log("started going to dessicant"); }
    },
    goToDessicantDone: {
      sampleCall14: function(){ console.log("done going to dessicant"); }
    },
    backToSliceStart: {
      sampleCall15: function(){ console.log("started going to back slice"); }
    },
    backToSliceDone: {
      sampleCall16: function(){ console.log("done going back to slice"); }
    }
  }
  ,
  constructor: function(){
    var cardinal = new scene();
    cardinal.folderName = "cardinal";
    cardinal.addAssets(['cardinal_horizontal', 'cardinal_vertical', 'cardinal_slice'/*, 'LeapForward'*/]);

    var fadeOutTime = 700;

    var cameraAnimations = {
        animation_1: { from:    0, to:     158},
        animation_2: { from:  158, to:     190},
        animation_3: { frame: 191, speed: 0.05},
        animation_4: { frame: 192, speed: 0.05},
        animation_5: { frame: 193, speed: 0.05},
        animation_6: { frame: 194, speed: 0.05}
    };

    /***on start functions***/
    cardinal.onStartFunctions.addLights = function(scene){
        scene.add( new THREE.AmbientLight( 0x333333 ) );
        scene.fog = new THREE.Fog(0x13161d, 6000, 8000);

        var light1 = new THREE.PointLight( 0xffffff, 1, 5000 );
        light1.position.set( -2929, 2686, 938 );
        scene.add( light1 );

        var light2 = new THREE.PointLight( 0xffffff, 1, 10000 );
        light2.position.set( 345,3562,-4050 );
        //scene.add( light2 );

        var light3 = new THREE.PointLight( 0xffffff, 1, 10000 );
        light3.position.set( 3615,2688,843 );
        //scene.add( light3 );

        var directionalLight = new THREE.DirectionalLight( 0xffffff, 1. );
        directionalLight.position.set( 1000, 1000, 1000 );
        scene.add( directionalLight );
    };

    cardinal.onStartFunctions.addWhitePlane = function (scene) {
        var radius = 10000;
        var geometry = new THREE.CylinderGeometry( radius, radius, 1, 32 );
        var material = new THREE.MeshLambertMaterial( {color: 0x999999, ambient: 0x333333,
            specular: 0x333333, emissive: 0x333333, side: THREE.FrontSide} );
        var cylinder = new THREE.Mesh( geometry, material );
        cylinder.position.set(0, -100, 0);
        scene.add( cylinder );
    };

    cardinal.onStartFunctions.addLensFlare = function(scene) {
        /*var textureFlare1 = THREE.ImageUtils.loadTexture( cardinal.mediaFolderUrl+
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

        lensFlare.position.set( -1127.008, 1232.292, -11  );*/
      //  scene.add( lensFlare );
    };

    cardinal.onStartFunctions.makeText = function(scene){
      var string = "Leap forward 20 years.";
      var settings = {
        size: 10,
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

      cardinal.assets.introText = new THREE.Mesh(geom, mat);
      cardinal.assets.introText.position.set(centerOffset, 0, -500);
      animate.camera.add(cardinal.assets.introText);
    };
    /***end on start functions***/

    /***on load functions***/
    cardinal.onLoadFunctions.LeapForward = function(mesh){
        cardinal.assets.introText = mesh;
        mesh.material = new THREE.MeshBasicMaterial();
        mesh.material.color.setHex( 0xffffff );
        //mesh.material.emissive.setHex( 0x999999 );
        mesh.material.transparent = true;
        mesh.scale.set(0.02, 0.02, 0.02)
        mesh.rotateX(Math.PI / 2);
        mesh.position.z -= 50;
        animate.camera.add(mesh);
    };

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
    cardinal.onFinishLoadFunctions.increaseCamNear = function(){
        animate.camera.far = 6000;
        animate.camera.near = 100;
        animate.camera.updateProjectionMatrix();
    };

    cardinal.onFinishLoadFunctions.playCamera = function(scene, loader) {

      var firstFrame = loader.cameraHandler.Animation.frames[1];
      loader.cameraHandler.play(
        cameraAnimations.animation_1.from,
        cameraAnimations.animation_1.from + 1, onCompleteFirstPlay
      );

      function onCompleteFirstPlay(){
          animate.camera.translateY( 100 );
          var newUp = loader.cameraHandler.modifyCameraUp(firstFrame.rollAngle);
          animate.camera.up.set(newUp.x, newUp.y, newUp.z);
          loader.cameraHandler.tween(0, 0.03, onCompleteTween, TWEEN.Easing.Cubic.In);
          tweenBloomDown();
      }

      function onCompleteTween(){
        loader.cameraHandler.play(
          cameraAnimations.animation_1.from,
          cameraAnimations.animation_1.to,
          function(){       //on finish
            cardinal.buttons.slice.add();
            addMouseDownEvent();
          },
          function(){       //on start
            tweenTextOpac();
            animate.camera.near = 1;
            animate.camera.updateProjectionMatrix();
          }
        );
      }
      animate.Animate();
    };

    cardinal.onFinishLoadFunctions.applyComposer = function(scene){
      cardinal.assets.composer = new composers.Bloom_AdditiveColor({
        str: 0.1,
        bok: {
          foc: 1.00,
          ape: 0.01
        }
      });
      animate.SetCustomRenderFunction( function(){ cardinal.assets.composer.render(); } );
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

    /***end on finish functions***/
    cardinal.onUnloadFunctions.resetCam = function(){
      animate.SetCameraDelaultValues();
    };

    cardinal.onUnloadFunctions.removeFog = function(scene) {
      scene.fog = undefined;
    }

    function tweenCamToMain(fun){
        var tweenBackSpeed = 2;
        var anim = cameraAnimations.animation_2;
        cardinal.assets.loaderComponent.cameraHandler.tween(
            anim.from, tweenBackSpeed, fun);
    }

    function addMouseDownEvent (){
        events.AddMouseDownEvent( function() { TWEEN.removeAll(); });
    };

    function tweenCamToSliceMain(fun){
        var tweenBackSpeed = 0.05;
        var anim = cameraAnimations.animation_2;
        cardinal.assets.loaderComponent.cameraHandler.tween(
            anim.to, tweenBackSpeed, fun);
    }

    function reactToFrame(frame){
        switch (frame){
            case 100://anim 1 mid way, vertical window out of frustum
                cardinal.assets.cardinal_vertical.visible = true;
                callback.go(cardinalScene.callbacks.introAnimHalfway);
                break;
            case 155:
                events.AddMouseUpEvent( tweenCamToMain );
                break;
            case 156://finished anim 1
                events.ToggleControls(true);
                callback.go(cardinalScene.callbacks.introAnimDone);
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
            callback.go(cardinalScene.callbacks.goToSealantA_Start);
            var anim = cameraAnimations.animation_3;
             events.ToggleControls(false);
             events.RemoveMouseUpEvent( tweenCamToSliceMain );
            cardinal.assets.loaderComponent.cameraHandler.tween(
                anim.frame, anim.speed,
                function(){//on complete
                    callback.go(cardinalScene.callbacks.goToSealantA_Done);
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
           callback.go(cardinalScene.callbacks.goToSealantB_Start);
            var anim = cameraAnimations.animation_4;
            events.ToggleControls(false);
            events.RemoveMouseUpEvent( tweenCamToSliceMain );
            cardinal.assets.loaderComponent.cameraHandler.tween(
                anim.frame, anim.speed,
                function(){//on complete
                   callback.go(cardinalScene.callbacks.goToSealantB_Done);
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
           callback.go(cardinalScene.callbacks.goToSpacerStart);
            var anim = cameraAnimations.animation_5;
            events.ToggleControls(false);
            events.RemoveMouseUpEvent( tweenCamToSliceMain );
            cardinal.assets.loaderComponent.cameraHandler.tween(
                anim.frame, anim.speed,
                function(){//on complete
                   callback.go(cardinalScene.callbacks.goToSpacerDone);
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
           callback.go(cardinalScene.callbacks.goToDessicantStart);
            var anim = cameraAnimations.animation_6;
            events.ToggleControls(false);
            events.RemoveMouseUpEvent( tweenCamToSliceMain );
            cardinal.assets.loaderComponent.cameraHandler.tween(
                anim.frame, anim.speed,
                function(){//on complete
                   callback.go(cardinalScene.callbacks.goToDessicantDone);
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
            callback.go(cardinalScene.callbacks.backToSliceStart);
            var speed = 0.1;
            events.ToggleControls(true);
            events.AddMouseUpEvent( tweenCamToSliceMain );
            cardinal.assets.loaderComponent.cameraHandler.tween(
                cameraAnimations.animation_2.to, speed,
                function(){//on complete
                    callback.go(cardinalScene.callbacks.backToSliceDone);
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
        },
        resetAllSlice: function () {
            var mats = cardinal.assets.cardinal_slice.material.materials;
            _.each(mats, function(m){ m.emissive = m.defaultEmissive; });
        }
    };

    cardinal.goToSlice = function(){
        events.ToggleControls(false);
        callback.go(cardinalScene.callbacks.goToSliceStart);
        cardinal.assets.cardinal_slice.visible = true;
        cardinal.buttons.slice.remove();
        events.RemoveMouseUpEvent(tweenCamToMain);
        events.AddMouseUpEvent(tweenCamToSliceMain);

        events.Controls.minAzimuthAngle = 0.1;
        events.Controls.maxAzimuthAngle = 0.9;

        _.each(cardinal.assets.cardinal_vertical.material.materials, function(mat){
            mat.transparent = true;

            /*animate.TweenOpacity(mat, 0, fadeOutTime, undefined,
                function(){
                  cardinal.assets.cardinal_vertical.visible = false;
                });//on complete
            */


            var opacTween = new aeTween(mat);
            opacTween.to({opacity: 0}, 20);
            opacTween.onComplete = function(){
              cardinal.assets.cardinal_vertical.visible = false;
            }
            opacTween.start();
        });

        _.each(cardinal.assets.cardinal_horizontal.material.materials,
            function(mat){//on complete
            mat.transparent = true;
            animate.TweenOpacity(mat, 0, fadeOutTime);
        });

        _.each(cardinal.assets.cardinal_slice.material.materials,
            function(mat){ animate.TweenOpacity(mat, mat.maxOpacity, fadeOutTime); }
          );

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
                callback.go(cardinalScene.callbacks.goToSliceDone);
            }
        );
    }

    cardinal.backToMain = function(){
        callback.go(cardinalScene.callbacks.backToMainStart);
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
            function(){//on complete
                cardinal.buttons.slice.add();
                events.ToggleControls(true);
                callback.go(cardinalScene.callbacks.backToMainDone);
            }
        );
    }

    function tweenTextOpac() {
      var tween = new TWEEN.Tween( cardinal.assets.introText.material );
      tween.to( { opacity: 0 }, 500 );
      tween.onComplete(function () { cardinal.assets.introText.visible = false; });
      tween.start();
    }

    function tweenBloomDown() {
      var amount = cardinal.assets.composer.passes[2].copyUniforms.opacity;
      var tween = new TWEEN.Tween( amount );
      tween.to( { value: 0 }, 100 );
      //tween.start();
    }

    return cardinal;
  }
};
return cardinalScene;
});
