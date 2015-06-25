var urls = [];
var imagePrefix = "media/skybox/Cube_";
var directions  = ["r", "l", "u", "d", "f", "b"]; 
var imageSuffix = ".jpg";

for (var i = 0; i < 6; i++)
	urls.push(imagePrefix + directions[i] + imageSuffix);

var textureCube = THREE.ImageUtils.loadTextureCube( urls, THREE.CubeRefractionMapping );

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
	switch(materialName) {
	    case 'sealant a':
		    material = new THREE.MeshPhongMaterial({
		    	color: new THREE.Color("rgb(213,213,213)"),
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
		    	specular: new THREE.Color("rgb(191,188,175)"),
		    	emissive: new THREE.Color("rgb(113,106,76)")
		    	
		    })
	        break;
	    case 'desicant':
		    material = new THREE.MeshLambertMaterial({
		    	color: new THREE.Color("rgb(198,204,151)"),
		    	ambient: new THREE.Color("rgb(198,204,151)"),
		    	transparent: true,
		    	opacity: 0.75
		    	
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
