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

		if(animated) mesh = new THREE.SkinnedMesh( geometry, faceMaterial );
		else mesh = new THREE.Mesh( geometry, faceMaterial );
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

 //function removeFromScene (obj) {
 //	if(obj.mesh.material.materials)
 //		for (var i = 0; i < obj.mesh.material.materials.length; i++)
 //			obj.mesh.material.materials[i].dispose();
 //	else obj.mesh.material.dispose();
 //	obj.mesh.parent.remove(obj.mesh);
 //}

function loadAssets () {
	loadObject('floor', floor, addToScene);
	loadObject('walls', walls, addToScene);
	loadObject('snow', snow, addToScene);
	loadObject('bck', bck, addToScene);
	loadObject('grid', grid, addToScene);
	loadObject('heat_source', heat_source, addToScene);
    loadObject('text', text, addToScene);
    loadObject('text_2', text, addToScene);
    loadObject('moon', moon, addToScene);
	loadObject('moon', moon, addToScene);
	loadObject('frame', frame, addToScene);
	loadObject('i89', i89, addToScene);
    loadObject('window_plane', window_plane, [addToScene, setupWindowPlane]);
    loadObject('heat_wave', heat_wave, addToScene, true);
    loadObject('heat_wave_refract', heat_wave_refract, addToScene, true);
    loadObject('heat_wave_reflect', heat_wave_reflect, [addToScene, addHandlers], true);
}

function setupWindowPlane(){
    window_plane.mesh.visible = false;
    window_plane.mesh.scale.set(1.5, 1.5, 1);
    window_plane.mesh.position.setY(-35);
}

function addHandlers () {
    heat_wave2 = heat_wave.mesh.clone();
    heat_wave3 = heat_wave.mesh.clone();
    heat_wave_reflect2 = heat_wave_reflect.mesh.clone();
    heat_wave_reflect3 = heat_wave_reflect.mesh.clone();

	scene.add(heat_wave2);
	scene.add(heat_wave3);
    scene.add(heat_wave_reflect2);
    scene.add(heat_wave_reflect3);

    manageWaves();

	ah1.setMesh([heat_wave, {mesh: heat_wave2}, {mesh: heat_wave3}]);
	ah2.setMesh(heat_wave_refract);
	ah3.setMesh([heat_wave_reflect, {mesh: heat_wave_reflect2}, {mesh: heat_wave_reflect3}]);

    window_plane.mesh.position.z = 2;
    heatWaves.scaleWindowPlane();
    ch.setSource("media/camera/camera.JSON");
    addWatch(ch, "frame");
	ch.play();

    function manageWaves(){
        heat_wave.mesh.frustumCulled =
        heat_wave2.frustumCulled =
        heat_wave3.frustumCulled =
        heat_wave.mesh.visible =
        heat_wave2.visible = heat_wave3.visible =
        heat_wave_refract.mesh.visible =
        heat_wave_reflect.mesh.visible =
        heat_wave_reflect2.visible =
        heat_wave_reflect3.visible = false;

        heat_wave.mesh.position.x += 4;
        heat_wave2.position.x += 26;
        heat_wave3.position.x += 46;

        heat_wave_refract.mesh.position.x += 4;
        heat_wave_reflect.mesh.position.x += 4;
        heat_wave_reflect2.position.x += 26;
        heat_wave_reflect3.position.x += 46;
    }
}

