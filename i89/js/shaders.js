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
