define(["three", "animate"], function(THREE, animate){
    var textureCube = undefined;
    var cloudCube = undefined;

    var materials = {
      makeTextureCube: function(mediaFolderUrl){
        var imagePrefix = mediaFolderUrl+"/skybox/Cube_";
        var directions  = ["r", "l", "u", "d", "f", "b"];
        var imageSuffix = ".jpg";
        var urls = [];
        for (var i = 0; i < 6; i++)
            urls.push(imagePrefix + directions[i] + imageSuffix);
        textureCube = THREE.ImageUtils.loadTextureCube( urls, THREE.CubeRefractionMapping );
    }
    ,
    makeCloudTextureCube: function(mediaFolderUrl){
        var imagePrefix = mediaFolderUrl+"/skybox/clouds_scrolling2";
        var directions  = ["r", "l", "u", "d", "f", "b"];
        var imageSuffix = ".jpg";
        var urls = [];
        for (var a = 0; a < 6; a++)
        urls.push(imagePrefix + imageSuffix);
        cloudCube = THREE.ImageUtils.loadTextureCube( urls, THREE.CubeRefractionMapping );
    }
  };

    materials.setMaterials = function(folderName, material){
        var material;
        var materialName = folderName + material.name;
        var url = this.mediaFolderUrl+"/models/"+folderName+"/";

        switch(materialName){
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
                    specular: new THREE.Color("rgb(255,255,255)"),
                    normalMap: THREE.ImageUtils.loadTexture(url+'spacer.jpg')
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
                    map:  THREE.ImageUtils.loadTexture(url+'p2_op.png'),
                    transparent: true
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
                    color: new THREE.Color("rgb(213,213,213)"),
                    ambient: new THREE.Color("rgb(222,222,222)"),
                    specular: new THREE.Color("rgb(255,255,255)")
                });
                break;
            case 'cardinalSpacer Cap':
                material = new THREE.MeshPhongMaterial({
                    color: new THREE.Color("rgb(213,213,213)"),
                    ambient: new THREE.Color("rgb(116,116,116)"),
                    specular: new THREE.Color("rgb(255,255,255)"),
                    normalMap: THREE.ImageUtils.loadTexture(url+'spacer.jpg')
                });
                break;
            case 'cardinalGlass':
                material = new THREE.MeshPhongMaterial({
                    color: new THREE.Color("rgb(255,255,255)"),
                    //ambient: new THREE.Color("rgb(255,1,0)"),
                    specular: new THREE.Color("rgb(0,80,60)"),
                    vertexColors: THREE.VertexColors,
                    envMap: textureCube,
                    refractionRatio: 0.985,
                    reflectivity: 0.99,
                    shininess: 30,
                    transparent: true,
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
                material = new THREE.MeshLambertMaterial({
                    color: new THREE.Color("rgb(198,204,151)"),
                    ambient: new THREE.Color("rgb(198,204,151)"),
                    transparent: true,
                    opacity: 0.75

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

            case 'neatneatGlass':
            case 'neatstandardGlass':
            case 'neatGlass non animated':
                material = new THREE.MeshPhongMaterial({
                    color: new THREE.Color("rgb(220,255,220)"),
                    ambient: new THREE.Color("rgb(255,255,255)"),
                    specular: new THREE.Color("rgb(0,80,60)"),
                    //vertexColors: THREE.VertexColors,
                    envMap: cloudCube,
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
        var clean = true;
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

            if(this.uniforms.curVal.value < this.minVal) this.Stop();

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
            if(!clean) return;
            if(this.startOnce) return;
            if(s)this.startOnce = s.startOnce;
            clean = false;
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
            if(clean) return;
            clean = true;
            this.Stop();
            dirtySpeed = -Math.abs(dirtySpeed);
            opacSpeed = -Math.abs(opacSpeed);
            if(s){
              if(s.minDirt) this.minVal = s.minDirt;
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
        var cleanSpeed = 0.1;
        var drops = 50;

        this.vertexShader = vSh();
        this.fragmentShader = fSh();
        this.transparent = true;
        this.opacSpeed = 0.01;
        this.cleaning = false;
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

          if(this.cleaning && this.uniforms.pos.value > this.minPos)
            this.uniforms.pos.value -= cleanSpeed;
          else if(this.cleaning && this.uniforms.pos.value < this.minPos)
            this.Stop();

          if(!this.cleaning && this.uniforms.opacity.value < this.uniforms.maxOpacity.value)
            this.uniforms.opacity.value += this.opacSpeed;
          else if(!this.cleaning && this.uniforms.opacity.value > this.uniforms.maxOpacity.value)
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
          this.cleaning = false;
          animate.updater.addHandler(this);
        };

        this.Stop = function(){
          animate.updater.removeHandler(this);
        };

        this.Clean = function(){
          this.cleaning = true;
          animate.updater.addHandler(this);
        };
    };

    materials.sheetingMat = function () {
        var map = THREE.ImageUtils.loadTexture('media/models/neat/rain.jpg');
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
    }

    return materials;
});
