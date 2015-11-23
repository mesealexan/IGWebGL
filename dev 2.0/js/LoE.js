define(["animate", "watch", "materials", "tween", "events", "particleSystem", "audio"],
    function(animate, watch, materials, tween, events, particleSystem, audio){
    var LoE = {
      soundNames: ['loe-factory-loop', 'loe-apply-coating'],
      folderName: "LoE",
      assetNames: ['text', 'bck_1', 'rail', 'plane', 'window', 'fixed_glass',
          'mobile_glass', 'tambur_a', 'tambur_b', 'window_shadow', 'pouring', 'rotator'],
      onStartFunctions: {},
      onLoadFunctions: {},
      onFinishLoadFunctions: {},
      assets: {}
    };

    var coatingTime = 2700;
    var backgroundBlendTime = 600;
    var coatTexture = undefined;
    var LoE_textTexture = undefined;
    var hot_t = undefined,
        colt_t = undefined,
        mixed_t = undefined; //background plane textures

    /***on start functions***/
    LoE.onStartFunctions.storeScene = function(scene) {
      LoE.assets.scene = scene;
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
    /***end on start functions***/

    /***on load functions***/

    LoE.onLoadFunctions.fixed_glass = function(mesh){
      LoE.assets.fixed_glass = mesh;
    };

    LoE.onLoadFunctions.pouring = function(mesh){
      LoE.assets.pouring = mesh;
      mesh.visible= false;
    };

    LoE.onLoadFunctions.rotator = function(mesh){
        mesh.position.set(-8310, -150, 0);
        mesh.rotateZ = animate.RotateZ;
        mesh.rotateZ(-1, 2000, Infinity);
        LoE.assets.rotator = mesh;
        addParticles(LoE.assets.scene);
    };

    LoE.onLoadFunctions.bck_1 = function(mesh){
        mesh.material = materials.textureFadeMaterial();
        LoE.assets.bck_1 = mesh;
    };

    LoE.onLoadFunctions.plane = function(mesh){
        LoE.assets.plane = mesh;
        mesh.position.setZ(5500);
        mesh.material.materials[0].tweenOpacity = animate.TweenOpacity;
    };

    LoE.onLoadFunctions.tambur_a = function(mesh){
        LoE.assets.tambur_a = mesh;
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
        }
        LoE.assets.tambur_b = mesh;
    };

    LoE.onLoadFunctions.fixed_glass = function(mesh, loader){
        coatTexture = THREE.ImageUtils.loadTexture(animate.loader.mediaFolderUrl+'/models/LoE/coat1.png');
        LoE_textTexture = THREE.ImageUtils.loadTexture(animate.loader.mediaFolderUrl+'/models/LoE/coat1_text.png');
        var fixed_window_animation = loader.ParseJSON(animate.loader.mediaFolderUrl+'/models/LoE/fixed_glass_anim.JSON');
        animate.updater.addHandler(new animate.PositionHandler(mesh, fixed_window_animation));
        LoE.assets.fixed_glass = mesh;
    };

    LoE.onLoadFunctions.mobile_glass = function(mesh, loader){
        var mobile_window_animation = loader.ParseJSON(animate.loader.mediaFolderUrl+'/models/LoE/mobile_glass_anim.JSON');
        animate.updater.addHandler(new animate.PositionRotationHandler(mesh, mobile_window_animation));
        LoE.assets.mobile_glass = mesh;
        addSilverPlanes(loader);
    };

    LoE.onLoadFunctions.window = function(mesh, loader){
        var window_animation = loader.ParseJSON(animate.loader.mediaFolderUrl+'/models/LoE/window_animation.JSON');
        animate.updater.addHandler(new animate.PositionRotationHandler(mesh, window_animation));
    };

    LoE.onLoadFunctions.window_shadow = function(mesh){
        LoE.assets.window_shadow = mesh;
    };
    /***end on load functions***/

    /***on finish functions***/
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

    LoE.buttons = {
        cold: {
            add: function(){
                events.AddButton({text:"cold",
                    function: function(){LoE.manageBackgroundOpacity('cold')},
                    id:"cold"});
            }
        },
        hot: {
            add: function(){
                events.AddButton({text:"hot",
                    function: function(){LoE.manageBackgroundOpacity('hot')},
                    id:"hot"});
            }
        },
        mixed: {
            add: function(){
                events.AddButton({text:"mixed",
                    function: function(){LoE.manageBackgroundOpacity('mixed')},
                    id:"mixed"});
            }
        }
    };

    function reactToFrame(frame){
        switch (frame){
            case 0: {
                audio.sounds.loefactoryloop.play();
                audio.sounds.loefactoryloop.fade(0, 0.6, 7000);
                break;
            }
            case 169:
                LoE.assets.fixed_glass.plane4.material.tween(coatingTime);
                LoE.assets.silverPS.holder.visible = true;
                break;
            case 218:
                LoE.assets.silverPS.holder.visible = false;
                break;
            case 240:
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
                LoE.assets.silverPS.holder.visible = true;
                LoE.assets.mobile_glass.plane.material.tween(coatingTime);
                break;
            case 315: {
                audio.sounds.loeapplycoating.play();
                audio.sounds.loefactoryloop.fade(0.6, 0, 3000);
                break;
            }
            case 358:
                LoE.assets.silverPS.holder.visible = false;
                break;
            case 375:
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
            case 499:
                events.ToggleControls(true);
                break;
        }
    }

     LoE.enableBackground = function () {
        var mat = LoE.assets.plane.material.materials[0];
        mat.transparent = true;
        mat.tweenOpacity(mat, 0, backgroundBlendTime);
    }

    function addSilverPlanes (loader) {
        var silver_Planes_pos = loader.ParseJSON(animate.loader.mediaFolderUrl+'/models/LoE/silverPlanes.JSON');
        var geometry = new THREE.PlaneBufferGeometry( 990 , 760 );
        var offsetX = 8301;
        var offsetY = 365;

        for (var i = 0; i < silver_Planes_pos.positions.length; i++) {
            var planeObj = new THREE.Mesh( geometry.clone(), silverCoatingMaterial(3.0));
            planeObj.rotation.x -= Math.PI / 2;
            planeObj.rotation.z += Math.PI;																			             //magic
            planeObj.position.set(
                silver_Planes_pos.positions[i].position.x + offsetX,
                silver_Planes_pos.positions[i].position.z + offsetY,
               -silver_Planes_pos.positions[i].position.y);

            LoE.assets.fixed_glass['plane' + (i + 1).toString()] = planeObj;
            LoE.assets.fixed_glass.add(planeObj);
        }

        planeObj = new THREE.Mesh( geometry.clone(), silverCoatingMaterial(3.0, LoE_textTexture) );
        planeObj.rotation.x += Math.PI / 2;
        planeObj.rotation.z += Math.PI / 2;
        planeObj.position.copy( LoE.assets.mobile_glass.position);
        planeObj.position.y += 5;

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
            side: 2,
            color: new THREE.Color("rgb(200,200,0)"),
            ambient: new THREE.Color("rgb(211,211,0)"),
            specular: new THREE.Color("rgb(222,222,0)"),
            shininess: 3
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
            return "" +
                "varying vec2 vUv;" +
                "uniform sampler2D primary_t;" +
                "uniform sampler2D secondary_t;" +
                "uniform float start;" +
                "uniform float size;" +
                "uniform float maxColor;" +
                "uniform float discard_f;" +
                "uniform float hasSecondary;" +
                "void main(){" +
                "float color = 0.0;" +
                "vec2 vUvInv = vec2(1. - vUv.x, vUv.y);" + //flip uv coord for text
                "color = ((vUv.x * size) + maxColor) + start;" +
                "if (hasSecondary == 1.0) {" +
                "if (color >= discard_f + maxColor) discard;" +
                "else if (color > 0.) gl_FragColor = (color * texture2D(primary_t, vUv)) + " +
                "texture2D(secondary_t, vUvInv);" +
                "else gl_FragColor = texture2D(secondary_t, vUvInv);}" +
                "else {" +
                "if (color >= discard_f + maxColor) discard;" +
                "else if (color > 0.) gl_FragColor = (color * texture2D(primary_t, vUv));}}"
        }

        function tween(time, delay, repeat){
            var tweenStart = new TWEEN.Tween( this.uniforms.start );
            if(repeat != undefined) tweenStart.repeat( repeat );
            if(delay != undefined) tweenStart.delay( delay );
            tweenStart.to( { value: -this.uniforms.size.value - this.uniforms.maxColor.value },
                time);
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

        LoE.assets.bck_1.material.tween(tweenTo, backgroundBlendTime);
    }

    function addParticles(scene){
      var geometry = new THREE.SphereGeometry( 10, 6, 6 );
      var material = materials.setMaterials("LoE", {name:"metal"});
      var sphere = new THREE.Mesh( geometry, material );

      var silverSettings = {
          width: 50,
          height: 100,
          depth: 700,
          num: 150,
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
});
