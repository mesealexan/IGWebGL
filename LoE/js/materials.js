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
		    	color: new THREE.Color("rgb(170,10,243)"),
		    	ambient: new THREE.Color("rgb(170,10,243)"),
		    	specular: new THREE.Color("rgb(255,255,255)"),
		    	transparent: false,
		    	opacity: 0.5,
		    	blending: THREE.AdditiveBlending
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
		    	color: new THREE.Color("rgb(200,200,200)"),
		    	ambient: new THREE.Color("rgb(211,211,211)"),
		    	specular: new THREE.Color("rgb(222,222,222)"),
		    	shininess: 3,
		    	metal: true,
				vertexColors: THREE.VertexColors,
				envMap: textureCube,
				reflectivity: 0.69
		    })
	        break;
		case 'rail':
		    material = new THREE.MeshPhongMaterial({
		    	color: new THREE.Color("rgb(47,83,174)"),
		    	ambient: new THREE.Color("rgb(0,49,174)"),
		    	specular: new THREE.Color("rgb(255,255,255)"),
		    	shininess: 11,
		    	metal: true,
				vertexColors: THREE.VertexColors,
				envMap: textureCube,
				reflectivity: 0.19
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
		    	normalMap: THREE.ImageUtils.loadTexture(imagesArray[4])
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
				opacity: 0.61
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
		    	color: new THREE.Color("rgb(250,250,250)"),
		    	emissive: new THREE.Color("rgb(250,250,250)"),
		    	specular: new THREE.Color("rgb(255,255,255)"),
		    	emissive: new THREE.Color("rgb(61,61,61)")
		    })
	        break;
	    case 'text':
		    material = new THREE.MeshLambertMaterial({
		    	color: new THREE.Color("rgb(113,106,76)"),
		    	ambient: new THREE.Color("rgb(78,63,28)"),
		    	specular: new THREE.Color("rgb(191,188,175)"),
		    	emissive: new THREE.Color("rgb(78,66,37)")
		    	
		    })
	        break;
	    case 'desicant':
		    material = new THREE.MeshLambertMaterial({
		    	color: new THREE.Color("rgb(255,255,255)"),
		    	ambient: new THREE.Color("rgb(255,255,255)")
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
	    	material =  new THREE.MeshBasicMaterial();
	    	material.depthTest = true;
	    	material.depthWrite = true;
        	
	}

	material.name = materialName;
	material.defaultEmissive = material.emissive;
	material.maxOpacity = material.opacity;

	return material;
}

function silverCoatingMaterial (size, secondary_t) {
	var hasSecondary = 0;
	if(secondary_t) hasSecondary = 1.0;
	var material = new THREE.ShaderMaterial({ 
		uniforms: {		
			primary_t: { type: "t", value: coat1_t },
			secondary_t: { type: "t", value: secondary_t },			
			hasSecondary: { type: "f", value: hasSecondary },
			start: { type: 'f', value: 1.104 },
			size: { type: 'f', value: size},
			discard_f: { type: 'f', value: 1.1},
			maxColor: { type: 'f', value: 1.0}
		},
		attributes: {}, 
		vertexShader: vShader(), 
		fragmentShader: fShader(),
		transparent: true,
		side: 1,
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
		return ""+
		"varying vec2 vUv;"+	
		"void main(){"+
		"vUv = uv;"+
		"gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);}"
	}

	function fShader () {	
		return ""+
		"varying vec2 vUv;"+
		"uniform sampler2D primary_t;"+	
		"uniform sampler2D secondary_t;"+		
		"uniform float start;"+			
		"uniform float size;"+		
		"uniform float maxColor;"+	
		"uniform float discard_f;"+
		"uniform float hasSecondary;"+
		"void main(){"+
		"float color = 0.0;"+
		"vec2 position = vUv;"+
		//flip uv coord for text
		"vec2 vUvInv = vec2(1. - vUv.x, vUv.y);"+
		"color = ((position.x * size) + maxColor) + start;"+
		"if (hasSecondary == 1.0) {"+
			"if (color >= discard_f + maxColor) discard;"+
			"else if (color > 0.) gl_FragColor = (color * texture2D(primary_t, vUv)) + "+
			"texture2D(secondary_t, vUvInv);" +
			"else gl_FragColor = texture2D(secondary_t, vUvInv);}"+
		"else {"+
			"if (color >= discard_f + maxColor) discard;"+
			"else if (color > 0.) gl_FragColor = (color * texture2D(primary_t, vUv));}}"
	}

	function tween(time, delay, repeat){
		tweenStart = new TWEEN.Tween( this.uniforms.start )
		if(repeat != undefined) tweenStart.repeat( repeat );
		if(delay != undefined) tweenStart.delay( delay );
		tweenStart.to( { value: -this.uniforms.size.value - this.uniforms.maxColor.value }, 
			time);
		tweenStart.start();
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

function pouringMaterial () {
	var material = new THREE.ShaderMaterial({ 
		uniforms: {		
			texture1: { type: "t", value: coat2_t },
		},
		attributes: {}, 
		vertexShader: vShader(), 
		fragmentShader: fShader(),
		transparent: false,
		side: 2
	});
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
		"void main(){"+
		"vec4 tex = texture2D(texture1, vUv);"+
		"float color = 0.;"+
		"vec2 position = vUv;"+
		"if(tex.r > 0.99) discard;"+
		"gl_FragColor = vec4(tex.r, tex.g, tex.b, 1.);}"
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
	plane.mesh.material.materials[0].tweenOpacity(0, backgroundBlendTime);
}

function manageBackgroundOpacity (to) {
	bck_1.mesh.material.tween(to, backgroundBlendTime)
}
