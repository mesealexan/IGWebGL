function loadObject (name, variable, callback, animated) {
	var mesh;
	var loader = new THREE.JSONLoader();
	var materialsArray = [];

	loader.load( "media/models/" + name + ".js", function( geometry, materials ) {
		materialsArray = materials;
			for (var i = materialsArray.length - 1; i >= 0; i--) {
				materialsArray[i] = setMaterials(materialsArray[i].name);
				console.log(materialsArray[i].name)
			};

		geometry.computeFaceNormals();
		geometry.computeVertexNormals();
		if(animated){
			mesh = new THREE.Mesh( geometry, faceMaterial );
		}else{
			mesh = new THREE.Mesh( geometry, faceMaterial );
		}
		var faceMaterial = new THREE.MeshFaceMaterial( materialsArray ); 
 	 	
 	});

	loader.onLoadComplete = function(){
		mesh.name = name;
		if(variable) variable.mesh = mesh;
		if(callback) {
			if(callback.constructor === Array)
				for (var i = 0; i < callback.length; i++) callback[i](variable);
			else callback(variable);
		}			
	};
}

 function addToScene (obj, parent) {
 	//obj.inScene = true;
	if(parent) parent.add(obj.mesh); else scene.add(obj.mesh);
 }

 function removeFromScene (obj) {
 	if(obj.mesh.material.materials)
 		for (var i = 0; i < obj.mesh.material.materials.length; i++) 
 			obj.mesh.material.materials[i].dispose();
 	else obj.mesh.material.dispose();
 	obj.mesh.parent.remove(obj.mesh);
 }

function loadAssets () {
	loadObject('floor', floor, addToScene);
	loadObject('walls', walls, addToScene);
	loadObject('snow', snow, addToScene);
	loadObject('bck', bck, addToScene);
	loadObject('grid', grid, addToScene);
	loadObject('heat_source', heat_source, addToScene);
	loadObject('text', text, addToScene);	
	loadObject('moon', moon, addToScene);
	loadObject('moon', moon, addToScene);
	//loadObject('heat_wave', heat_wave, addToScene, true);
	console.log('Loading assets')
}
