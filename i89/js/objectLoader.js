function loadObject (name, variable, callback, initiallyVisible, initialOpacity) {
	var mesh;
	var loader = new THREE.JSONLoader();
	var materialsArray = [];

	loader.load( "media/models/" + name + ".js", function( geometry, materials ) {
		materialsArray = materials;
		for (var i = materialsArray.length - 1; i >= 0; i--) {
			if(initialOpacity != undefined) materialsArray[i].opacity = initialOpacity;
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

 function addToScene (obj, parent) {
 	obj.inScene = true;
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

}
