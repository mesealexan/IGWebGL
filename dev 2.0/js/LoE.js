define(["scene", "animate", "watch", "materials", "tween", "events", "particleSystem", "audio", "callback", "text", "underscore", "aeTween"],
function(scene, animate, watch, materials, tween, events, particleSystem, audio, callback, text, underscore, aeTween){
var LoEScene = {
  url: "loe"
  ,
  callbacks: {
    introAnimDone: {
      sampleCall1: function(){ console.log("finished intro animation"); }
    },
    hotBackground: {
      sampleCall2: function(){ console.log("background changed to hot"); }
    },
    coldBackground: {
      sampleCall3: function(){ console.log("background changed to cold"); }
    },
    mixedBackground: {
      sampleCall4: function(){ console.log("background changed to mixed"); }
    },
    coatFirstVisibleWindow: {
      sampleCall5: function(){ console.log("started coating first visible glass"); }
    },
    coatSecondVisibleWindow: {
      sampleCall5: function(){ console.log("started coating second visible glass"); }
    }
  }
  ,
  constructor: function () {
    var LoE = new scene();
    LoE.folderName = "LoE";
    LoE.addAssets([/*'EngineeredComfort',*/ /*'bck_1',*/ 'rail', 'plane', 'window', 'fixed_glass',
        'mobile_glass', 'tambur_a', 'tambur_b', 'window_shadow', /*'pouring',*/ 'rotator']);
    LoE.addSounds( [ 'LoE_conveyor', 'loe-apply-coating', 'LoE_glass_to_window_frame' ] );
    LoE.disposables = [];

    var coatingTime = 2700;
    var backgroundBlendTime = 600;
    var coatTexture = undefined;
    var LoE_textTexture = undefined;
    var hot_t = undefined;
    var colt_t = undefined;
    var mixed_t = undefined; //background plane textures

    /***on start functions***/
    LoE.onStartFunctions.storeScene = function(scene, loader) {
      LoE.assets.scene = scene;
      LoE.assets.loader = loader;
    }

    LoE.onStartFunctions.addLights = function(scene){
        scene.add( new THREE.AmbientLight( 0x999999 ) );

        var light1 = new THREE.PointLight( 0xffffff, 1, 10000 );
        light1.position.set( -12170,1063,-2025 );
        scene.add( light1 );

        var light2 = new THREE.PointLight( 0xffffff, 1, 10000 );
        light2.position.set( -4870,-163,-2469 );
        scene.add( light2 );

        var spotLight = new THREE.SpotLight( 0xffffff );
        spotLight.position.set( 18398, 13569, 17048 );
        spotLight.intensity = 1;
        scene.add( spotLight );
    };

    LoE.onStartFunctions.loadBackgroundTextures = function(){
        var folder = animate.loader.mediaFolderUrl+"/models/LoE/";
        hot_t = THREE.ImageUtils.loadTexture(folder + "hot.jpg");
        cold_t = THREE.ImageUtils.loadTexture(folder + "cold.jpg");
        mixed_t = THREE.ImageUtils.loadTexture(folder + "mixed.jpg");
    };

    LoE.onStartFunctions.makeText = function(scene){
       var string = "LoE coating production line"; //Ē not supported with current font
       var settings = {
         size: 120,
         curveSegments: 2,
         height: 8,
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
       var mat = new THREE.MeshBasicMaterial({transparent: true, color: 0x4A7082});

       LoE.assets.text = new THREE.Mesh(geom, mat);
       LoE.assets.text.rotation.x -= Math.PI / 2;
       LoE.assets.text.position.set(-12226 + centerOffset, -337, 1039 );
       LoE.disposables.push(LoE.assets.text);
       scene.add(LoE.assets.text);

       // line above E
       var cube = new THREE.Mesh( new THREE.BoxGeometry( 75, 1, 15 ),
        new THREE.MeshBasicMaterial( {color: 0x4A7082} ) );
       cube.position.set( -13256, -337, 919 );
       LoE.disposables.push( cube );
       scene.add( cube );
     };

    LoE.onStartFunctions.addBackPlane = function (scene) {
      var geom = new THREE.PlaneBufferGeometry(12000, 5000);
      var mesh = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({side:2}));
      LoE.assets.bck_1 = mesh;
      mesh.position.set(-8037.864, 4474.531, -3842.705);
      mesh.material = materials.textureFadeMaterial();
      mesh.rotation.copy(new THREE.Euler(
        -0.02269702535467891,
         0.42658893771436296,
         0.009392635892883978));
      scene.add( mesh );
    }
    /***end on start functions***/

    /***on load functions***/

    LoE.onLoadFunctions.rail = function ( mesh ) {
      LoE.disposables.push(mesh);
    };


    LoE.onLoadFunctions.rotator = function(mesh){
        mesh.position.set(-8310, -150, 0);
        mesh.rotateZ = animate.RotateZ;
        mesh.rotateZ(-1, 2000, Infinity);
        LoE.assets.rotator = mesh;
        addParticles(LoE.assets.scene);
        LoE.disposables.push(mesh);
    };

    LoE.onLoadFunctions.bck_1 = function(mesh){
        mesh.material = materials.textureFadeMaterial();
        //mesh.position.set(1500, 0, 2500)
        LoE.assets.bck_1 = mesh;
        var geometry = new THREE.PlaneGeometry( 5, 20, 32 );
        var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
        var plane = new THREE.Mesh( geometry, material );
        //scene.add( plane );
    };

    LoE.onLoadFunctions.plane = function(mesh){
        LoE.assets.plane = mesh;
        mesh.position.setZ(5500);
        mesh.material.materials[0].tweenOpacity = animate.TweenOpacity;
    };

    LoE.onLoadFunctions.tambur_a = function(mesh){
        LoE.assets.tambur_a = mesh;
        LoE.disposables.push(mesh);
    };

    LoE.onLoadFunctions.tambur_b = function(mesh, loader){
        var tamburRotateTime = 2777; //a complete rotation in ms
        var tambur_a_pos = loader.ParseJSON(animate.loader.mediaFolderUrl+'/models/LoE/tambur_a_pos.JSON');
        var tambur_b_pos = loader.ParseJSON(animate.loader.mediaFolderUrl+'/models/LoE/tambur_b_pos.JSON');

        for (var i = 0; i < 29; i++) {//29 meshed required
            var newTambur_a = new THREE.Mesh(mesh.geometry.clone(), mesh.material);
            var newTambur_b = new THREE.Mesh(LoE.assets.tambur_a.geometry.clone(), mesh.material);

            var curPos_a = tambur_a_pos.positions[i];
            var newTambur_a_pos = new THREE.Vector3(
                curPos_a.position.x, curPos_a.position.z, -curPos_a.position.y);

            var curPos_b = tambur_b_pos.positions[i];
            var newTambur_b_pos = new THREE.Vector3(
                curPos_b.position.x, curPos_b.position.z, -curPos_b.position.y);

            newTambur_a.position.copy(newTambur_a_pos);
            newTambur_b.position.copy(newTambur_b_pos);

            newTambur_a.rotateZ = animate.RotateZ;
            newTambur_b.rotateZ = animate.RotateZ;
            newTambur_a.rotateZ(1, tamburRotateTime, Infinity);
            newTambur_b.rotateZ(1, tamburRotateTime, Infinity);

            mesh.add(newTambur_a);
            mesh.add(newTambur_b);

            LoE.disposables.push(newTambur_a);
            LoE.disposables.push(newTambur_b);
        }
        LoE.assets.tambur_b = mesh;
    };

    LoE.onLoadFunctions.fixed_glass = function(mesh, loader){
        //mesh.visible = false;
        coatTexture = THREE.ImageUtils.loadTexture(animate.loader.mediaFolderUrl+'/models/LoE/coat1.png');
        LoE_textTexture = THREE.ImageUtils.loadTexture(animate.loader.mediaFolderUrl+'/models/LoE/coat1_text.png');
        var fixed_window_animation = loader.ParseJSON(animate.loader.mediaFolderUrl+'/models/LoE/fixed_glass_anim.JSON');
        animate.updater.addHandler(new animate.PositionHandler(mesh, fixed_window_animation));
        LoE.assets.fixed_glass = mesh;
        LoE.disposables.push(mesh);
    };

    LoE.onLoadFunctions.mobile_glass = function(mesh, loader){
        var mobile_window_animation = loader.ParseJSON(animate.loader.mediaFolderUrl+'/models/LoE/mobile_glass_anim.JSON');
        animate.updater.addHandler(new animate.PositionRotationHandler(mesh, mobile_window_animation));
        LoE.assets.mobile_glass = mesh;
        addSilverPlanes(loader);
        LoE.disposables.push(mesh);
    };

    LoE.onLoadFunctions.window = function ( mesh, loader ) {
        mesh.visible = false;
        var window_animation = loader.ParseJSON(animate.loader.mediaFolderUrl+'/models/LoE/window_animation.JSON');
        animate.updater.addHandler(new animate.PositionRotationHandler(mesh, window_animation));
        LoE.assets.window = mesh;
    };

    LoE.onLoadFunctions.window_shadow = function ( mesh ) {
      mesh.material = mesh.material.materials[0];
      mesh.frustumCulled = false;
      mesh.material.side = 2;
      mesh.position.set( -5948.14, 4100, -100 );
      mesh.rotation.x += Math.PI;
      mesh.rotation.y -= Math.PI / 6.2;
      mesh.transparent = true;
      mesh.opacity = 0;
      mesh.visible = false;
      LoE.assets.windowShadow = mesh;
    };
    /***end on load functions***/

    /***on finish functions***/
    LoE.onFinishLoadFunctions.increaseCamNear = function(){
        animate.camera.near = 2000;
        animate.camera.far = 12000;
        animate.camera.updateProjectionMatrix();
    };

    LoE.onFinishLoadFunctions.playCamera = function(scene, loader) {
      //x: -4489.42, y: 4651.72, z: 3962.66
       loader.cameraHandler.play(undefined,undefined,
         onCameraComplete,//from, to
         animate.Animate);

        function onCameraComplete () {
          animate.StartTimeout();
          //addBackPlane(scene);
        }


    };

    LoE.onFinishLoadFunctions.addWatch = function(scene, loader){
      watch.watch(loader.cameraHandler, "frame", function(prop, action, newValue, oldValue) {
          reactToFrame(oldValue);
      });
    };

    LoE.onFinishLoadFunctions.addControls = function(){
        var c = {
            noZoom: true,
            noPan: true,
            maxPolarAngle: 1.6,
            minPolarAngle: 1.55,
            rotateSpeed: 0.05,
            minAzimuthAngle: 0.3,
            maxAzimuthAngle: 0.5
        };

        events.AddControls(c);
        events.ToggleControls(false);
    };
    /***end on finish functions***/

    /***on unload functions***/
    LoE.onUnloadFunctions.resetCam = function(){
        animate.SetCameraDelaultValues();
    };

    LoE.buttons = {
        cold: {
            add: function(){
                events.AddButton({text:"Northern",
                    function: function(){LoE.manageBackgroundOpacity('cold')},
                    id:"cold", class:"coating-type"});
            }
        },
        hot: {
            add: function(){
                events.AddButton({text:"Southern",
                    function: function(){LoE.manageBackgroundOpacity('hot')},
                    id:"hot", class:"coating-type"});
            }
        },
        mixed: {
            add: function(){
                events.AddButton({text:"All-Climate",
                    function: function(){LoE.manageBackgroundOpacity('mixed')},
                    id:"mixed", class:"coating-type"});
            }
        }
    };

    function reactToFrame ( frame ) {
        switch (frame){
            case 0:
                audio.sounds.LoE_conveyor.setVolume(0);
                audio.sounds.LoE_conveyor.play();
                audio.sounds.LoE_conveyor.fadeTo(20, 1000);
                //audio.sounds.loefactoryloop.play();
                //audio.sounds.loefactoryloop.setVolume(0);
                //audio.sounds.loefactoryloop.fadeTo(20, 1000);
                break;
            case 169:
                LoE.assets.fixed_glass.plane4.material.tween(coatingTime);
                LoE.assets.silverPS.holder.visible = true;
                break;
            case 218:
                LoE.assets.silverPS.holder.visible = false;
                break;
            case 240:
                callback.go( LoEScene.callbacks.coatFirstVisibleWindow);
                LoE.assets.silverPS.holder.visible = true;
                LoE.assets.fixed_glass.plane5.material.tween(coatingTime);
                break;
            case 245: {
                audio.sounds.loeapplycoating.play();
                break;
            }
            case 288:
                LoE.assets.silverPS.holder.visible = false;
                break;
            case 310:
                callback.go( LoEScene.callbacks.coatSecondVisibleWindow);
                LoE.assets.silverPS.holder.visible = true;
                LoE.assets.mobile_glass.plane.material.tween(coatingTime);
                LoE.assets.window.visible = true;
                break;
            case 315:
                audio.sounds.loeapplycoating.play();
                //audio.sounds.loefactoryloop.fade(0.6, 0, 3000);
                //audio.sounds.loefactoryloop.fadeTo(0.6, 3000);
                break;
            case 358:
                LoE.assets.silverPS.holder.visible = false;
                break;
            case 375:
                break;
            case 405:
                audio.sounds.LoE_glass_to_window_frame.play();
            break;
            case 410:
                LoE.assets.mobile_glass.visible = false;
                break;
            case 450:
                LoE.enableBackground();
                break;
            case 469:
                LoE.buttons.cold.add();
                LoE.buttons.hot.add();
                LoE.buttons.mixed.add();
                break;
            case 498:
                callback.go( LoEScene.callbacks.introAnimDone);
                events.ToggleControls(true);
                clearDisposables();
                break;
        }
    }

    LoE.enableBackground = function () {
        var mat = LoE.assets.plane.material.materials[0];
        mat.transparent = true;
        mat.tweenOpacity(mat, 0, backgroundBlendTime);

        LoE.assets.windowShadow.visible = true;
        var tweenStart = new aeTween( LoE.assets.windowShadow.material );
        tweenStart.to({opacity: 1}, 20);
        tweenStart.start();
    }

    function clearDisposables(){
      _.each( LoE.disposables, function (d) { LoE.assets.loader.DisposeObject(d); });
    }

    function addSilverPlanes (loader) {
        var silver_Planes_pos = loader.ParseJSON(animate.loader.mediaFolderUrl+'/models/LoE/silverPlanes.JSON');
        var geometry = new THREE.PlaneBufferGeometry( 990 , 760 );
        var offsetX = 8301;
        var offsetY = 365;

        for (var i = 0; i < silver_Planes_pos.positions.length; i++) {
            var planeObj = new THREE.Mesh( geometry.clone(), silverCoatingMaterial(3.0));
            planeObj.rotation.x -= Math.PI / 2;
            planeObj.rotation.z += Math.PI;	//magic
            planeObj.position.set(
                silver_Planes_pos.positions[i].position.x + offsetX,
                silver_Planes_pos.positions[i].position.z + offsetY,
               -silver_Planes_pos.positions[i].position.y);

            LoE.assets.fixed_glass['plane' + (i + 1).toString()] = planeObj;
            LoE.assets.fixed_glass.add(planeObj);
            LoE.disposables.push(planeObj);

            /*var geometry = new THREE.BoxGeometry( 10, 10, 10 );
            var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
            var cube = new THREE.Mesh( geometry, material );
            cube.position.set(
                silver_Planes_pos.positions[i].position.x + offsetX,
                silver_Planes_pos.positions[i].position.z + offsetY,
               -silver_Planes_pos.positions[i].position.y);
            LoE.assets.fixed_glass.add( cube );*/
        }

        var planeObj = new THREE.Mesh( geometry.clone(), silverCoatingMaterial(3.0, LoE_textTexture) );
        planeObj.rotation.x += Math.PI / 2;
        planeObj.rotation.z += Math.PI / 2;
        planeObj.position.copy( LoE.assets.mobile_glass.position);
        planeObj.position.y += 15;

        LoE.disposables.push(planeObj);

        LoE.assets.mobile_glass.plane = planeObj;
        LoE.assets.mobile_glass.add(planeObj);
    }

    function silverCoatingMaterial (size, secondary_t) {
        var hasSecondary = 0;
        if (secondary_t) hasSecondary = 1.0;
        //coat1
        var material = new THREE.ShaderMaterial({
            uniforms: {
                primary_t: {type: "t", value: coatTexture},
                secondary_t: {type: "t", value: secondary_t},
                hasSecondary: {type: "f", value: hasSecondary},
                start: {type: 'f', value: 1.104},
                size: {type: 'f', value: size},
                discard_f: {type: 'f', value: 1.1},
                maxColor: {type: 'f', value: 1.0}
            },
            attributes: {},
            vertexShader: vShader(),
            fragmentShader: fShader(),
            transparent: true,
            side: 2
        });
        material.tween = tween;
        material.depthTest = true;
        material.depthWrite = true;
        return material;

        function vShader() {
            return "" +
                "varying vec2 vUv;" +
                "void main(){" +
                "vUv = uv;" +
                "gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);}"
        }

        function fShader() {
            return "varying vec2 vUv;" +
                "uniform sampler2D primary_t;" +
                "uniform sampler2D secondary_t;" +
                "uniform float start;" +
                "uniform float size;" +
                "uniform float maxColor;" +
                "uniform float discard_f;" +
                "uniform float hasSecondary;" +
                "void main() {" +
                  "float color = 0.0;" +
                  "vec2 vUvInv = vec2( 1. - vUv.x, vUv.y );" + //flip uv coord for text
                  "color = ( ( vUv.x * size ) + maxColor ) + start;" +
                  "if ( hasSecondary == 1.0 ) {" +
                    "if ( color >= discard_f + maxColor ) discard;" +
                    "else if ( color > 0. ) gl_FragColor = ( color * texture2D( primary_t, vUv ) ) +" +
                    "texture2D( secondary_t, vUvInv );" +
                    "else gl_FragColor = texture2D( secondary_t, vUvInv );" +
                  "}" +
                  "else if ( hasSecondary != 1.0 ) {" +
                    "if ( color >= discard_f + maxColor ) gl_FragColor = " +
                      "vec4( 0., 0., 0., 0.);" +
                    "else if ( color > 0. ) gl_FragColor = ( color * texture2D( primary_t, vUv ) );"+
                    "else if ( start < 0. ) discard;" +
                  "}" +
                "}"
        }

        function tween(time, delay, repeat){
            /*var tweenStart = new TWEEN.Tween( this.uniforms.start );
            if(repeat != undefined) tweenStart.repeat( repeat );
            if(delay != undefined) tweenStart.delay( delay );
            tweenStart.to( { value: -this.uniforms.size.value - this.uniforms.maxColor.value },
                time);
            tweenStart.start();*/

            var tweenStart = new aeTween( this.uniforms.start );
            tweenStart.to({value: -this.uniforms.size.value - this.uniforms.maxColor.value}, 78);
            tweenStart.start();
        }
    }

    LoE.manageBackgroundOpacity = function(to) {
        var tweenTo;
        switch (to){
          case "cold":
            tweenTo = cold_t;
            break;
          case "hot":
            tweenTo = hot_t;
            break;
          case "mixed":
            tweenTo = mixed_t;
            break;
          default:
            console.error("Unspecified background!");
        }

        callback.go( LoEScene.callbacks[to+"Background"]);
        LoE.assets.bck_1.material.tween(tweenTo, backgroundBlendTime);
    }

    function addParticles(scene){
      var geometry = new THREE.SphereGeometry( 5, 6, 6 );
      var material = new THREE.MeshBasicMaterial({color:0xC0C0C0});//materials.setMaterials("LoE", {name:"metal"});
      var sphere = new THREE.Mesh( geometry, material );

      var silverSettings = {
          width: 50,
          height: 100,
          depth: 700,
          num: 200,
          meshes: [sphere],
          pos: new THREE.Vector3(-8310, -150, 0),
          dir: new THREE.Vector3(0, -1, 0),
          speed: 20,
          rndRotInit: true
      };

      LoE.assets.silverPS = new particleSystem(silverSettings);
      LoE.assets.silverPS.Init(LoE.assets.scene);
    }

    return LoE;
  }
};
return LoEScene;
});
