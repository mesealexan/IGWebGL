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

function loadMaterials () {
	cardinalVerticalMaterials = cardinal2materials = [
 		sealantA_Material(),	// 0
 		glassMaterial1(),		// 1
 		greenGlassMaterial(),	// 2
 		sealantA_Material(),	// 3
	 	sealantMaterial(),		// 4
	 	spacerMaterial()		// 5
	 ];

    sliceMaterials = [
    	sealantA_Material(),	// 0
    	sealantA_Material(),	// 1
    	sealantA_Material(),	// 2
    	glassMaterial1(),		// 3
    	greenGlassMaterial(),	// 4
    	spacerMaterial(),		// 5
    	glassMaterial1()		// 6

    ];
}

function loadAssets () {	
	//spacerNormal = THREE.ImageUtils.loadTexture("media/models/spacer.jpg", function(){},function(){});
	// loadMaterials();
	// loadAnimations();
	//loadObject('text', undefined, addToScene, text);
	
	loadObject('cardinal_slice', undefined, addToScene, slice, false);
	loadObject('cardinal_vertical', undefined, addToScene, windowVertical, false);
	loadObject('cardinal_horizontal', undefined, addToScene, windowHorizontal);
	// loadObject('cardinal_vertical', undefined, undefined, windowVertical);
	// loadObject('cardinal_slice', undefined, undefined, slice);	
 } 
