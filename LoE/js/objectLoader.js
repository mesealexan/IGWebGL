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

 function addToScene (obj, parent) {
 	obj.inScene = true;
	if(parent) parent.add(obj.mesh); else scene.add(obj.mesh);
 }

function loadAssets () {
	setInitialCameraPos();
	makeTextureCube();

	loadObject('window', [addToScene, function () {
 	 loadObject('mobile_glass', [addToScene, function(){
      loadObject('pouring', [addToScene, function(){
       loadObject('fixed_glass', function(){ //add to scene later
        loadObject('text', [addToScene, function(){
         loadObject('rotator', function(){
          loadObject('rail', [addToScene,function(){          	
         	loadObject('plane', [addToScene, function(){
         	 loadObject('tambur_a', function(){
         	  loadObject('tambur_b', [manageCameraAnimations.playAnim_1, placeTambur,
         	  function(){         
         			plane.mesh.scale.z /= 5;
         	  		rotator.mesh.position.set(-8323.986, -142.658, -4.892);
         	  		rotator.rotateZ = rotateZ; 	
         	  		rotator.rotateZ(-1, tamburRotateTime, Infinity);
         	  		addToScene(rotator, rail.mesh);
          			addToScene(fixed_glass, rail.mesh);
         	  }, addSilverPlanes ,moveMobileGlass.play, moveFixedGlass.play, addPouringPlane,
         	  	animate], tambur_b);
         	 }, tambur_a);
           }], plane);
          }], rail);
         }, rotator);
        }], text);
       }, fixed_glass);
      }], pouring);
     }], mobile_glass);
	}], _window);
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
	var geometry = new THREE.PlaneBufferGeometry( 1040, 785 );
	var offsetX = 15074 / 2 + 505 + 519 / 2;
	var offsetY = 359;

	for (var i = 0; i < silver_Planes_pos.positions.length; i++) {
		var planeObj = {};		
		planeObj.mesh = new THREE.Mesh( geometry.clone(), silverCoatingMaterial(coatingStart, coatingEnd) );
		planeObj.mesh.rotation.x += Math.PI / 2;
		planeObj.mesh.rotation.z += Math.PI;																			             //magic
		planeObj.mesh.position.set(silver_Planes_pos.positions[i].position.x + offsetX, 
							    silver_Planes_pos.positions[i].position.z + offsetY,
							    -silver_Planes_pos.positions[i].position.y);

		fixed_glass['plane' + (i + 1).toString()] = planeObj;
		addToScene(planeObj, fixed_glass.mesh)
	};
	
	planeObj.mesh = new THREE.Mesh( geometry.clone(), silverCoatingMaterial(coatingStart, coatingEnd) );
	planeObj.mesh.rotation.x += Math.PI / 2;	
	planeObj.mesh.rotation.z += Math.PI;						             
	planeObj.mesh.position.copy(mobile_glass.mesh.position);
	planeObj.mesh.position.y += 10;

	mobile_glass.plane = planeObj;
	addToScene(planeObj, mobile_glass.mesh)
}

function addPouringPlane () {
	pouring.mesh.visible = false;
	var geometry = new THREE.PlaneBufferGeometry( 145, 785 );
	plane.mesh = new THREE.Mesh( geometry.clone(), silverCoatingMaterial(1.5, 1.51) );
	plane.mesh.material.tween(coatingTime, 0, Infinity);
	plane.mesh.rotation.y += Math.PI / 2;	
	plane.mesh.rotation.x -= Math.PI / 2;	
	plane.mesh.position.copy(rotator.mesh.position);
	plane.mesh.position.y -= 145;		
	plane.mesh.position.x += 10;	
	addToScene(plane);
}

