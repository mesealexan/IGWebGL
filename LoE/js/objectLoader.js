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
         	  		rotator.mesh.position.set(-8323.986, -142.658, -4.892);
         	  		rotator.rotate = rotate; 	
         	  		rotator.rotate('z', -1, tamburRotateTime, Infinity);
         	  		//addTestPlane();	
         	  		addToScene(rotator, rail.mesh);

          			addToScene(fixed_glass, rail.mesh);
          			moveFixedGlass.play();
          			moveMobileGlass.play()
          			animate();
         	  }], tambur_b);
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

		newTambur_a.rotate = rotate;
		newTambur_b.rotate = rotate;
		newTambur_a.rotate('z', 1,tamburRotateTime, Infinity);
		newTambur_b.rotate('z', 1,tamburRotateTime, Infinity);

		if(tambur_a_pos.positions[i])addToScene(newTambur_a, rail.mesh);
		if(tambur_b_pos.positions[i])addToScene(newTambur_b, rail.mesh);		
	};	
} 

function addTestPlane () {
	var geometry = new THREE.PlaneGeometry( 1500, 800 );
	var material = shaderMaterial1();//new THREE.MeshBasicMaterial( {color: 0xff0000, side: THREE.DoubleSide} );
	var plane = new THREE.Mesh( geometry, material );
	plane.rotation.x += Math.PI / 2;
	plane.rotation.z += Math.PI;
	plane.position.set(-12199.081, -400, -42.954);
	scene.add(plane);
}

