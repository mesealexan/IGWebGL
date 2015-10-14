define(["three", "watch", "events", "tween", "underscore", "animate"],
    function(three, watch, events, tween, underscore, animate){
    var cardinal = {};
    var fadeOutTime = 700;

    var cameraAnimations = {
        animation_1:{ from: 0, to: 158},
        animation_2:{ from: 158, to: 190},
        animation_3:{ frame: 191, speed: 0.05},
        animation_4:{ frame: 192, speed: 0.05},
        animation_5:{ frame: 193, speed: 0.05},
        animation_6:{ frame: 194, speed: 0.05}
    };

    cardinal.folderName = "cardinal";
    cardinal.onStartFunctions = {};
    cardinal.onLoadFunctions = {};
    cardinal.onFinishLoadFunctions = {};
    cardinal.animationHandlers = {};
    cardinal.snowHandlers = {};
    cardinal.assets = {};

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
        var side = 10000;
        var geometry = new THREE.PlaneBufferGeometry( side, side );
        var material = new THREE.MeshLambertMaterial( {color: 0xffffff, ambient: 0xffffff,
            specular: 0xffffff, emissive: 0x333333, side: THREE.FrontSide} );
        var plane = new THREE.Mesh( geometry, material );
        plane.rotation.x -= Math.PI / 2;
        plane.position.set(0, -100, 0);
        scene.add( plane );
    };

    cardinal.onStartFunctions.addLensFlare = function(scene) {
        var textureFlare1 = THREE.ImageUtils.loadTexture( "media/models/cardinal/Flare_1.png");
        var textureFlare2 = THREE.ImageUtils.loadTexture( "media/models/cardinal/Flare_2.png");
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
        _.each(mesh.material.materials, function(m){m.opacity = 0;});
        cardinal.assets.cardinal_slice = mesh;
    };
    /***end on load functions***/

    /***on finish functions***/
    cardinal.onFinishLoadFunctions.playCamera = function(scene, loader) {
        loader.cameraHandler.play(cameraAnimations.animation_1.from, cameraAnimations.animation_1.to,
            function(){buttons.slice.add();});
    };

    cardinal.onFinishLoadFunctions.addWatch = function(scene, loader){
        watch.watch(loader.cameraHandler, "frame", function(prop, action, newValue, oldValue) {
            reactToFrame(oldValue);
        });
    };

    cardinal.onFinishLoadFunctions.storeLoader = function(scene, loader){
        cardinal.assets.loaderComponent = loader;
        //buttons.back.add();buttons.back.add();buttons.back.add();buttons.back.add();
    };
    /***end on finish functions***/

    function reactToFrame(frame){
        switch (frame){
            case 100: //anim 1 mid way, vertical window out of frustum
                cardinal.assets.cardinal_vertical.visible = true;
                break;
            case 156: //finished anim 1
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

    var buttons ={
        slice: {
            add: function(){
                events.AddButton({text:"go to slice", function: playAnim2, id:"goSlice",
                once: true});
            },
            remove: function(){ events.RemoveElementByID("goSlice"); }
        },
        back: {
            add: function(){
                events.AddButton({text:"back", function: backToMain, id:"back", once: true});
            },
            remove: function(){ events.RemoveElementByID("back"); }
        },
        sealantA:{
            add: function(){
                events.AddButton({text:"sealantA", function: sealantA,
                    id:"sealantA", once: true});
            },
            remove: function(){ events.RemoveElementByID("sealantA"); }
        }
    };

    //var zoomOnSlice = {
        function sealantA (){
            cardinal.assets.loaderComponent.cameraHandler.tween(cameraAnimations.animation_3.frame,
                cameraAnimations.animation_3.speed);
        }
    //};

    function playAnim2(){
        cardinal.assets.cardinal_slice.visible = true;
        buttons.slice.remove();

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
            cameraAnimations.animation_2.from, cameraAnimations.animation_2.to,
            function(){//on complete
                buttons.sealantA.add();
                buttons.back.add();
            }
        );
    }

    function backToMain(){
        cardinal.assets.cardinal_vertical.visible = true;
        buttons.back.remove();

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
            cameraAnimations.animation_2.to, cameraAnimations.animation_2.from,
            function(){buttons.slice.add();}//on complete
        );
    }

    return cardinal;
});