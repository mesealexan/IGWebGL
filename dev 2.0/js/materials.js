define(["three"], function(THREE){
    var materials = {};
    var textureCube = undefined;

    (function makeTextureCube(){
        var imagePrefix = "media/skybox/Cube_";
        var directions  = ["r", "l", "u", "d", "f", "b"];
        var imageSuffix = ".jpg";
        var urls = [];
        for (var i = 0; i < 6; i++)
            urls.push(imagePrefix + directions[i] + imageSuffix);
        textureCube = THREE.ImageUtils.loadTextureCube( urls, THREE.CubeRefractionMapping );
    }());

    materials.setMaterials = function(folderName, material){
        var material;
        var materialName = folderName + material.name;
        var url = "media/models/"+folderName+"/";

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
            default:
                material = extractMaterialFromJSON(material);
                //material.polygonOffset = true;
                //material.polygonOffsetFactor = 5;
                //material.polygonOffsetUnits = -0.1;
                break;
        }

        material.name = materialName;
        material.defaultEmissive = material.emissive;
        material.maxOpacity = material.opacity;
        return material;
    };

    function extractMaterialFromJSON(material){
        console.log(material.map)
        return new THREE.MeshLambertMaterial({
            color: material.color,
            emissive: material.emissive
        });
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
        var cold_t = THREE.ImageUtils.loadTexture('media/models/LoE/mixed.jpg');
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

    return materials;
});