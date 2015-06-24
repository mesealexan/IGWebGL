var menu = document.getElementById("menu");
var cutMenu = document.getElementById("cutMenu");
var backButton = document.getElementById("backButton");
var width = window.innerWidth, height = window.innerHeight;
var animation_interval = setInterval(function(){},10);
Init();

function Init() {
	container = document.getElementById( 'webGL' );	
	scene = new THREE.Scene();
	loadAssets();	
	addRenderer();
	addCamera();
	addControls();	
	addLight();
	initKeyboard();
	manageCameraAnimations.playAnim_1();
	animate();
	makeSkybox()
}

function loadJSON (name, material, callback, variable) {
	var mesh;
	var loader = new THREE.JSONLoader();

	loader.load( "media/models/" + name + ".js", function( geometry, materials ) {
	    var material = new THREE.MeshFaceMaterial( materials ); 
        mesh = new THREE.Mesh( geometry, material );
    });

	loader.onLoadComplete = function(){		
		mesh.name = name;
		if(callback)callback(mesh);
		if(variable)variable.mesh = mesh;
    	scene.add(mesh);
	};
}

function addRenderer() {
	renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setClearColor( 0x000000, 0.0 );
	renderer.setSize( width, height ); 
	container.appendChild( renderer.domElement );
}

function addLight () {
	var ambientLight = new THREE.AmbientLight( 0x666666 );
	scene.add( ambientLight );

	scene.fog = new THREE.Fog(0x13161d, 3000, 6000);

	var light1 = new THREE.PointLight( 0xffffff, 1, 10000 );
		light1.position.set( -2929, 2686, 938 );
		scene.add( light1 );

	var light2 = new THREE.PointLight( 0xffffff, 1, 10000 );
		light2.position.set( 345,3562,-4050 );
		scene.add( light2 );

	var light3 = new THREE.PointLight( 0xffffff, 1, 10000 );
		light3.position.set( 3615,2688,843 );
		scene.add( light3 );
/*
	var light = new THREE.PointLight( 0xffffff, 1, 10000 );
		light.position.set( -750,1073,5852 );
		scene.add( light );


	var light2 = new THREE.PointLight( 0xffffff, 1, 10000 );
		light2.position.set( 0, 5746, 2028 );
		scene.add( light2 );

	var light3 = new THREE.PointLight( 0xffffff, 1, 10000 );
		light3.position.set(4177, -1014, 1350 );
		scene.add( light3 );*/
}

function addCamera () {	
	camera = new THREE.PerspectiveCamera( fov, width / height, camNear, camFar ); 
	camera.position.set(0, 1000, 1500);
	scene.add( camera );
}

function addLensFlare () {
	var flareColor = new THREE.Color( 0xffffff );
	lensFlare = new THREE.LensFlare( textureFlare1, 300, 0.0, THREE.NormalBlending, flareColor);
	lensFlare.add( textureFlare2, 64, 0.1, THREE.AdditiveBlending );
	lensFlare.add( textureFlare2, 32, 0.12, THREE.AdditiveBlending );
	//console.log(textureFlare2)
	//lensFlare.lensFlares.push( textureFlare2 );
	// lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
	// lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );

	// lensFlare.add( textureFlare3, 60, 0.6, THREE.AdditiveBlending );
	// lensFlare.add( textureFlare3, 70, 0.7, THREE.AdditiveBlending );
	// lensFlare.add( textureFlare3, 120, 0.9, THREE.AdditiveBlending );
	// lensFlare.add( textureFlare3, 70, 1.0, THREE.AdditiveBlending );
	//x: -1527.008, y: 2502.779999999999, z: 1431.912
	lensFlare.position.set( -1527, 2502, 1431 );
	scene.add( lensFlare );
}

function parseJSON(file) {
	//	file - JSON path
	//	returns JS object
	var request = new XMLHttpRequest();
   		request.open("GET", file, false);
   		request.send(null)
   	var JSON_object = JSON.parse(request.responseText);
   	return JSON_object;
}
