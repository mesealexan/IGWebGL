function loadObject (name, variable, callback, animated) {
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
		if(animated){
			mesh = new THREE.SkinnedMesh( geometry, faceMaterial );
			console.log(mesh)
		}else{
			mesh = new THREE.Mesh( geometry, faceMaterial );
		}
		 
 	 	
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
	loadObject('heat_wave', heat_wave, [addToScene, addHandlers], true);
}

function addHandlers () {
	var heat_wave2 = heat_wave.mesh.clone();
	var heat_wave3 = heat_wave.mesh.clone();

	scene.add(heat_wave2);
	scene.add(heat_wave3);

	heat_wave.mesh.position.x += 4;
	heat_wave2.position.x += 26;
	heat_wave3.position.x += 46;

	ah1.setMesh(heat_wave);
	ah2.setMesh({mesh: heat_wave2});
	ah3.setMesh({mesh: heat_wave3});

	heat_wave.mesh.frustumCulled = false;
	heat_wave2.frustumCulled = false;
	heat_wave3.frustumCulled = false;

	ah1.loop(86, 161);
	ah2.loop(86, 161);	
	ah3.loop(86, 161);	
	ch.play();
}

