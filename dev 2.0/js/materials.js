define(["three", "animate"], function(THREE, animate){
    var textureCube = undefined;
    var cloudCube = undefined;

    var materials = {
      cloudCube: undefined,
      makeTextureCube: function ( mediaFolderUrl ) {
        var imagePrefix = mediaFolderUrl+"/skybox/Cube_";
        var directions  = ["r", "l", "u", "d", "f", "b"];
        var imageSuffix = ".jpg";
        var urls = [];
        for ( var i = 0; i < 6; i++ )
            urls.push(imagePrefix + directions[i] + imageSuffix);
        textureCube = THREE.ImageUtils.loadTextureCube( urls, THREE.CubeRefractionMapping );
        //materials.cloudCube = textureCube;
    }
    ,
    makeCloudTextureCube: function ( mediaFolderUrl ) {
        var imagePrefix = mediaFolderUrl+"/skybox/clouds_scrolling2";
        var imageSuffix = ".jpg";
        var urls = [];
        for ( var a = 0; a < 6; a++ )
          urls.push(imagePrefix + imageSuffix);
        materials.cloudCube = THREE.ImageUtils.loadTextureCube( urls, THREE.CubeRefractionMapping );
    }
    ,
    makeGloomyTextureCube: function ( mediaFolderUrl ) {
        var imagePrefix = mediaFolderUrl+"/skybox/gloomyClouds";
        var imageSuffix = ".jpg";
        var urls = [];
        for ( var a = 0; a < 6; a++ )
          urls.push(imagePrefix + imageSuffix);
        materials.gloomyCloudsCube = THREE.ImageUtils.loadTextureCube( urls, THREE.CubeRefractionMapping );
    }
  };

    materials.setMaterials = function(folderName, material){
        var material;
        var materialName = folderName + material.name;
        var url = this.mediaFolderUrl+"/models/"+folderName+"/";

        switch(materialName){
          case 'tornadochecker':
          material = new THREE.MeshPhongMaterial({
              map: THREE.ImageUtils.loadTexture(url+'checker.jpg')
          });
          break;
            case 'LoEpouring':
                material = new THREE.MeshLambertMaterial({
                    color: new THREE.Color("rgb(170,10,243)"),
                    ambient: new THREE.Color("rgb(170,10,243)"),
                    specular: new THREE.Color("rgb(255,255,255)"),
                    transparent: false,
                    opacity: 0.5,
                    blending: THREE.AdditiveBlending
                });
            break;
            case 'LoEtambur':
                material = new THREE.MeshPhongMaterial({
                    color: new THREE.Color("rgb(125,125,125)"),
                    ambient: new THREE.Color("rgb(125,125,125)"),
                    specular: new THREE.Color("rgb(255,255,255)"),
                    map: THREE.ImageUtils.loadTexture(url+'tambur.jpg'),
                    //bumpMap: THREE.ImageUtils.loadTexture(url+'tambur_bump.jpg'),
                    //bumpScale: 1,
                    shininess: 11
                });
                break;
            case 'LoEmetal':
                material = new THREE.MeshLambertMaterial({
                    color: new THREE.Color("rgb(116,116,116)"),
                    ambient: new THREE.Color("rgb(66,66,66)"),
                    specular: new THREE.Color("rgb(222,222,222)"),
                    shininess: 16,
                    metal: true
                });
                break;
            case 'LoErotator':
                material = new THREE.MeshPhongMaterial({
                    color: new THREE.Color("rgb(200,200,200)"),
                    ambient: new THREE.Color("rgb(211,211,211)"),
                    specular: new THREE.Color("rgb(222,222,222)"),
                    shininess: 3,
                    metal: true,
                    vertexColors: THREE.VertexColors,
                    envMap: textureCube,
                    reflectivity: 0.69
                });
            break;
            case 'LoErail':
                material = new THREE.MeshLambertMaterial({
                    color: new THREE.Color("rgb(47,83,174)"),
                    ambient: new THREE.Color("rgb(0,49,174)"),
                    specular: new THREE.Color("rgb(255,255,255)"),
                    shininess: 11,
                    metal: true,
                    vertexColors: THREE.VertexColors,
                    envMap: textureCube,
                    reflectivity: 0.19
                });
                break;
            case 'LoEsealant a':
                material = new THREE.MeshLambertMaterial({
                    color: new THREE.Color("rgb(161,161,161)"),
                    ambient: new THREE.Color("rgb(116,116,116)"),
                    specular: new THREE.Color("rgb(255,255,255)")
                });
                break;
            case 'LoEsealant b':
                material = new THREE.MeshLambertMaterial({
                    color: new THREE.Color("rgb(213,213,213)"),
                    ambient: new THREE.Color("rgb(116,116,116)"),
                    specular: new THREE.Color("rgb(255,255,255)")
                });
                break;
            case 'LoESpacer':
                material = new THREE.MeshLambertMaterial({
                    color: new THREE.Color("rgb(213,213,213)"),
                    ambient: new THREE.Color("rgb(222,222,222)"),
                    specular: new THREE.Color("rgb(255,255,255)")
                });
                break;
            case 'LoESpacer Cap':
                material = new THREE.MeshLambertMaterial({
                    color: new THREE.Color("rgb(213,213,213)"),
                    ambient: new THREE.Color("rgb(116,116,116)"),
                    specular: new THREE.Color("rgb(255,255,255)")
                });
                break;
            case 'LoEGlass':
                material = new THREE.MeshLambertMaterial({
                    color: new THREE.Color("rgb(255,255,255)"),
                    specular: new THREE.Color("rgb(0,80,60)"),
                    vertexColors: THREE.VertexColors,
                    envMap: textureCube,
                    refractionRatio: 0.985,
                    reflectivity: 0.99,
                    shininess: 30,
                    transparent: true,
                    opacity: 0.61
                });
                break;
            case 'LoEGlass Sides':
                material = new THREE.MeshLambertMaterial({
                    color: new THREE.Color("rgb(46,56,31)"),
                    ambient: new THREE.Color("rgb(46,56,31)"),
                    emissive: new THREE.Color("rgb(46,56,31)"),
                    specular: new THREE.Color("rgb(0,80,60)"),
                    envMap: textureCube,
                    refractionRatio: 0.985,
                    reflectivity: 0.99,
                    shininess: 30,
                    transparent: true,
                    opacity: 0.96
                });
                break;
            case 'LoEp1 op':
                material = new THREE.MeshLambertMaterial({
                    color: new THREE.Color("rgb(0,0,0)"),
                    ambient: new THREE.Color("rgb(0,0,0)"),
                    specular: new THREE.Color("rgb(0,0,0)"),
                    map: THREE.ImageUtils.loadTexture(url+'tambur_bump.jpg'),
                    transparent: true
                });
                break;
            case 'LoEp2 op':
                material = new THREE.MeshLambertMaterial({
                    color: new THREE.Color("rgb(0,0,0)"),
                    ambient: new THREE.Color("rgb(0,0,0)"),
                    specular: new THREE.Color("rgb(0,0,0)"),
                    map:  THREE.ImageUtils.loadTexture(url+'p2_op.png')
                });
                break;
            case 'LoEplane':
                material = new THREE.MeshLambertMaterial({
                    color: new THREE.Color("rgb(250,250,250)"),
                    //emissive: new THREE.Color("rgb(250,250,250)"),
                    specular: new THREE.Color("rgb(255,255,255)"),
                    emissive: new THREE.Color("rgb(61,61,61)")
                });
                break;
            case 'LoEtext':
                material = new THREE.MeshLambertMaterial({
                    color: new THREE.Color("rgb(113,106,76)"),
                    ambient: new THREE.Color("rgb(78,63,28)"),
                    specular: new THREE.Color("rgb(191,188,175)"),
                    emissive: new THREE.Color("rgb(78,66,37)")
                });
                break;
            case 'LoEdesicant':
                material = new THREE.MeshLambertMaterial({
                    color: new THREE.Color("rgb(255,255,255)"),
                    ambient: new THREE.Color("rgb(255,255,255)")
                });
                break;
            case 'LoESpacer slice':
                material = new THREE.MeshPhongMaterial({
                    color: new THREE.Color("rgb(213,213,213)"),
                    ambient: new THREE.Color("rgb(222,222,222)"),
                    specular: new THREE.Color("rgb(255,255,255)"),
                    envMap: textureCube,
                    refractionRatio: 0.985,
                    reflectivity: 0.99,
                    shininess: 30
                });
                break;
            case 'i89logo':
                material = new THREE.MeshLambertMaterial({
                    map: THREE.ImageUtils.loadTexture(url+'logo.png')
                });
                break;

            case 'i89window_plane':
                material = new RadialGradientMaterial();
                break;
            case 'i89Spacer':
                material = new THREE.MeshPhongMaterial({
                    color: new THREE.Color("rgb(213,213,213)"),
                    ambient: new THREE.Color("rgb(222,222,222)"),
                    specular: new THREE.Color("rgb(255,255,255)")
                });
                break;

            case 'i89Spacer Cap':
                material = new THREE.MeshPhongMaterial({
                    color: new THREE.Color("rgb(213,213,213)"),
                    ambient: new THREE.Color("rgb(116,116,116)"),
                    specular: new THREE.Color("rgb(255,255,255)")
                });
                break;

            case 'i89Glass':
                material = new THREE.MeshPhongMaterial({
                    color: new THREE.Color("rgb(255,255,255)"),
                    specular: new THREE.Color("rgb(0,80,60)"),
                    vertexColors: THREE.VertexColors,
                    envMap: textureCube,
                    refractionRatio: 0.985,
                    reflectivity: 0.99,
                    shininess: 30,
                    transparent: true,
                    opacity: 0.61
                });
                break;

            case 'i89Glass Sides':
                material = new THREE.MeshPhongMaterial({
                    color: new THREE.Color("rgb(46,56,31)"),
                    ambient: new THREE.Color("rgb(46,56,31)"),
                    emissive: new THREE.Color("rgb(46,56,31)"),
                    specular: new THREE.Color("rgb(0,80,60)"),
                    envMap: textureCube,
                    refractionRatio: 0.985,
                    reflectivity: 0.99,
                    shininess: 30,
                    transparent: true,
                    opacity: 0.96
                });
                break;

            case 'i89window frame':
                material = new THREE.MeshLambertMaterial({
                    color: new THREE.Color("rgb(10,4,3)"),
                    ambient: new THREE.Color("rgb(22,16,15)"),
                    specular: new THREE.Color("rgb(255,255,255)")
                });
                break;

            case 'i89heat wave':
                material = new THREE.MeshPhongMaterial({
                    color: new THREE.Color("rgb(223,116,20)"),
                    ambient: new THREE.Color("rgb(223,116,20)"),
                    specular: new THREE.Color("rgb(230,220,60)"),
                    emissive: new THREE.Color("rgb(223,116,20)"),
                    opacity: 0.35,
                    transparent: true,
                    morphTargets : true,
                    depthWrite: true,
                    depthTest: true
                });
                break;

            case 'i89text':
                material = new THREE.MeshLambertMaterial({
                    color: new THREE.Color("rgb(27,12,8)"),
                    ambient: new THREE.Color("rgb(27,12,8)"),
                    specular: new THREE.Color("rgb(27,12,8)"),
                    emissive: new THREE.Color("rgb(27,12,8)")
                });
                break;

            case 'i89snow':
                material = new THREE.MeshLambertMaterial({
                    map: THREE.ImageUtils.loadTexture(url+'snow.jpg')
                });
                break;

            case 'i89background':
                material = new THREE.MeshLambertMaterial({
                    map: THREE.ImageUtils.loadTexture(url+'bck.jpg')
                });
                break;

            case 'i89wall1':
                material = new THREE.MeshLambertMaterial({
                    color: new THREE.Color("rgb(69,30,15)"),
                    ambient: new THREE.Color("rgb(69,30,15)"),
                    specular: new THREE.Color("rgb(255,255,255)")
                });
                break;

            case 'i89metal':
                material = new THREE.MeshPhongMaterial({
                    color: new THREE.Color("rgb(34,34,34)"),
                    ambient: new THREE.Color("rgb(61,61,61)"),
                    specular: new THREE.Color("rgb(255,255,255)"),
                    metal: true,
                    shininess: 60
                });
                break;

            case 'i89wall2':
                material = new THREE.MeshLambertMaterial({
                    color: new THREE.Color("rgb(212,175,122)"),
                    ambient: new THREE.Color("rgb(212,175,122)"),
                    specular: new THREE.Color("rgb(255,255,255)")
                });
                break;

            case 'i89concrete':
                material = new THREE.MeshLambertMaterial({
                    color: new THREE.Color("rgb(125,125,125)"),
                    ambient: new THREE.Color("rgb(125,125,125)"),
                    specular: new THREE.Color("rgb(255,255,255)")
                });
                break;

            case 'i89outer wall':
                material = new THREE.MeshPhongMaterial({
                    color: new THREE.Color("rgb(217,216,219)"),
                    ambient: new THREE.Color("rgb(125,125,125)"),
                    specular: new THREE.Color("rgb(191,172,233)")
                });
                break;

            case 'i89moon':
                material = new THREE.MeshPhongMaterial({
                    emissive: new THREE.Color(0x555555),
                    map: THREE.ImageUtils.loadTexture(url+'moon.jpg')
                });
                break;

            case 'i89wood':
                var bump = THREE.ImageUtils.loadTexture(url+'floor_b.jpg');
                material = new THREE.MeshPhongMaterial({
                    color: new THREE.Color("rgb(125,125,125)"),
                    ambient: new THREE.Color("rgb(125,125,125)"),
                    specular: new THREE.Color("rgb(169,119,70)"),
                    bumpMap: bump,
                    bumpScale: 1,
                    shininess: 8,
                    map: THREE.ImageUtils.loadTexture(url+'floor.jpg')
                });
                break;

            case 'i89grid':
                var map = THREE.ImageUtils.loadTexture(url+'grid.jpg');
                map.wrapS = THREE.RepeatWrapping;
                map.wrapT = THREE.RepeatWrapping;
                map.repeat.x = 12;
                map.repeat.y = 12;

                material = new THREE.MeshLambertMaterial({
                    color: new THREE.Color("rgb(125,125,125)"),
                    ambient: new THREE.Color("rgb(125,125,125)"),
                    specular: new THREE.Color("rgb(255,255,255)"),
                    map: map
                });
                break;
            case 'cardinalOuter':
                material = new THREE.MeshPhongMaterial({
                    color: new THREE.Color("rgb(199,199,199)"),
                    specular: new THREE.Color("rgb(255,255,255)"),
                    map: THREE.ImageUtils.loadTexture(url+'Outer_Diffuse.jpg'),
                    bumpMap: THREE.ImageUtils.loadTexture(url+'Outer_Diffuse.jpg'),
                    bumpScale: 2,
                    shininess: 30
                });
                break;
            case 'cardinalsealant a':
                material = new THREE.MeshPhongMaterial({
                    color: new THREE.Color("rgb(161,161,161)"),
                    ambient: new THREE.Color("rgb(116,116,116)"),
                    specular: new THREE.Color("rgb(255,255,255)"),
                });
                break;
            case 'cardinalsealant b':
                material = new THREE.MeshPhongMaterial({
                    color: new THREE.Color("rgb(213,213,213)"),
                    ambient: new THREE.Color("rgb(116,116,116)"),
                    specular: new THREE.Color("rgb(255,255,255)"),

                });
                break;
            case 'cardinalSpacer':
                material = new THREE.MeshPhongMaterial({
                    color: new THREE.Color("rgb(160,160,160)"),
                    ambient: new THREE.Color("rgb(222,222,222)"),
                    specular: new THREE.Color("rgb(255,255,255)")
                });
                break;
            case 'cardinalSpacer Cap':
                material = new THREE.MeshPhongMaterial({
                    color: new THREE.Color("rgb(150,150,150)"),
                    ambient: new THREE.Color("rgb(116,116,116)"),
                    specular: new THREE.Color("rgb(255,255,255)"),
                    normalMap: THREE.ImageUtils.loadTexture(url+'spacer.jpg')//,
                    //envMap: textureCube
                });
                break;
            case 'cardinalGlass':
                material = new THREE.MeshPhongMaterial({
                    color: new THREE.Color("rgb(255,255,255)"),
                    //ambient: new THREE.Color("rgb(255,1,0)"),
                    specular: new THREE.Color("rgb(0,80,60)"),
                    //vertexColors: THREE.VertexColors,
                    envMap: textureCube,
                    refractionRatio: 0.985,
                    reflectivity: 0.99,
                    shininess: 30,
                    transparent: true,
                    //side: 2,
                    opacity: 0.66
                });
                break;
            case 'cardinalGlass Sides':
                material = new THREE.MeshPhongMaterial({
                    color: new THREE.Color("rgb(46,56,31)"),
                    ambient: new THREE.Color("rgb(46,56,31)"),
                    emissive: new THREE.Color("rgb(46,56,31)"),
                    specular: new THREE.Color("rgb(0,80,60)"),
                    envMap: textureCube,
                    refractionRatio: 0.985,
                    reflectivity: 0.99,
                    shininess: 30,
                    transparent: true,
                    opacity: 0.96
                });
                break;
            case 'cardinalp1 op':
                material = new THREE.MeshLambertMaterial({
                    color: new THREE.Color("rgb(0,0,0)"),
                    ambient: new THREE.Color("rgb(0,0,0)"),
                    specular: new THREE.Color("rgb(0,0,0)"),
                    map: THREE.ImageUtils.loadTexture(url+'p1_op.png'),
                    transparent: true
                });
                break;
            case 'cardinalp2 op':
                material = new THREE.MeshLambertMaterial({
                    color: new THREE.Color("rgb(0,0,0)"),
                    ambient: new THREE.Color("rgb(0,0,0)"),
                    specular: new THREE.Color("rgb(0,0,0)"),
                    map:  THREE.ImageUtils.loadTexture(url+'p2_op.png'),
                    transparent: true
                });
                break;
            case 'cardinalplane':
                material = new THREE.MeshLambertMaterial({
                    color: new THREE.Color("rgb(255,255,255)"),
                    ambient: new THREE.Color("rgb(255,255,255)"),
                    specular: new THREE.Color("rgb(255,255,255)"),
                    visible: false
                });
                break;
            case 'cardinaltext':
                material = new THREE.MeshLambertMaterial({
                    color: new THREE.Color("rgb(113,106,76)"),
                    ambient: new THREE.Color("rgb(113,106,76)"),
                    specular: new THREE.Color("rgb(191,188,175)"),
                    emissive: new THREE.Color("rgb(113,106,76)")

                });
                break;
            case 'cardinaldesicant':
                material = new THREE.MeshPhongMaterial({
                    color: new THREE.Color("rgb(198,204,151)"),
                    ambient: new THREE.Color("rgb(198,204,151)"),
                    specular: new THREE.Color("rgb(116,116,255)"),
                    shininess: 6

                });
                break;
            case 'cardinalSpacer slice':
                material = new THREE.MeshPhongMaterial({
                    color: new THREE.Color("rgb(213,213,213)"),
                    ambient: new THREE.Color("rgb(222,222,222)"),
                    specular: new THREE.Color("rgb(255,255,255)"),
                    envMap: textureCube,
                    refractionRatio: 0.985,
                    reflectivity: 0.99,
                    shininess: 30
                });
                break;
            case 'neatGlass':
            case 'neatneatGlass':
            case 'neatstandardGlass':
            case 'neatGlass non animated':
                material = new THREE.MeshPhongMaterial({
                    color: new THREE.Color("rgb(220,255,220)"),
                    ambient: new THREE.Color("rgb(255,255,255)"),
                    specular: new THREE.Color("rgb(0,80,60)"),
                    //vertexColors: THREE.VertexColors,
                    envMap: materials.cloudCube,
                    refractionRatio: 0.985,
                    reflectivity: 0.99,
                    shininess: 30,
                    transparent: true,
                    opacity: 0.7
                });
                break;
            default://no custom mat, extract it
                material = extractMaterialFromJSON(folderName, material);
                break;
        }
        material.name = materialName;
        material.defaultEmissive = material.emissive;
        material.defaultColor = material.color;
        material.maxOpacity = material.opacity;
        return material;
    };

    materials.NeatGlassDirt = function(settings){
        var _this = this;
        var dirtMap = THREE.ImageUtils.loadTexture(materials.mediaFolderUrl+'/models/neat/Dirt_wind_diff.jpg');
        var dirtOpac = THREE.ImageUtils.loadTexture(materials.mediaFolderUrl+'/models/neat/Dirt_opacity_map.jpg');
        var dirtySpeed = 0.01;
        var opacSpeed = 0.01;
        var maxDirt = settings.maxDirt;
        this.isClean = true;
        this.startOnce = undefined;
        this.keepOpac = undefined;
        this.minVal = 0;

        this.uniforms = {
            map: { type: 't', value: dirtMap },
            opacMap: { type: 't', value: dirtOpac },
            opacVal: { type: 'f', value: -0.1 },
            curVal: { type: 'f', value: 0 },
            maxVal: { type: 'f', value: maxDirt },
            time: { type: 'f', value: 3 }
        };

        this.vertexShader = vSh();
        this.fragmentShader = fSh();
        this.transparent = true;
        this.update = function(){
            this.uniforms.curVal.value += dirtySpeed;
            if(!this.keepOpac)this.uniforms.opacVal.value += opacSpeed;

            if(this.uniforms.curVal.value >= this.uniforms.maxVal.value)
                this.Stop();

            if(this.uniforms.curVal.value < _this.minVal) this.Stop();

        };

        function vSh(){
            return[
                "varying float time;",
                "varying vec2 vUv;"+
                "void main(){"+
                "vUv = uv;"+
                "vec3 pos = position;",
                "gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );}"
            ].join('\n');
        }

        function fSh(){
            return[
                "varying float time;",
                "uniform sampler2D map;",
                "uniform sampler2D opacMap;",
                "uniform float opacVal;",
                "uniform float curVal;",
                "uniform float maxVal;",
                "varying vec2 vUv;",

                "void main() {",
                "vec3 mapColor = texture2D( map, vUv ).xyz;",
                "vec3 opacColor = texture2D( opacMap, vUv ).xyz;",
                "if(opacColor.y >= curVal) discard; ",
                "gl_FragColor = vec4(mapColor, opacVal);}"
            ].join('\n');
        }

        this.Start = function(s){
            if(!_this.isClean) return;
            if(this.startOnce) return;
            if(s)this.startOnce = s.startOnce;
            _this.isClean = false;
            this.Stop();
            dirtySpeed = Math.abs(dirtySpeed);
            opacSpeed = Math.abs(opacSpeed);
            _this.uniforms.curVal.value = this.minVal;
            animate.updater.addHandler(this);
        };

        this.Stop = function(){
            animate.updater.removeHandler(this);
        };

        this.Clean = function(s){
            //if(_this.isClean) return;
            _this.isClean = true;
            this.Stop();
            dirtySpeed = -Math.abs(dirtySpeed);
            opacSpeed = -Math.abs(opacSpeed);
            if(s){
              if(s.minDirt!== undefined) _this.minVal = s.minDirt;
              _this.keepOpac = s.keepOpac;
            }
            animate.updater.addHandler(this);
        };
    };

    function extractMaterialFromJSON(folderName, material){
        if(material.map){
            material.map = THREE.ImageUtils.loadTexture(materials.mediaFolderUrl+'/models/'+
              folderName+'/'+material.map.sourceFile);
            material.color = new THREE.Color("rgb(255,255,255)");
            return material;
        }
        else return material;
    }

    function RadialGradientMaterial (){
        var canvas = document.createElement( 'canvas' );
        canvas.width = canvas.height = 128;
        var context = canvas.getContext( '2d' );
        var gradient = context.createRadialGradient( canvas.width / 2,
            canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
        gradient.addColorStop( 0, 'rgba(255, 120, 0, 1)' );
        gradient.addColorStop( 1, 'rgba(0, 0, 0, 0)' );
        context.fillStyle = gradient;
        context.fillRect( 0, 0, canvas.width, canvas.height );
        var shadowTexture = new THREE.Texture( canvas );
        shadowTexture.needsUpdate = true;
        return new THREE.MeshPhongMaterial({
            map: shadowTexture,
            specular: new THREE.Color("rgb(0,80,60)"),
            refractionRatio: 0.985,
            reflectivity: 0.99,
            shininess: 30,
            transparent: true
        });
    }

    materials.textureFadeMaterial = function () {
        var cold_t = THREE.ImageUtils.loadTexture(materials.mediaFolderUrl+'/models/LoE/mixed.jpg');
        var material = new THREE.ShaderMaterial({
            uniforms: {
                texture1: { type: "t", value: cold_t },
                texture2: { type: "t", value: cold_t },
                startValue: { type: 'f', value: 1},
                endValue: { type: 'f', value: 0}
            },
            attributes: {},
            vertexShader: vShader(),
            fragmentShader: fShader(),
            transparent: false,
            side: 2
        });
        material.tween = tween;
        return material;

        function vShader() {
            return ""+
                "varying vec2 vUv;"+
                "void main(){"+
                "vUv = uv;"+
                "gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);}"
        }

        function fShader () {
            return ""+
                "varying vec2 vUv;"+
                "uniform sampler2D texture1;"+
                "uniform sampler2D texture2;"+
                "uniform float startValue;"+
                "uniform float endValue;"+
                "void main(){"+
                "float color = 1.0;"+
                "vec2 position = vUv;"+
                "gl_FragColor = startValue * texture2D(texture1, vUv) +" +
                "endValue * texture2D(texture2, vUv);}"
        }

        function tween(to, time){
            if(this.uniforms.startValue.value < 1
                && this.uniforms.startValue.value > 0) return;

            var startVal = 0;
            var endVal = 1;

            if(this.uniforms.startValue.value == 1)
                this.uniforms.texture2.value = to;
            else {
                startVal = 1;
                endVal = 0;
                this.uniforms.texture1.value = to;
            }

            var tweenDown = new TWEEN.Tween( this.uniforms.startValue );
            tweenDown.to( { value: startVal}, time );
            tweenDown.start();

            var tweenUp = new TWEEN.Tween( this.uniforms.endValue );
            tweenUp.to( { value: endVal}, time );
            tweenUp.start();
        }
    };

    materials.NeatRain = function(settings){
        var _this = this;
        var dirtMap = THREE.ImageUtils.loadTexture(materials.mediaFolderUrl+'/models/neat/rain.jpg');

        dirtMap.wrapS = THREE.RepeatWrapping;
        dirtMap.wrapT = THREE.RepeatWrapping;
        var isCleanSpeed = 0.1;
        var drops = 50;

        this.vertexShader = vSh();
        this.fragmentShader = fSh();
        this.transparent = true;
        this.opacSpeed = 0.01;
        this.isCleaning = false;
        this.minPos = -2;
        this.maxPos = 22;
        this.maxOpac = settings.maxOpac;
        this.startOnce = undefined;

        this.uniforms = {
            map: { type: 't', value: dirtMap },
            //drop: { type: 't', value: drop },
            opacity: { type: 'f', value: 0 },
            frequency: { type: 'f', value: 5 },
            amplitude: { type: 'f', value: 20 },
            pos: { type: 'f', value: this.maxPos },
            maxOpacity: { type: 'f', value: this.maxOpac },
            scrollVal: { type: 'f', value: 0 },
            points: { type: "v2v", value: [] }
        };

        this.update = function(){

          if(this.isCleaning && this.uniforms.pos.value > this.minPos)
            this.uniforms.pos.value -= isCleanSpeed;
          else if(this.isCleaning && this.uniforms.pos.value < this.minPos)
            this.Stop();

          if(!this.isCleaning && this.uniforms.opacity.value < this.uniforms.maxOpacity.value)
            this.uniforms.opacity.value += this.opacSpeed;
          else if(!this.isCleaning && this.uniforms.opacity.value > this.uniforms.maxOpacity.value)
            this.Stop();
        };

        function vSh(){
          return[
            "uniform vec3 lightPosition;",
            "varying vec2 vUv;"+
            "varying mat3 tbn;",
            "varying vec3 vTangent;",
            "varying vec3 vLightVector;",
            "void main(){",
            "vUv = uv;",
            "vec3 pos = position;",
            "vec3 vNormal = normalize(normalMatrix * normal);",
            "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );}"
          ].join('\n');
        }

        function fSh(){
          return[
            "#define ARRMAX " + drops + "\n" ,
            "varying vec2 vUv;",
            "uniform float scrollVal;",
            "uniform sampler2D map;",
            //"uniform sampler2D drop;",
            "uniform float opacity;",
            "uniform float frequency;",
            "uniform float amplitude;",
            "uniform float pos;",
            "uniform vec2 points[ARRMAX];",

            "void main() {",
            "vec4 mapColor = texture2D( map, vec2(vUv.x, vUv.y));",
            "vec4 dropColor = vec4( 0., 0., 0., 0.);",
            "if((vUv.y * amplitude) - pos + sin(vUv.x * pos * 2.5) > ",
            "(sin(vUv.x * frequency))) discard;",
            "gl_FragColor = vec4(mapColor.xyz, opacity);}"
          ].join('\n');
        }

        this.Start = function(s){
          if(this.startOnce) return;
          if(s)this.startOnce = s.startOnce;
          this.uniforms.opacity.value = 0;
          this.uniforms.pos.value = this.maxPos;
          this.isCleaning = false;
          animate.updater.addHandler(this);
        };

        this.Stop = function(){
          animate.updater.removeHandler(this);
        };

        this.Clean = function(){
          this.isCleaning = true;
          animate.updater.addHandler(this);
        };
    };

    materials.sheetingMat = function () {
        var map = THREE.ImageUtils.loadTexture(materials.mediaFolderUrl+'/models/neat/rain.jpg');
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;

        this.uniforms = {
            map: { type: 't', value: map },
            opacity: { type: 'f', value: 0 }
        };
        this.morphTargets = true;
        this.transparent = true;
        this.vertexShader = vSh();
        this.fragmentShader = fSh();

        function vSh() {
            return ""+
                "varying vec2 vUv;\n"+
                THREE.ShaderChunk[ "morphtarget_pars_vertex" ]+
                "\nvoid main(){\n"+
                "vUv = uv;\n"+
                THREE.ShaderChunk[ "morphtarget_vertex" ]+"\n"+
                "gl_Position = projectionMatrix * modelViewMatrix * vec4(morphed, 1.0);}"
        }

        function fSh() {
          return ""+
            "varying vec2 vUv;"+
            "uniform float opacity;"+
            "uniform sampler2D map;"+
            "void main(){"+
            "vec4 mapColor = texture2D( map, vec2(gl_FragCoord.x / 1000., gl_FragCoord.y / 1000.));"+
            "if(vUv.y >= 0.9)gl_FragColor = vec4(mapColor.xyz, ((1.-vUv.y)/((1.+vUv.y)/2.)));"+
            "else gl_FragColor = vec4(mapColor.xyz, opacity);}"
      }
    };

    materials.tornado = function () {
      var diffMap = THREE.ImageUtils.loadTexture(materials.mediaFolderUrl+
        '/models/tornado/Hurricane_arm_diff.jpg');

      var opacMap = THREE.ImageUtils.loadTexture(materials.mediaFolderUrl+
        '/models/tornado/Hurricane_transition_scale.jpg');

      /*var canvas = document.createElement('canvas');
      var ctx = canvas.getContext("2d");
      var size = 1024;
      var grd = ctx.createLinearGradient(size,0,0,size);
      grd.addColorStop(0.8,"black");
      grd.addColorStop(0,"white");

      ctx.fillStyle = grd;
      ctx.fillRect(0,0,size,size);
      var texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;*/

        this.uniforms = {
          dif: { type: 't', value: diffMap },
          opac: { type: 't', value: opacMap },
          opacVal: {type: 'f', value: 0}
        };

        this.vertexShader = vSh();
        this.fragmentShader = fSh();
        this.transparent = true;
        this.side = 0;

        function vSh() {
          return ""+
            "varying vec3 fNormal;"+
            "varying vec3 fPosition;"+
            "varying vec2 vUv;"+
            "uniform float opacVal;"+
            "void main(){"+
            "vUv = uv;"+
            "fNormal = normalize(normalMatrix * normal);"+
            "vec4 pos = modelViewMatrix * vec4(position, 1.0);"+
            "fPosition = pos.xyz;"+
            //"gl_Position = projectionMatrix * modelViewMatrix * vec4(position, position.z);}"//WOAH
            "gl_Position = projectionMatrix * pos;}"
        }

        function fSh() {
          return ""+
            "varying vec2 vUv;"+
            "uniform sampler2D dif;"+
            "uniform sampler2D opac;"+
            "uniform float opacVal;"+
            "varying vec3 fPosition;"+
            "varying vec3 fNormal;"+

            "void main(){"+
            "vec3 normal = normalize(fNormal);"+
            "vec3 eye = normalize(-fPosition.xyz);"+
            "float rim = smoothstep(0.2, 1., 1. - dot(normal, eye));"+

            "vec4 difCol = texture2D(dif, vUv);"+
            "vec4 opacCol = texture2D(opac, vUv);"+
            "if(opacCol.r > opacVal) discard;"+
            /*v.1*/
            //"gl_FragColor = vec4(opacCol.xy, opacCol.b, 1.0);}"

            /*v.2*/
            /*
            "if(rim < 0.4) gl_FragColor = vec4(difCol.xyz, 1.0);"+
            "else gl_FragColor = vec4(difCol.xyz, 0.3);}"
            */

            /*v.3*/
            //"gl_FragColor = vec4(difCol.xyz, clamp(rim, 0.0, 1.0) );}"

            /*v.4*/
            //"gl_FragColor = vec4(difCol.xyz, 1. - rim);}"

            /*v.5*/
            //"gl_FragColor = vec4(difCol.xyz, clamp(0.8-rim, 0.0, 1.0) );}"

            /*v.5*/
            "float zbuffer = gl_FragCoord.w * 500.0;"+
            "gl_FragColor = vec4(difCol.xyz - (vUv.y - 0.2), clamp(0.6-rim, 0.0, 1.0) );}"
        }
    };

  materials.outlineShader = function (set) {
    this.color = ( set.color !== undefined ) ? set.color : new THREE.Color( 0x000000 );
    this.thickness = ( set.thickness !== undefined ) ? set.thickness : "1";

    this.uniforms = {
      color: { type: "c", value: this.color },
      offset : {type: "f", value: this.thickness},
      opacity : {type: "f", value: 1}
    };
    this.side = 1;
    this.transparent = true;
    this.vertexShader = [
      "varying vec3 Vnormal;",
      "uniform float offset;"+
      "void main(){",
          "Vnormal = normal;",
          "vec4 pos = modelViewMatrix * vec4( position + normal * offset, 1.0 );",
          "gl_Position = projectionMatrix * pos;",
      "}"
    ].join("\n");

    this.fragmentShader = [
      "varying vec3 Vnormal;",
      "uniform vec3 color;"+
      "uniform float opacity;"+
      "void main(){",
        "gl_FragColor = vec4( color, opacity );"+
      "}"
    ].join("\n");
  }

  materials.noiseMat =  function(tex){
    this.uniforms = {
      map: {type: 't', value: tex},
      time: {type: 'f', value: 0},
      offset: {type: 'f', value: 0},
    };

    this.side = 2;
    this.transparent = true;

    this.vertexShader = [
      "varying vec2 vUv;",
      "void main(){",
      "vUv = uv;",
        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
      "}"
    ].join("\n");

    this.fragmentShader = [
      "uniform sampler2D map;",
      "uniform float time;",
      "uniform float offset;",
      "varying vec2 vUv;",

      "vec4 noisep(in vec2 p, in float scale) {",
        "return texture2D(map, p / scale + vec2(0.0, time * 0.01)) / 4.0;",
      "}",

      "void main(){",
        "float scale = 0.7;",
        "vec4 col = vec4(0.);",
        "for(int i = 0; i < 6; i++) {",
          "col += noisep(vec2(vUv.x + offset, vUv.y + offset), scale);",
          "scale += 5.0;",
        "}",

        "if(col.b > 0.7) discard;",

        //"float zbuffer = gl_FragCoord.w * 500.0;",
        //"if(zbuffer > .32)",
        "gl_FragColor = vec4(col.b + .2, col.b + .2, .8, .5);",
        //"else gl_FragColor = vec4(0., 0., sin(gl_FragCoord.x * zbuffer * 4.), 1.0);",

        //"gl_FragColor = vec4(col.b + .2, col.b + .2, .8, .5);",
      "}"
    ].join("\n");
  }

  materials.vertHeightMat =  function(tex){
    this.uniforms = {
    };

    this.side = 2;

    this.vertexShader = [
      "varying vec2 vUv;",
      "varying float height;",
      "void main(){",
        "vUv = uv;",
        //"height = position.y;",
        "vec4 v = projectionMatrix * modelViewMatrix * vec4( vec3(position), 1.0 );",
        //"x = v.x / v.z;",
        "height = position.y + 68.;",
        "gl_Position = v;",
      "}"
    ].join("\n");

    this.fragmentShader = [
      "varying vec2 vUv;",
      "varying float height;",

      "void main(){",
        "gl_FragColor = vec4(0., height, height - 3., 1.);",
      "}"
    ].join("\n");
  }

  materials.floorGrid =  function(){
    this.uniforms = {
    };

    this.side = 0;

    this.vertexShader = [
      "varying vec2 vUv;",
      "void main(){",
        "vUv = uv;",
        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
      "}"
    ].join("\n");

    this.fragmentShader = [
      "#define GREY vec4(0.43, 0.43, 0.43, 1.)\n",
      "#define ORANGE vec4(0.45, 0.45, 0.17, 1.)\n",
      "varying vec2 vUv;",

      "float rand(vec2 co){",
        "return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);",
      "}",

      "void main(){",
        "vec4 finalCol;",
        "float gridSize = 200.;",
        "float curX = sin(vUv.x * gridSize);",
        "float curY = sin(vUv.y * gridSize);",
        "if(curX > 0.99 || curY > 0.99) finalCol = ORANGE;",
        "else finalCol = GREY /** rand(vUv)*/;",
        "gl_FragColor = finalCol;",
      "}"
    ].join("\n");
  }

    return materials;
});
