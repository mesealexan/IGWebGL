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
		if(variable){
			variable.mesh = mesh;
		}
		if(callback)callback(variable);
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
	// loadJSON('text', undefined, undefined, text);
	loadObject('cardinal_horizontal', undefined, addToScene, windowHorizontal);
	// loadObject('cardinal_vertical', undefined, undefined, windowVertical);
	// loadObject('cardinal_slice', undefined, undefined, slice);	
 } 

function loadAnimations () {
	for (var i = 0; i < 7; i++) {
		cameraAnimations.push(parseJSON('media/camera/anim_' + (i + 1) + '.JSON'));
		cameraAnimations[i].duration = (cameraAnimations[i].frames.length / 
			cameraAnimations[i].fps) * 1000; //to ms
	};
}