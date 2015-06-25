var menu = document.getElementById("menu");
var cutMenu = document.getElementById("cutMenu");
var backButton = document.getElementById("backButton");
var width = window.innerWidth, height = window.innerHeight;

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
	//addSkybox()
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
		scene.add( light3 );
	*/
}

function addCamera () {	
	camera = new THREE.PerspectiveCamera( fov, width / height, camNear, camFar ); 
	camera.position.set(0, 1000, 1500);
	scene.add( camera );
}

function addLensFlare () {
	var flareColor = new THREE.Color( 0xffffff );
	var smallCircles = 10;
	var smallCircleMinSize = 1;
	var smallCircleMaxSize = 10;
	var smallCircleMinDistance = 0.01;
	var smallCircleCloseness = 300;

	lensFlare = new THREE.LensFlare( textureFlare1, 256, 0.0, THREE.NormalBlending, flareColor);
	for (var i = 0; i < smallCircles; i++) {
			lensFlare.add( textureFlare2, smallCircleMinSize + (Math.random() * smallCircleMaxSize), 
				smallCircleMinDistance + (i / smallCircleCloseness) + (Math.random() / 10)
				, THREE.AdditiveBlending );
	};

	lensFlare.position.set( -1127.008, 1232.292, -11  );
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
