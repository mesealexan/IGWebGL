var cardinal1materials, cardinal2materials;
var windowHorizontal, windowVertical;

function loadObject (name, material, callback) {
	var mesh;
	var loader = new THREE.JSONLoader();
	var materialsArray = [];

	if(material.constructor == Array) materialsArray = materialsArray.concat(material);
	else materialsArray.push(material);

	loader.load( "media/models/" + name + ".js", function( geometry, materials ) {
		geometry.computeFaceNormals();
		geometry.computeVertexNormals();
	    var faceMaterial = new THREE.MeshFaceMaterial( materialsArray ); 
        mesh = new THREE.Mesh( geometry, faceMaterial );
    });

	loader.onLoadComplete = function(){
		mesh.name = name;
		if(callback)callback(mesh);
    	//scene.add(mesh);
    	//if(variable) variable = mesh;
    	//return mesh;
	};
}

function loadAssets () {	
	bmap = THREE.ImageUtils.loadTexture("media/models/spacer.jpg", function(){},function(){});
	loadMaterials();
	loadAnimations();
<<<<<<< HEAD
	loadObject('cardinal2', cardinal2materials, addToScene);
=======
	loadObject('cardinal2', cardinal2materials);
	loadObject('cardinal_vertical', cardinal2materials);
	loadObject('slice', cardinal2materials);
>>>>>>> origin/master
 } 

 function addToScene (obj) {
	scene.add(obj);
 }

function loadMaterials () {
	cardinal1materials = [spacerMaterial(), sealantMaterial(), glassMaterial1(), 
						  greenGlassMaterial(), sealantA_Material()];

 	cardinal2materials = [sealantMaterial(), glassMaterial1(), greenGlassMaterial(), sealantA_Material(), spacerMaterial()];
}
function loadAnimations () {
	for (var i = 0; i < 6; i++) {
		cameraAnimations.push(parseJSON('media/camera/anim_' + (i + 1) + '.JSON'));
		cameraAnimations[i].duration = (cameraAnimations[i].frames.length / 
			cameraAnimations[i].fps) * 1000; //to ms
	};
}