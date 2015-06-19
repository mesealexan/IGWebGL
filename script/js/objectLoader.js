var cardinal1materials, cardinal2materials;
var text = {}, windowHorizontal = {}, windowVertical = {}, slice = {};

function loadObject (name, material, callback, variable) {
	var mesh;
	var loader = new THREE.JSONLoader();
	var materialsArray = [];

	loader.load( "media/models/" + name + ".js", function( geometry, materials ) {
		if(material == undefined) material = materials;
		if(material.constructor == Array) materialsArray = materialsArray.concat(material);
		else materialsArray.push(material);

		geometry.computeFaceNormals();
		geometry.computeVertexNormals();
	    var faceMaterial = new THREE.MeshFaceMaterial( materialsArray ); 
        mesh = new THREE.Mesh( geometry, faceMaterial );
    });

	loader.onLoadComplete = function(){
		mesh.name = name;
		if(variable)variable.mesh = mesh;
		if(callback)callback(mesh);
	};
}

function loadAssets () {	
	bmap = THREE.ImageUtils.loadTexture("media/models/spacer.jpg", function(){},function(){});
	loadMaterials();
	loadAnimations();
	//loadObject('text', undefined, addToScene, text);
	loadJSON('text');
	loadObject('cardinal2', cardinal2materials, addToScene, windowHorizontal);
	//loadObject('cardinal_vertical', cardinal2materials);
	//loadObject('slice', cardinal2materials);
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