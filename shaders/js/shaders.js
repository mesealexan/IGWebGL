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

	return material;

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
}