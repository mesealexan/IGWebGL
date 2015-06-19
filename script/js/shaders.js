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
	var directions  = ["r", "r", "u", "d", "f", "b"]; //l
	var imageSuffix = ".jpg";

	for (var i = 0; i < 6; i++)
		urls.push(imagePrefix + directions[i] + imageSuffix);

	var textureCube = THREE.ImageUtils.loadTextureCube( urls, THREE.CubeRefractionMapping );

	var refractMaterial = new THREE.MeshPhongMaterial({ 
		color: 0xccddff, 
		envMap: textureCube,
		fragmentShader: fragmentShader(),
		refractionRatio: 0.985, 
		reflectivity: 0.9,
		specular: 0x222222,  
		emissive: 0x006063,
		shininess: 30,
		transparent: true,
		opacity: 0.3
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
		//"uniform vec3 cameraPosition;"+
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
		//"uniform vec3 cameraPosition;"+
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
		shininess: 40,
		normalMap: bmap
	});	
	return spacerMat;
}

function sealantMaterial () {
	return new THREE.MeshPhongMaterial({ 
		color: new THREE.Color(0.1961, 0.1961, 0.1961),
		ambient: new THREE.Color(0.1961, 0.1961, 0.1961),
		specular: new THREE.Color(0.9000, 0.9000, 0.9000),
		shininess: 20
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
		color: new THREE.Color(0.1922, 0.1922, 0.1922),
		ambient: new THREE.Color(0.1922, 0.1922, 0.1922),
		specular: new THREE.Color(0.9000, 0.9000, 0.9000)
	});
}
