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

function loadAssets () {
	setInitialCameraPos();
	makeTextureCube();

	coat1_text = THREE.ImageUtils.loadTexture( "media/models/coat1_text.png", {}, function(){
	coat2_t = THREE.ImageUtils.loadTexture( "media/models/rotator.png", {}, function(){
	coat1_t = THREE.ImageUtils.loadTexture( "media/models/coat1.png", {}, function(){
	cold_t = THREE.ImageUtils.loadTexture( "media/img/cold.jpg", {}, function(){
	hot_t = THREE.ImageUtils.loadTexture( "media/img/hot.jpg", {}, function(){
	mixed_t = THREE.ImageUtils.loadTexture( "media/img/mixed.jpg", {}, function(){

	loadObject('bck_1', bck_1, [addToScene, function () { 
		bck_1.mesh.material = textureFadeMaterial();

	loadObject('window', _window, [addToScene, function () {
	loadObject('window_shadow', window_shadow, function () {
 		window_shadow.mesh.material.materials[0].opacity = 0;
		window_shadow.mesh.material.materials[0].tweenOpacity = tweenOpacity;
		addToScene(window_shadow, _window.mesh);
	loadObject('mobile_glass', mobile_glass, [addToScene, function(){
	loadObject('pouring', pouring, [addToScene, function(){
	loadObject('fixed_glass', fixed_glass, function(){
	loadObject('text', text, [addToScene, function(){
	loadObject('rotator', rotator, function(){
	loadObject('rail', rail, [addToScene,function(){          	
 	loadObject('plane', plane, [addToScene, function(){
 		plane.mesh.material.materials[0].transparent = true;
 		plane.mesh.material.materials[0].tweenOpacity = tweenOpacity;
    loadObject('tambur_a', tambur_a, function(){
    loadObject('tambur_b', tambur_b, [
        function(){         
			plane.mesh.scale.z /= 5;
	  		rotator.mesh.position.set(-8323.986, -142.658, -4.892);
	  		rotator.rotateZ = rotateZ; 	
	  		rotator.rotateZ(-1, tamburRotateTime, Infinity);
	  		addToScene(rotator, rail.mesh);
			addToScene(fixed_glass, rail.mesh);
			//addTestPlane();
			addPouringPlane();
			manageCameraAnimations.playAnim_1();
        }, addSilverPlanes, moveMobileGlass.play, moveFixedGlass.play, moveWindow.play,
        	placeTambur, animate], tambur_b);
	});
	}]);
	}]);
	});
	}]);
	});
	}]);
	}]);
	}, false); //window_shadow
	}]);
	}], false); //bck_1
	})})})})})})
}

function placeTambur () {
	var loopTo = 0;
	//in case of unequal number of tambur
	if(tambur_a_pos.positions.loopTogth > tambur_b_pos.positions.loopTogth)
		loopTo = tambur_a_pos.positions.length;
	else loopTo = tambur_b_pos.positions.length;

	for (var i = 0; i < loopTo; i++) {
		var newTambur_a = {}, newTambur_b = {};
		newTambur_a.mesh = tambur_a.mesh.clone();
		newTambur_b.mesh = tambur_b.mesh.clone();

		var newTambur_a_pos = new THREE.Vector3(
			tambur_a_pos.positions[i].position.x,
			tambur_a_pos.positions[i].position.z, 
			-tambur_a_pos.positions[i].position.y);

		var newTambur_b_pos = new THREE.Vector3(
			tambur_b_pos.positions[i].position.x,
			tambur_b_pos.positions[i].position.z, 
			-tambur_b_pos.positions[i].position.y);

		newTambur_a.mesh.position.copy(newTambur_a_pos);
		newTambur_b.mesh.position.copy(newTambur_b_pos);

		newTambur_a.rotateZ = rotateZ;
		newTambur_b.rotateZ = rotateZ;
		newTambur_a.rotateZ(1, tamburRotateTime, Infinity);
		newTambur_b.rotateZ(1, tamburRotateTime, Infinity);

		if(tambur_a_pos.positions[i])addToScene(newTambur_a, rail.mesh);
		if(tambur_b_pos.positions[i])addToScene(newTambur_b, rail.mesh);		
	};	
} 

function addSilverPlanes () {
	var geometry = new THREE.PlaneBufferGeometry( 1040 - 50 , 785 -25 );
	var offsetX = 15074 / 2 + 505 + 519 / 2;
	var offsetY = 359;

	for (var i = 0; i < silver_Planes_pos.positions.length; i++) {
		var planeObj = {};		
		planeObj.mesh = new THREE.Mesh( geometry.clone(), silverCoatingMaterial(3.0) );
		planeObj.mesh.rotation.x += Math.PI / 2;
		planeObj.mesh.rotation.z += Math.PI;																			             //magic
		planeObj.mesh.position.set(silver_Planes_pos.positions[i].position.x + offsetX, 
							    silver_Planes_pos.positions[i].position.z + offsetY,
							    -silver_Planes_pos.positions[i].position.y);

		fixed_glass['plane' + (i + 1).toString()] = planeObj;
		addToScene(planeObj, fixed_glass.mesh)
	};
	
	planeObj.mesh = new THREE.Mesh( geometry.clone(), silverCoatingMaterial(3.0, coat1_text) );
	planeObj.mesh.rotation.x += Math.PI / 2;	
	planeObj.mesh.rotation.z += Math.PI / 2;						             
	planeObj.mesh.position.copy(mobile_glass.mesh.position);
	planeObj.mesh.position.y += 5;

	mobile_glass.plane = planeObj;
	addToScene(planeObj, mobile_glass.mesh)
}

function addPouringPlane () {
	pouring.mesh.visible = false;
	var plane = {};
	var geometry = new THREE.PlaneBufferGeometry( 145, 785 );
	plane.mesh = new THREE.Mesh( geometry.clone(), pouringMaterial() );
	//plane.mesh.material.tween(coatingTime * 5, 0, Infinity);
	plane.mesh.rotation.y += Math.PI / 2;	
	plane.mesh.rotation.x -= Math.PI / 2;	
	plane.mesh.position.copy(rotator.mesh.position);
	plane.mesh.position.y -= 145;		
	plane.mesh.position.x += 10;	
	pouring.mesh = plane.mesh;
	addToScene(plane);
}

var testPlane = {};
function addTestPlane () {
	var geometry = new THREE.PlaneBufferGeometry( 1040 * 2, 785 * 2);
	testPlane.mesh = new THREE.Mesh( geometry.clone(), silverCoatingMaterial(4.0) );
	testPlane.mesh.material.tween(coatingTime, 0, Infinity);
	testPlane.mesh.rotation.x += Math.PI / 2;
	testPlane.mesh.rotation.z += Math.PI;											
	testPlane.mesh.position.set(-12194.1, 125.994, 925.417);
	addToScene(testPlane);
}
