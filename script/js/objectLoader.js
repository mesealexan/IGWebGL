function loadObject (name, material, callback, variable, initiallyVisible) {
	var mesh;
	var loader = new THREE.JSONLoader();
	var materialsArray = [];

	loader.load( "media/models/" + name + ".js", function( geometry, materials ) {

		materialsArray = materials;
		for (var i = materialsArray.length - 1; i >= 0; i--) {
			materialsArray[i] = setMaterials(materialsArray[i].name);
		};
		geometry.computeFaceNormals();
		geometry.computeVertexNormals();

		var faceMaterial = new THREE.MeshFaceMaterial( materialsArray ); 
 	 	mesh = new THREE.Mesh( geometry, faceMaterial );
 	});

	loader.onLoadComplete = function(){
		mesh.name = name;
		if(initiallyVisible != undefined) mesh.visible = initiallyVisible;
		if(variable) variable.mesh = mesh;
		if(callback) callback(variable);
	};
}

 function addToScene (obj) {
 	obj.inScene = true;
	scene.add(obj.mesh);
 }

function loadAssets () {	
	textureFlare1 = THREE.ImageUtils.loadTexture( "media/LensFlare/Flare_1.png", function(){},function(){
	textureFlare2 = THREE.ImageUtils.loadTexture( "media/LensFlare/Flare_2.png", function(){},function(){
	textureFlare3 = THREE.ImageUtils.loadTexture( "media/LensFlare/Flare_3.png", function(){},function(){
	textureFlare4 = THREE.ImageUtils.loadTexture( "media/LensFlare/Flare_4.png", function(){},function(){
	textureFlare5 = THREE.ImageUtils.loadTexture( "media/LensFlare/Flare_5.png", function(){},function(){
	textureFlare6 = THREE.ImageUtils.loadTexture( "media/LensFlare/Flare_6.png", function(){},function(){
		addLensFlare();
	});});});});});});
	loadObject('cardinal_slice', undefined, addToScene, slice, false);
	loadObject('cardinal_vertical', undefined, addToScene, windowVertical, false);
	loadObject('cardinal_horizontal', undefined, addToScene, windowHorizontal);
 } 
