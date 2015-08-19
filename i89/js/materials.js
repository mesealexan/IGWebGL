var imagePrefix = "media/skybox/Cube_";
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
	for (var i = 0; i < 6; i++){
		materialArray.push( new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
			side: THREE.DoubleSide
		}));
	console.log( imagePrefix + directions[i] + imageSuffix)
	}
	var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
	var skyBox = new THREE.Mesh( cubeGeom, skyMaterial );
	scene.add( skyBox );
}

function setMaterials(materialName){
	var material;
	switch(materialName){ 
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