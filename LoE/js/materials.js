var imagePrefix = "media/skybox/cube_";
var directions  = ["r", "l", "u", "d", "f", "b"]; 
var imageSuffix = ".jpg";


function makeTextureCube (argument) {
	var urls = [];
	for (var i = 0; i < 6; i++)
		urls.push(imagePrefix + directions[i] + imageSuffix);

	textureCube = THREE.ImageUtils.loadTextureCube( urls, THREE.CubeRefractionMapping );
}

function addSkybox () {
	var cubeGeom = new THREE.BoxGeometry(5000,5000,5000);

	var materialArray = [];
	for (var i = 0; i < 6; i++)
		materialArray.push( new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
			side: THREE.BackSide
		}));
	var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
	var skyBox = new THREE.Mesh( cubeGeom, skyMaterial );
	scene.add( skyBox );
}

function setMaterials(materialName){
	var material;
	switch(materialName){ 
		case 'pouring':
		    material = new THREE.MeshPhongMaterial({
		    	map: THREE.ImageUtils.loadTexture(imagesArray[2]),
		    	transparent: true,
		    	shininess: 16,
		    })
	        break;
		case 'tambur':
		    material = new THREE.MeshPhongMaterial({
		    	color: new THREE.Color("rgb(125,125,125)"),
		    	ambient: new THREE.Color("rgb(125,125,125)"),
		    	specular: new THREE.Color("rgb(255,255,255)"),
		    	map: THREE.ImageUtils.loadTexture(imagesArray[0]),
		    	bumpMap: THREE.ImageUtils.loadTexture(imagesArray[1]),
		    	bumpScale: 1,
		    	shininess: 11,
		    })
	        break;
	    case 'metal':
		    material = new THREE.MeshPhongMaterial({
		    	color: new THREE.Color("rgb(116,116,116)"),
		    	ambient: new THREE.Color("rgb(66,66,66)"),
		    	specular: new THREE.Color("rgb(222,222,222)"),
		    	shininess: 16,
		    	metal: true
		    })
	        break;
	   	case 'rotator':
		    material = new THREE.MeshPhongMaterial({
		    	color: new THREE.Color("rgb(126,7,100)"),
		    	ambient: new THREE.Color("rgb(126,7,100)"),
		    	specular: new THREE.Color("rgb(222,222,222)"),
		    	shininess: 22,
		    	metal: true
		    })
	        break;
		case 'rail':
		    material = new THREE.MeshPhongMaterial({
		    	color: new THREE.Color("rgb(0,49,174)"),
		    	ambient: new THREE.Color("rgb(0,49,174)"),
		    	specular: new THREE.Color("rgb(255,255,255)"),
		    	shininess: 6
		    })
	        break;
	    case 'sealant a':
		    material = new THREE.MeshPhongMaterial({
		    	color: new THREE.Color("rgb(161,161,161)"),
		    	ambient: new THREE.Color("rgb(116,116,116)"),
		    	specular: new THREE.Color("rgb(255,255,255)"),
		    })
	        break;
	    case 'sealant b':
		    material = new THREE.MeshPhongMaterial({
		    	color: new THREE.Color("rgb(213,213,213)"),
		    	ambient: new THREE.Color("rgb(116,116,116)"),
		    	specular: new THREE.Color("rgb(255,255,255)"),
		    	
		    })
	        break;
	    case 'Spacer':
		    material = new THREE.MeshPhongMaterial({
		    	color: new THREE.Color("rgb(213,213,213)"),
		    	ambient: new THREE.Color("rgb(222,222,222)"),
		    	specular: new THREE.Color("rgb(255,255,255)")
		    })
	        break;
	    case 'Spacer Cap':
		    material = new THREE.MeshPhongMaterial({
		    	color: new THREE.Color("rgb(213,213,213)"),
		    	ambient: new THREE.Color("rgb(116,116,116)"),
		    	specular: new THREE.Color("rgb(255,255,255)"),
		    	normalMap: THREE.ImageUtils.loadTexture(imagesArray[0])
		    })
	        break;
	    case 'Glass':	
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
	    case 'Glass Sides':
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
	    case 'p1 op':
		    material = new THREE.MeshLambertMaterial({
		    	color: new THREE.Color("rgb(0,0,0)"),
		    	ambient: new THREE.Color("rgb(0,0,0)"),
		    	specular: new THREE.Color("rgb(0,0,0)"),
		    	map: THREE.ImageUtils.loadTexture(imagesArray[1]),
		    	transparent: true
		    })
	        break;
	    case 'p2 op':
		    material = new THREE.MeshLambertMaterial({
		    	color: new THREE.Color("rgb(0,0,0)"),
		    	ambient: new THREE.Color("rgb(0,0,0)"),
		    	specular: new THREE.Color("rgb(0,0,0)"),
		    	map:  THREE.ImageUtils.loadTexture(imagesArray[3]),
		    	transparent: true
		    })
	        break;
	    case 'plane':
		    material = new THREE.MeshLambertMaterial({
		    	color: new THREE.Color("rgb(233,233,233)"),
		    	ambient: new THREE.Color("rgb(233,233,233)"),
		    	specular: new THREE.Color("rgb(255,255,255)")
		    })
	        break;
	    case 'text':
		    material = new THREE.MeshLambertMaterial({
		    	color: new THREE.Color("rgb(113,106,76)"),
		    	ambient: new THREE.Color("rgb(113,106,76)"),
		    	specular: new THREE.Color("rgb(191,188,175)"),
		    	emissive: new THREE.Color("rgb(225,225,225)")
		    	
		    })
	        break;
	    case 'desicant':
		    material = new THREE.MeshLambertMaterial({
		    	color: new THREE.Color("rgb(255,255,255)"),
		    	ambient: new THREE.Color("rgb(255,255,255)")
		    	//transparent: true,
		    	//opacity: 0.75
		    	
		    })
	        break;
	    case 'Spacer slice':
	  		material = new THREE.MeshPhongMaterial({
		    	color: new THREE.Color("rgb(213,213,213)"),
		    	ambient: new THREE.Color("rgb(222,222,222)"),
		    	specular: new THREE.Color("rgb(255,255,255)"),
				envMap: textureCube,
				refractionRatio: 0.985, 
				reflectivity: 0.99,
				shininess: 30
		    })	
		    break;
	    default:
	    	material =  new THREE.MeshNormalMaterial()
        	
	}

	material.name = materialName;
	material.defaultEmissive = material.emissive;
	material.maxOpacity = material.opacity;

	return material
}

// function silverCoatingMaterial () {
// 	this.uniforms = {		
// 		texture1: { type: "t", value: THREE.ImageUtils.loadTexture( "media/silver.jpg" ) },
// 		start: { type: 'f', value: 1.501}
// 	},
// 	this.material = function() {
// 		var mat = new THREE.ShaderMaterial({ 
// 			uniforms: this.uniforms, 
// 			attributes: {}, 
// 			vertexShader: this.vertexShader(), 
// 			fragmentShader: this.fragmentShader(),
// 			transparent: true,
// 			side: 1
// 		});
// 		return mat;
// 	},
// 	this.vertexShader = function () {	
// 		return ""+
// 		"varying vec2 vUv;"+	
// 		"void main(){"+
// 		"vUv = uv;"+
// 		"gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);}"
// 	},
// 	this.fragmentShader = function () {	
// 		return ""+
// 		"varying vec2 vUv;"+
// 		"uniform sampler2D texture1;"+		
// 		"uniform float start;"+
// 		"float rand2(vec2 co){return fract(sin(dot(co.xy ,vec2(99.9898,78.233))) * 43758.5453);}"+
// 		"void main(){"+
// 		"float color = 0.0;"+
// 		"vec2 position = vUv;"+
// 		"float noise = rand2(position.xy);"+
// 		"color = (position.x + start);"+
// 		"if(color > 1.5) discard;"+
// 		"else gl_FragColor = color * texture2D(texture1, vUv);}"
// 	},
// 	this.tween = function(time, delay, repeat){
// 		tween = new TWEEN.Tween( this.uniforms.start )
// 		if(repeat != undefined) tween.repeat( repeat );
// 		if(delay != undefined) tween.delay( delay );
// 		tween.to( { value: -1.0}, time );
// 		tween.start();
// 	}
// 	return this;
// }

function silverCoatingMaterial (start, end) {
	var material = new THREE.ShaderMaterial({ 
		uniforms: {		
			texture1: { type: "t", value: coat1_t },
			start: { type: 'f', value: start},
			end: { type: 'f', value: end}
		},
		attributes: {}, 
		vertexShader: vShader(), 
		fragmentShader: fShader(),
		transparent: true,
		side: 1
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
		"uniform float start;"+	
		"uniform float end;"+
		"void main(){"+
		"float color = 0.0;"+
		"vec2 position = vUv;"+
		"color = (position.x + start);"+
		"if(color > end) discard;"+
		"else gl_FragColor = color * texture2D(texture1, vUv);}"
	}

	function tween(time, delay, repeat){
		tween = new TWEEN.Tween( this.uniforms.start )
		if(repeat != undefined) tween.repeat( repeat );
		if(delay != undefined) tween.delay( delay );
		tween.to( { value: -1.0}, time );
		tween.start();
	}
}


function textureFadeMaterial (start, end) {
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

		tweenDown = new TWEEN.Tween( this.uniforms.startValue )
		tweenDown.to( { value: startVal}, time );
		tweenDown.start();

		tweenUp = new TWEEN.Tween( this.uniforms.endValue )
		tweenUp.to( { value: endVal}, time );
		tweenUp.start();
	}
}

function tweenOpacity (to, time, delayTime) {
	tween = new TWEEN.Tween( this );
	if(delayTime != undefined) tween.delay(delayTime);
	tween.to( { opacity: to}, time );
	tween.start();
}

function enableBackground () {
	bck_1.mesh.visible = true;	
	plane.mesh.material.materials[0].tweenOpacity(0, backgroundBlendSpeed);
}

function manageBackgroundOpacity (to) {
	bck_1.mesh.material.tween(to, backgroundBlendSpeed)
}
