function loadObject (name, variable, callback, animated) {
	var mesh;
	var loader = new THREE.JSONLoader();
	var materialsArray = [];

	loader.load( "media/models/" + name + ".js", 
        function( geometry, materials ) {
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

function loadAssets () {
	loadObject('floor', floor, addToScene);
	loadObject('walls', walls, addToScene);
	loadObject('snow', snow, addToScene);
	loadObject('bck', bck, addToScene);
	loadObject('grid', grid, addToScene);
	loadObject('heat_source', heat_source, [addToScene, function(){
    loadObject('text', text, addToScene);
    loadObject('winterNight', text, addToScene);
    loadObject('winterNight', text, addToScene);
    loadObject('moon', moon, addToScene);
	loadObject('logo', logo, addToScene);
	loadObject('frame', frame, [addToScene, function(){
        loadObject('i89', i89, [addToScene, function(){
        loadObject('window_plane', window_plane, [addToScene, setupWindowPlane, function(){
        loadObject('heat_wave', heat_wave, [addToScene, function(){
        loadObject('heat_wave_refract', heat_wave_refract, [addToScene, function(){
        loadObject('heat_wave_reflect', heat_wave_reflect, [addToScene, addHandlers,
        manageWaves, animate], true);
    }]);
    }], true);
    }], true);
    }]);
    }]);
    }]);
}

function setupWindowPlane(){
    window_plane.mesh.visible = false;
    window_plane.mesh.scale.set(1.5, 1.5, 1);
    window_plane.mesh.position.setY(-35);
}

function addHandlers () {
    bck2 = bck.mesh.clone();
    bck2.scale.z = -1;
    bck2.material.materials[0].side = 2;
    bck2.quaternion.set ( 0, 1, 0, 0);

    heat_wave2 = heat_wave.mesh.clone();
    heat_wave3 = heat_wave.mesh.clone();
    heat_wave_reflect2 = heat_wave_reflect.mesh.clone();
    heat_wave_reflect3 = heat_wave_reflect.mesh.clone();

    scene.add(bck2);
	scene.add(heat_wave2);
	scene.add(heat_wave3);
    scene.add(heat_wave_reflect2);
    scene.add(heat_wave_reflect3);

	ah1.setMesh([heat_wave, {mesh: heat_wave2}, {mesh: heat_wave3}]);
	ah2.setMesh(heat_wave_refract);
	ah3.setMesh([heat_wave_reflect, {mesh: heat_wave_reflect2}, {mesh: heat_wave_reflect3}]);

    window_plane.mesh.position.z = 0;
    heatWaves.scaleWindowPlane();
    addWatch(ch, "frame");

    sh1.start();
    sh2.start();
    sh3.start();
	ch.play();
}

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
