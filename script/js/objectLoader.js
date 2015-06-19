var cardinal1materials, cardinal2materials;

function loadObject (name, material, callback) {
	var mesh;
	var loader = new THREE.JSONLoader();
	var materialsArray = [];

	if(material.constructor == Array) materialsArray = materialsArray.concat(material);
	else materialsArray.push(material);

	loader.load( "media/models/" + name + ".js", function( geometry, materials ) {
	    var faceMaterial = new THREE.MeshFaceMaterial( materialsArray ); 
        mesh = new THREE.Mesh( geometry, faceMaterial );
    });

	loader.onLoadComplete = function(){
		mesh.name = name;
		if(callback)callback(mesh);
    	scene.add(mesh);
	};
}

function loadImages () {	
	bmap = THREE.ImageUtils.loadTexture("media/models/spacer.jpg", function(){},function(){});
	loadMaterials();
 } 

function loadMaterials () {
	cardinal1materials = [spacerMaterial(), sealantMaterial(), glassMaterial1(), 
						  greenGlassMaterial(), sealantA_Material()];

 	cardinal2materials = [spacerMaterial(), sealantMaterial(), glassMaterial1(), 
						  greenGlassMaterial(), sealantA_Material(), sealantMaterial()];
}