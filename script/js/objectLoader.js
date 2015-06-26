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
		if(callback) {
			if(callback.constructor === Array)
				for (var i = 0; i < callback.length; i++) callback[i](variable);
			else callback(variable);
		}			
	};
}

 function addToScene (obj) {
 	obj.inScene = true;
	scene.add(obj.mesh);
 }

function loadAssets () {	
	makeTextureCube();

	textureFlare1 = THREE.ImageUtils.loadTexture( "media/LensFlare/Flare_1.png", function(){},function(){
	textureFlare2 = THREE.ImageUtils.loadTexture( "media/LensFlare/Flare_2.png", function(){},function(){
		addLensFlare();
	});})

	loadObject('cardinal_horizontal', undefined, [addToScene, function(){
	windowHorizontal.mesh.material.materials[8].visible = false;
	addWhitePlane();
	loadObject('cardinal_vertical', undefined, [addToScene, function(){
	loadObject('cardinal_slice', undefined,  [addToScene, animate], slice, false);
	}], windowVertical, false);
	}], windowHorizontal);
 } 
