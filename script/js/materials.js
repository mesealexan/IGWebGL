var urls = [];
var imagePrefix = "media/skybox/cube_";
var directions  = ["r", "l", "u", "d", "f", "b"]; //l
var imageSuffix = ".jpg";

for (var i = 0; i < 6; i++)
	urls.push(imagePrefix + directions[i] + imageSuffix);

var textureCube = THREE.ImageUtils.loadTextureCube( urls, THREE.CubeRefractionMapping );

function vertexShader () {	
	return ""+
	"uniform float ScreenResX;"+
	"uniform float ScreenResY;"+
	"varying vec2 vUv;"+	
	"varying vec3 vNormal;"+
	"varying vec3 vVector;"+
	"varying vec3 worldVertexPosition;"+
	"varying vec3 worldNormalDirection;"+

	"void main(){"+
	"vUv = uv;"+
	"vNormal = normal;"+
	"gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);"+
	"worldVertexPosition = vec3(modelViewMatrix * vec4(position, 1.0));"+
	"worldNormalDirection = mat3(modelViewMatrix) * normal;"+
	"vVector = position;}"
}

function fragmentShader () {	
	return ""+
	"uniform float ScreenResX;"+
	"uniform float ScreenResY;"+
	"varying vec3 worldVertexPosition;"+
	"varying vec3 worldNormalDirection;"+
	"varying vec3 vVector;"+
	"varying vec2 vUv;"+
	"varying vec3 vNormal;"+

	"void main(){"+
	"float color = 1.0;"+
	"vec2 position = vUv;"+
	"vec3 incident = normalize(worldVertexPosition);"+
	"gl_FragColor = vec4( vVector.x, vVector.y, vVector.z, 1.0);}"
}
function setMaterials(materialName){
	var material;
	switch(materialName) {
	    case 'sealant a':
		    material = new THREE.MeshPhongMaterial({
		    	color: new THREE.Color("rgb(255,0,0)"),
		    	ambient: new THREE.Color("rgb(255,0,0)"),
		    	specular: new THREE.Color("rgb(255,0,0)")
		    })
	        break;
	    case 'sealant b':
		    material = new THREE.MeshPhongMaterial({
		    	color: new THREE.Color("rgb(255,0,0)"),
		    	ambient: new THREE.Color("rgb(255,0,0)"),
		    	specular: new THREE.Color("rgb(255,0,0)")
		    	
		    })
	        break;
	    case 'Spacer':
		    material = new THREE.MeshPhongMaterial({
		    	color: new THREE.Color("rgb(213,213,213)"),
		    	ambient: new THREE.Color("rgb(188,188,188)"),
		    	specular: new THREE.Color("rgb(255,255,255)")
		    	
		    })
	        break;
	    case 'Spacer Cap':
		    material = new THREE.MeshPhongMaterial({
		    	color: new THREE.Color("rgb(255,0,0)"),
		    	ambient: new THREE.Color("rgb(255,0,0)"),
		    	specular: new THREE.Color("rgb(255,0,0)")
		    	
		    })
	        break;
	    case 'Glass':
			material = new THREE.MeshPhongMaterial({ 
				color: new THREE.Color("rgb(8,11,8)"),
				ambient: new THREE.Color("rgb(0,1,0)"),
				specular: new THREE.Color("rgb(0,80,60)"),
				envMap: textureCube,
				fragmentShader: fragmentShader(),
				refractionRatio: 0.985, 
				reflectivity: 0.88,
				shininess: 30,
				transparent: true,
				opacity: 0.6
			});
	        break;
	    case 'Glass Sides':
		    material = new THREE.MeshPhongMaterial({ 
				color: new THREE.Color("rgb(0,1,0)"),
				ambient: new THREE.Color("rgb(0,1,0)"),
				specular: new THREE.Color("rgb(0,80,60)"),
				envMap: textureCube,
				fragmentShader: fragmentShader(),
				refractionRatio: 0.985, 
				reflectivity: 0.88,
				shininess: 30,
				transparent: true,
				opacity: 0.81
			});
	        break;
	    case 'p1 op':
		    material = new THREE.MeshLambertMaterial({
		    	color: new THREE.Color("rgb(0,0,0)"),
		    	ambient: new THREE.Color("rgb(0,0,0)"),
		    	specular: new THREE.Color("rgb(0,0,0)"),
		    	map:  THREE.ImageUtils.loadTexture(imagesArray[1]),
		    	transparent: true
		    })
	        break;
	    case 'p2 op':
		    material = new THREE.MeshLambertMaterial({
		    	color: new THREE.Color("rgb(0,0,0)"),
		    	ambient: new THREE.Color("rgb(0,0,0)"),
		    	specular: new THREE.Color("rgb(0,0,0)"),
		    	map:  THREE.ImageUtils.loadTexture(imagesArray[2]),
		    	transparent: true
		    })
	        break;
	    case 'plane':
		    material = new THREE.MeshLambertMaterial({
		    	color: new THREE.Color("rgb(255,255,255)"),
		    	ambient: new THREE.Color("rgb(255,255,255)"),
		    	specular: new THREE.Color("rgb(255,255,255)")
		    })
	        break;
	    case 'text':
		    material = new THREE.MeshLambertMaterial({
		    	color: new THREE.Color("rgb(113,106,76)"),
		    	ambient: new THREE.Color("rgb(113,106,76)"),
		    	specular: new THREE.Color("rgb(191,188,175)")
		    	
		    })
	        break;
	    case 'desicant':
		    material = new THREE.MeshPhongMaterial({
		    	color: new THREE.Color("rgb(255,0,0)"),
		    	ambient: new THREE.Color("rgb(255,0,0)"),
		    	specular: new THREE.Color("rgb(255,0,0)")
		    	
		    })
	        break;
	    default:
	    	material =  new THREE.MeshNormalMaterial()
        	
	}
	return material
}



var bmap;

var shaderSettings = {
	uniforms: {
	  	ScreenResX: {
	    	type: 'f',
	    	value: window.innerWidth
	  	},
	 	ScreenResY: {
	    	type: 'f',
	    	value: window.innerHeight
	  	}
	},
	attributes: {
	 	displacement: {
	    type: 'f',
	    value: []
	 	}
	}
}

function updateShaders (frameNumber) {

}

function glassMaterial1 () {
	var material = new THREE.ShaderMaterial({ 
		uniforms: shaderSettings.uniforms, 
		attributes: {}, 
		vertexShader: vertexShader(), 
		fragmentShader: fragmentShader(),
		transparent: true,
		wireframe: false
	});

	var urls = [];
	var imagePrefix = "media/skybox/cube_";
	var directions  = ["r", "l", "u", "d", "f", "b"]; //l
	var imageSuffix = ".jpg";

	for (var i = 0; i < 6; i++)
		urls.push(imagePrefix + directions[i] + imageSuffix);

	var textureCube = THREE.ImageUtils.loadTextureCube( urls, THREE.CubeRefractionMapping );

	var refractMaterial = new THREE.MeshPhongMaterial({ 
		color: 0x476C47, 
		ambient: 0x152015, 
		envMap: textureCube,
		fragmentShader: fragmentShader(),
		refractionRatio: 0.985, 
		reflectivity: 0.9,
		specular: 0xA3E6E6, 
		shininess: 30,
		transparent: true,
		opacity: 0.6
	});

	var fresnelSh = THREE.FresnelShader;
	var fresnelUniforms = 
	{
		"mRefractionRatio": { type: "f", value: 0.02 },
		"mFresnelBias": 	{ type: "f", value: 0.1 },
		"mFresnelPower": 	{ type: "f", value: 1.1 },
		"mFresnelScale": 	{ type: "f", value: 1.0 },
		"tCube": 			{ type: "t", value: textureCube }
	};

	var customMaterial = new THREE.ShaderMaterial( 
	{
	    uniforms: 		fresnelUniforms,
		vertexShader:   fresnelSh.vertexShader,
		fragmentShader: fresnelSh.fragmentShader,
		transparent: true,
		opacity: 0.1
	});

	function vertexShader () {	
		return ""+
		"uniform float ScreenResX;"+
		"uniform float ScreenResY;"+
		"varying vec2 vUv;"+	
		"varying vec3 vNormal;"+
		"varying vec3 vVector;"+
		"varying vec3 worldVertexPosition;"+
		"varying vec3 worldNormalDirection;"+

		"void main(){"+
		"vUv = uv;"+
		"vNormal = normal;"+
		"gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);"+
		"worldVertexPosition = vec3(modelViewMatrix * vec4(position, 1.0));"+
		"worldNormalDirection = mat3(modelViewMatrix) * normal;"+
		"vVector = position;}"
	}

	function fragmentShader () {	
		return ""+
		"uniform float ScreenResX;"+
		"uniform float ScreenResY;"+
		"varying vec3 worldVertexPosition;"+
		"varying vec3 worldNormalDirection;"+
		"varying vec3 vVector;"+
		"varying vec2 vUv;"+
		"varying vec3 vNormal;"+

		"void main(){"+
		"float color = 1.0;"+
		"vec2 position = vUv;"+
		"vec3 incident = normalize(worldVertexPosition);"+
		"gl_FragColor = vec4( vVector.x, vVector.y, vVector.z, 1.0);}"
	}

	return refractMaterial;
}

function spacerMaterial () {	
	var spacerMat = new THREE.MeshPhongMaterial({ 
		color: new THREE.Color(0.3882, 0.3882, 0.3882),
		ambient: new THREE.Color(0.3882, 0.3882, 0.3882),
		specular: new THREE.Color(0.9000, 0.9000, 0.9000), 
		shininess: 15/*,
		normalMap: spacerNormalImg*/,
		opacity: 1,
		transparent: true
	});	
	return spacerMat;
}

function sealantMaterial () {
	return new THREE.MeshPhongMaterial({ 
		color: new THREE.Color(0.1961, 0.1961, 0.1961),
		ambient: new THREE.Color(0.1961, 0.1961, 0.1961),
		specular: new THREE.Color(0.9000, 0.9000, 0.9000),
		shininess: 20,
		opacity: 1,
		transparent: true
	});
}

function greenGlassMaterial () {
	return new THREE.MeshPhongMaterial({ 
		color: new THREE.Color(0.0314, 0.0431, 0.0314),
		ambient: new THREE.Color(0.0314, 0.0431, 0.0314),
		specular: new THREE.Color(0.9000, 0.9000, 0.9000),
		transparent: true,
		opacity: 0.8
	});
}

function sealantA_Material () {
	return new THREE.MeshPhongMaterial({ 
		color:0x454540,
		ambient: 0x31312E,
		specular: 0xEFEFEF,
		shininess: 6,
		opacity: 1,
		transparent: true
	});
}

var manageVisibility = {
	fadeOut: function (materials, tick) {
		var interval = setInterval(function(){ manageVisibility.modifyOpacity(materials, interval, -0.1); 
		}, tick);
	},
	fadeIn: function (materials, tick) {
		var interval = setInterval(function(){ manageVisibility.modifyOpacity(materials, interval, 0.1); 
		}, tick);
	},
	modifyOpacity: function (materials, interval, step) {
		var complete = 0;

		for (var i = 0; i < materials.length; i++) {
			materials[i].transparent = true;
			if(step < 0){
				//fade out
				if(materials[i].opacity < 0) complete++;}
			else{
				//fade in
				if(materials[i].opacity > 1) complete++;}

			if (complete == materials.length) clearInterval(interval);
			materials[i].opacity += step;	
		};
	}
}
