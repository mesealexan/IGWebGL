var urls = [];
var imagePrefix = "media/skybox/cube_";
var directions  = ["r", "l", "u", "d", "f", "b"]; //l
var imageSuffix = ".jpg";

for (var i = 0; i < 6; i++)
	urls.push(imagePrefix + directions[i] + imageSuffix);

var textureCube = THREE.ImageUtils.loadTextureCube( urls, THREE.CubeRefractionMapping );

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
