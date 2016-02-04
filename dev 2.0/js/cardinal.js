define(["scene", "three", "watch", "events", "tween", "underscore", "animate", "callback", "composers", "aeTween", "text", "materials"],
function(scene, three, watch, events, tween, underscore, animate, callback, composers, aeTween, text, materials){
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
  url: "ig"
  ,
  constructor: function(){
    var cardinal = new scene();
    cardinal.folderName = "cardinal";
    cardinal.addAssets(['cardinal_horizontal', 'cardinal_vertical', 'cardinal_slice',
      'cardinal_vertical_shadow', 'cardinal_horizontal_shadow']);

    var fadeOutTime = 700;
    var fpsForText = 20; //slow down fps to read text on window.

    var cameraAnimations = {
        animation_1: { from:    0, to:     158},
        animation_2: { from:  158, to:     191},
        animation_3: { frame: 191, speed: 0.05},
        animation_4: { frame: 192, speed: 0.05},
        animation_5: { frame: 193, speed: 0.05},
        animation_6: { frame: 194, speed: 0.05}
    };

    /***on start functions***/
    cardinal.onStartFunctions.addLights = function(scene){
        scene.add( new THREE.AmbientLight( 0xaaaaaa ) );
        scene.fog = new THREE.Fog(0x13161d, 6000, 8000);

        var light1 = new THREE.PointLight( 0xffffff, 0.8, 5000 );
        light1.position.set( -2929, 2686, 938 );
        scene.add( light1 );

        var light2 = new THREE.PointLight( 0xffffff, 0.8, 10000 );
        light2.position.set( 345,3562,-4050 );
        scene.add( light2 );

        var light3 = new THREE.PointLight( 0xffffff, 0.3, 10000 );
        light3.position.set( 3615,2688,843 );
        scene.add( light3 );

        var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.1 );
        directionalLight.position.set( 1000, 1000, 1000 );
        //scene.add( directionalLight );
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
       lensFlare.visible = false;
       cardinal.assets.lensFlare = lensFlare;
       scene.add( lensFlare );
    };

    cardinal.onStartFunctions.makeText = function(scene){
      var string = "Leap forward 20 years.";
      var settings = {
        size: 10,
        curveSegments: 4,
        height: 1,
 			 bevelEnabled: true,
 			 bevelThickness: 0.2,
 			 bevelSize: 0.1,
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

      materials.outlineShader.prototype = new THREE.ShaderMaterial();
  	 	var outlineMaterial = new materials.outlineShader({
  	 		thickness: 0.5,
  	 		color: new THREE.Color("rgb(150,150,150)")
  	 	});

      var mats = [mat, outlineMaterial];
      var multiMesh = THREE.SceneUtils.createMultiMaterialObject(geom, mats);

      cardinal.assets.introText = multiMesh;
      cardinal.assets.introText.position.set(centerOffset, 0, -500);
      animate.camera.add(cardinal.assets.introText);

      string = "Dual seal durability";
      settings.size = 25;
      geom = text.Make(string, settings);
      geom.computeBoundingBox();
      centerOffset = -0.5 * ( geom.boundingBox.max.x - geom.boundingBox.min.x );
      var mesh = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({transparent: true}));
      mesh.position.set(170 + centerOffset, -79, 797);
      scene.add(mesh);
      cardinal.assets.dualSealText = mesh;

      string = "in a warm edge spacer";
      geom = text.Make(string, settings);
      geom.computeBoundingBox();
      centerOffset = -0.5 * ( geom.boundingBox.max.x - geom.boundingBox.min.x );
      mesh = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({transparent: true}));
      mesh.rotation.y += Math.PI / 2;
      mesh.position.set(388, -50, 780);
      scene.add(mesh);
      cardinal.assets.warmEdgeText = mesh;
    };
    /***end on start functions***/

    /***on load functions***/
    cardinal.onLoadFunctions.cardinal_vertical_shadow = function(mesh){
        mesh.visible = false;
        mesh.material = mesh.material.materials[0];
        mesh.material.transparent = true;
        cardinal.assets.cardinal_vertical_shadow = mesh;
    };

    cardinal.onLoadFunctions.cardinal_horizontal_shadow = function(mesh){
        mesh.material = mesh.material.materials[0];
        mesh.material.transparent = true;
        cardinal.assets.cardinal_horizontal_shadow = mesh;
    };

    cardinal.onLoadFunctions.cardinal_vertical = function(mesh){
        mesh.visible = false;
        _.each(mesh.material.materials, function(m){
            m.shading = THREE.FlatShading;
        });
        cardinal.assets.cardinal_vertical = mesh;
    };

    cardinal.onLoadFunctions.cardinal_horizontal = function(mesh){
        cardinal.assets.cardinal_horizontal = mesh;
    };

    cardinal.onLoadFunctions.cardinal_slice = function(mesh){
        mesh.visible = false;
        _.each(mesh.material.materials, function(m){
          if(m.name != "cardinalGlass" && m.name != "cardinalGlass Sides")
            m.transparent = false;
          else m.shading = THREE.FlatShading;
        });
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
          onCameraComplete,
          onCameraStart
        );
      }

      function onCameraComplete () {
        cardinal.buttons.slice.add();
        addMouseDownEvent();
        animate.StartTimeout();
      }

      function onCameraStart () {
        tweenTextOpac();
        animate.camera.near = 1;
        animate.camera.updateProjectionMatrix();
      }

      animate.Animate();
    };

    cardinal.onFinishLoadFunctions.applyComposer = function(scene){
      cardinal.assets.composer = new composers.Bloom_AdditiveColor({
        str: 0.1,
        bok: {
          foc: 0.7,
          ape: 0.02
        }
      });
      //animate.SetCustomRenderFunction( function(){ cardinal.assets.composer.render(); } );
      //events.addDOF_GUI(cardinal);
    };

    cardinal.onFinishLoadFunctions.addWatch = function(scene, loader){
        watch.watch(loader.cameraHandler, "frame", function(prop, action, newValue, oldValue) {
            reactToFrame(oldValue);
        });
    };

    cardinal.onFinishLoadFunctions.SetCustomFramerate = function(scene, loader){
      //animate.SetCustomFramerate(60);
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
        events.AddMouseDownEvent(stopAllTweens);
    };

    function stopAllTweens(){
      TWEEN.removeAll();
    }

    function tweenCamToSliceMain(fun){
        var tweenBackSpeed = 0.05;
        var anim = cameraAnimations.animation_2;
        cardinal.assets.loaderComponent.cameraHandler.tween(
            anim.to - 1, tweenBackSpeed, fun);
    }

    function reactToFrame(frame){
        switch (frame){
            case 80:
                animate.SetCustomFramerate(fpsForText);
                cardinal.assets.lensFlare.visible = true;
            break;
            case 100://anim 1 mid way, vertical window out of frustum
                cardinal.assets.cardinal_slice.visible = true;
                cardinal.assets.cardinal_vertical.visible = true;
                cardinal.assets.cardinal_vertical_shadow.visible = true;
                callback.go(cardinalScene.callbacks.introAnimHalfway);
                break;
            case 155:
                animate.SetDefaultFramerate();
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
                    id:"goSlice", class:"navigation", once: true});
            },
            remove: function(){ events.RemoveElementByID("goSlice"); }
        },
        backToMain: {
            add: function(){
                events.AddButton({text:"back", function: cardinal.backToMain,
                    id:"backToMain", class:"navigation", once: true});
            },
            remove: function(){ events.RemoveElementByID("backToMain"); }
        },
        backToSlice: {
            add: function(){
                events.AddButton({text:"back", function: cardinal.zoomOnSlice.backToSlice,
                    id:"backToSlice", class:"navigation", once: true});
            },
            remove: function(){ events.RemoveElementByID("backToSlice"); }
        },
        sealantA:{
            add: function(){
                events.AddButton({text:"sealantA", function: cardinal.zoomOnSlice.sealantA,
                    id:"sealantA", class:"glass-component", once: false});
            },
            remove: function(){ events.RemoveElementByID("sealantA"); }
        },
        sealantB:{
            add: function(){
                events.AddButton({text:"sealantB", function: cardinal.zoomOnSlice.sealantB,
                    id:"sealantB", class:"glass-component", once: false});
            },
            remove: function(){ events.RemoveElementByID("sealantB"); }
        },
        spacer:{
            add: function(){
                events.AddButton({text:"spacer", function: cardinal.zoomOnSlice.spacer,
                    id:"spacer", class:"glass-component", once: false});
            },
            remove: function(){ events.RemoveElementByID("spacer"); }
        },
        dessicant:{
            add: function(){
                events.AddButton({text:"dessicant", function: cardinal.zoomOnSlice.dessicant,
                    id:"dessicant", class:"glass-component", once: false});
            },
            remove: function(){ events.RemoveElementByID("dessicant"); }
        }
    };

    cardinal.zoomOnSlice = {
        currentPosition: undefined
        ,
         sealantA: function(){
           if (cardinal.zoomOnSlice.currentPosition == "sealantA") return;
           stopAllTweens();
           cardinal.zoomOnSlice.currentPosition = "sealantA";
           events.RemoveMouseDownEvent(stopAllTweens);
            callback.go(cardinalScene.callbacks.goToSealantA_Start);
            var anim = cameraAnimations.animation_3;
             events.ToggleControls(false);
             events.RemoveMouseUpEvent( tweenCamToSliceMain );
            cardinal.assets.loaderComponent.cameraHandler.tween(
                anim.frame, anim.speed,
                function(){//on complete
                    callback.go(cardinalScene.callbacks.goToSealantA_Done);
                    manageEmissive.modify(anim.frame);
                    cardinal.buttons.backToSlice.add();
                });
             manageEmissive.resetAllSlice();
             events.RemoveElementByID("backToMain");
             events.RemoveElementByID("backToSlice");
        }
        ,
        sealantB: function(){
          console.log(cardinal.zoomOnSlice.currentPosition)
          if (cardinal.zoomOnSlice.currentPosition == "sealantB") return;
          stopAllTweens();
          cardinal.zoomOnSlice.currentPosition = "sealantB";
           events.RemoveMouseDownEvent(stopAllTweens);
           callback.go(cardinalScene.callbacks.goToSealantB_Start);
            var anim = cameraAnimations.animation_4;
            events.ToggleControls(false);
            events.RemoveMouseUpEvent( tweenCamToSliceMain );
            cardinal.assets.loaderComponent.cameraHandler.tween(
                anim.frame, anim.speed,
                function(){//on complete
                   callback.go(cardinalScene.callbacks.goToSealantB_Done);
                    manageEmissive.modify(anim.frame);
                    cardinal.buttons.backToSlice.add();
                });
            manageEmissive.resetAllSlice();
            events.RemoveElementByID("backToMain");
            events.RemoveElementByID("backToSlice");
        },
        spacer: function(){
          if (cardinal.zoomOnSlice.currentPosition == "spacer") return;
          stopAllTweens();
          cardinal.zoomOnSlice.currentPosition = "spacer";
           events.RemoveMouseDownEvent(stopAllTweens);
           callback.go(cardinalScene.callbacks.goToSpacerStart);
            var anim = cameraAnimations.animation_5;
            events.ToggleControls(false);
            events.RemoveMouseUpEvent( tweenCamToSliceMain );
            cardinal.assets.loaderComponent.cameraHandler.tween(
                anim.frame, anim.speed,
                function(){//on complete
                   callback.go(cardinalScene.callbacks.goToSpacerDone);
                    manageEmissive.modify(anim.frame);
                    cardinal.buttons.backToSlice.add();
                });
            manageEmissive.resetAllSlice();
            events.RemoveElementByID("backToMain");
            events.RemoveElementByID("backToSlice");
        },
        dessicant: function(){
          if (cardinal.zoomOnSlice.currentPosition == "dessicant") return;
          stopAllTweens();
          cardinal.zoomOnSlice.currentPosition = "dessicant";
           events.RemoveMouseDownEvent(stopAllTweens);
           callback.go(cardinalScene.callbacks.goToDessicantStart);
            var anim = cameraAnimations.animation_6;
            events.ToggleControls(false);
            events.RemoveMouseUpEvent( tweenCamToSliceMain );
            cardinal.assets.loaderComponent.cameraHandler.tween(
                anim.frame, anim.speed,
                function(){//on complete
                   callback.go(cardinalScene.callbacks.goToDessicantDone);
                    manageEmissive.modify(anim.frame);
                    cardinal.buttons.backToSlice.add();
                });
            manageEmissive.resetAllSlice();
            events.RemoveElementByID("backToMain");
            events.RemoveElementByID("backToSlice");
        },
        backToSlice: function(){
            callback.go(cardinalScene.callbacks.backToSliceStart);
            var speed = 0.1;
            cardinal.assets.loaderComponent.cameraHandler.tween(
                cameraAnimations.animation_2.to - 1, speed,
                function(){//on complete
                    events.ToggleControls(true);
                    events.AddMouseDownEvent(stopAllTweens);
                    events.AddMouseUpEvent( tweenCamToSliceMain );
                    callback.go(cardinalScene.callbacks.backToSliceDone);
                    cardinal.buttons.backToMain.add();
                    cardinal.zoomOnSlice.currentPosition = undefined;
                });
            manageEmissive.resetAllSlice();
            events.RemoveElementByID("backToSlice");

        }
    };

    var manageEmissive = {
        sealantA_ID: 5,
        sealantB_ID: 4,
        spacerSlice_ID: 6,
        dessicant_ID: 0,
        modify: function (frame){
            var sliceSelectedC = new THREE.Color(0x67C8FF);
            var mats = cardinal.assets.cardinal_slice.material.materials;
            switch (frame){
                case 191:
                    mats[manageEmissive.sealantA_ID].color = sliceSelectedC;
                    break;
                case 192:
                    mats[manageEmissive.sealantB_ID].color = sliceSelectedC;
                    break;
                case 193:
                    mats[manageEmissive.spacerSlice_ID].color = sliceSelectedC;
                    break;
                case 194:
                    mats[manageEmissive.dessicant_ID].color = sliceSelectedC;
                    break;
            }
        },
        resetAllSlice: function () {
            var mats = cardinal.assets.cardinal_slice.material.materials;
            _.each(mats, function(m){ m.color = m.defaultColor; });
        }
    };

    cardinal.goToSlice = function () {
        events.ToggleControls(false);
        callback.go(cardinalScene.callbacks.goToSliceStart);
        cardinal.buttons.slice.remove();
        events.RemoveMouseDownEvent(stopAllTweens);
        events.RemoveMouseUpEvent(tweenCamToMain);

        events.Controls.minAzimuthAngle = 0.1;
        events.Controls.maxAzimuthAngle = 0.9;

        tweenShadowOpacity(0);
        tweenTextOpacity(0);

        var newX = 1182 - 795;
        newZ = 1105 - 437;

        var posTween = new aeTween(cardinal.assets.cardinal_vertical.position);
        posTween.to({x: newX, z: newZ}, 30);
        posTween.start();

        _.each(cardinal.assets.cardinal_horizontal.material.materials,
            function(mat){//on complete
            mat.transparent = true;
            animate.TweenOpacity(mat, 0, fadeOutTime);
        });

        cardinal.assets.loaderComponent.cameraHandler.play(
            cameraAnimations.animation_2.from,
            cameraAnimations.animation_2.to,
            function(){//on complete
                cardinal.buttons.backToMain.add();
                cardinal.buttons.sealantA.add();
                cardinal.buttons.sealantB.add();
                cardinal.buttons.spacer.add();
                cardinal.buttons.dessicant.add();
                events.ToggleControls(true);
                events.AddMouseUpEvent(tweenCamToSliceMain);
                events.AddMouseDownEvent(stopAllTweens);
                callback.go(cardinalScene.callbacks.goToSliceDone);
            }
        );
    }

    cardinal.backToMain = function () {
        callback.go(cardinalScene.callbacks.backToMainStart);
        //cardinal.assets.cardinal_vertical.visible = true;

        events.EmptyElementByID("cameraButtons");
        events.RemoveMouseUpEvent(tweenCamToSliceMain);
        events.RemoveMouseDownEvent(stopAllTweens);

        events.Controls.minAzimuthAngle = - 0.3;
        events.Controls.maxAzimuthAngle = 0.3;
        events.ToggleControls(false);

        tweenShadowOpacity(1);
        tweenTextOpacity(1);

        var posTween = new aeTween(cardinal.assets.cardinal_vertical.position);
        posTween.to({x: 0, z: 0}, 20);
        posTween.start();

        _.each(cardinal.assets.cardinal_horizontal.material.materials, function(mat){
            animate.TweenOpacity(mat, mat.maxOpacity, fadeOutTime);
        });

        cardinal.assets.loaderComponent.cameraHandler.play(
            cameraAnimations.animation_2.to,
            cameraAnimations.animation_2.from,
            function(){//on complete
                events.AddMouseUpEvent(tweenCamToMain);
                cardinal.buttons.slice.add();
                events.ToggleControls(true);
                events.AddMouseDownEvent(stopAllTweens);
                callback.go(cardinalScene.callbacks.backToMainDone);
            }
        );
    }

    function tweenTextOpac () {
      var tween = new TWEEN.Tween( cardinal.assets.introText.children[0].material );
      tween.to( { opacity: 0 }, 500 );
      tween.onComplete(function () { cardinal.assets.introText.visible = false; });
      tween.start();
    }

    function tweenBloomDown () {
      var amount = cardinal.assets.composer.passes[2].copyUniforms.opacity;
      var tween = new TWEEN.Tween( amount );
      tween.to( { value: 0 }, 100 );
      //tween.start();
    }

    function tweenShadowOpacity ( val ) {
      if (val == 1) {
        cardinal.assets.cardinal_vertical_shadow.visible = true;
        cardinal.assets.cardinal_horizontal_shadow.visible = true;
      }

      var opacTween = new aeTween(cardinal.assets.cardinal_horizontal_shadow.material);
      opacTween.to({opacity: val}, 20);
      opacTween.onComplete = function(){
        if(val == 0)
          cardinal.assets.cardinal_horizontal_shadow.visible = false;
      }
      opacTween.start();

      opacTween = new aeTween(cardinal.assets.cardinal_vertical_shadow.material);
      opacTween.to({opacity: val}, 20);
      opacTween.onComplete = function(){
        if(val == 0)
          cardinal.assets.cardinal_vertical_shadow.visible = false;
      }
      opacTween.start();
    }

    function tweenTextOpacity ( val ) {
      if (val == 1) {
        cardinal.assets.warmEdgeText.visible = true;
        cardinal.assets.dualSealText.visible = true;
      }

      var opacTween = new aeTween(cardinal.assets.dualSealText.material);
      opacTween.to({opacity: val}, 20);
      opacTween.onComplete = function(){
        if(val == 0)
          cardinal.assets.dualSealText.visible = false;
      }
      opacTween.start();

      opacTween = new aeTween(cardinal.assets.warmEdgeText.material);
      opacTween.to({opacity: val}, 20);
      opacTween.onComplete = function(){
        if(val == 0)
          cardinal.assets.warmEdgeText.visible = false;
      }
      opacTween.start();
    }

    return cardinal;
  }
};
return cardinalScene;
});
