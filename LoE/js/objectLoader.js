function loadObject (name, callback, variable, initiallyVisible, initialOpacity) {
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

 function addToScene (obj) {
 	obj.inScene = true;
	scene.add(obj.mesh);
 }

function loadAssets () {
	setInitialCameraPos();
	makeTextureCube();
	//manageCameraAnimations.playAnim_1, animate,
	loadObject('window', [addToScene, function () {
	 loadObject('text', [addToScene, function(){
	  loadObject('rotator', [addToScene, function(){
	   loadObject('rail', [addToScene, function(){
	  	loadObject('plane', [addToScene, function(){
	  	 loadObject('tambur_a', function(){
	  	  loadObject('tambur_b', [manageCameraAnimations.playAnim_1, animate, function(){

	  	  }], tambur_b);
	  	 }, tambur_a);
	    }], plane);
	   }], rail);
	  }], rotator);
	 }], text);
	}], _window);
 }

function placeTambur () {
	var len;

	if(tambur_a_pos.positions.length > tambur_b_pos.positions.length)
		len = tambur_a_pos.positions.length;
	else len = tambur_b_pos.positions.length;

	for (var i = 0; i < len; i++) {
		var newTambur_a = tambur_a
	};
} 
