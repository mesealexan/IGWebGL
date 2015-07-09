var menu = document.getElementById("menu");
var background = document.getElementById("background"); 
var sliceMenu = document.getElementById("sliceMenu");
var backButton = document.getElementById("backButton");
var width = window.innerWidth, height = window.innerHeight;
aspectRatio = width / height;

Init();

function Init() {
	if(!webgl_detect()) return;	
	container = document.getElementById( 'webGL' );	
	scene = new THREE.Scene();
	loadAssets();	
	addRenderer();
	detectOrientationChange();
	addCamera();
	var winResize = new THREEx.WindowResize(renderer, camera);
	addControls();	
	addLight();
	initColors();	
	//animate(); //called in objectLoader.js when all meshes are loaded
	addSkybox();
}

function addRenderer() {
	renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setClearColor( 0x000000, 0.0 );
	renderer.setSize( width, height ); 
	container.appendChild( renderer.domElement );
}

function addLight () {
	var ambientLight = new THREE.AmbientLight( 0x999999 );
	scene.add( ambientLight );

	//scene.fog = new THREE.Fog(0x13161d, 3000, 6000);

	var light1 = new THREE.PointLight( 0xffffff, 1, 10000 );
		light1.position.set( -12170,1063,-2025 );
		scene.add( light1 );

	var light2 = new THREE.PointLight( 0xffffff, 1, 10000 );
		light2.position.set( -4870,-163,-2469 );
		scene.add( light2 );

	var spotLight = new THREE.SpotLight( 0xffffff );
		spotLight.position.set( 18398, 13569, 17048 );
		spotLight.intensity = 1;
		scene.add( spotLight );

}

function addCamera () {	
	if (window.matchMedia("(orientation: portrait)").matches) fovModifier = 40;
	else fovModifier = 0;

	camera = new THREE.PerspectiveCamera( fov + fovModifier, width / height, camNear, camFar ); 
	camera.position.set(0, 1000, 1500);
	scene.add( camera );
}

function detectOrientationChange () {
	$(window).on("orientationchange", function(){		
		aspectRatio = width / height; 

		// Portrait
		if(window.orientation == 0) fovModifier = 40;
		// Landscape
		else fovModifier = 0;

		camera.fov = fov + fovModifier;
		camera.updateProjectionMatrix();
	});
}

function addWhitePlane () {
	var side = 10000;
	var geometry = new THREE.PlaneBufferGeometry( side, side );
	var material = new THREE.MeshLambertMaterial( {color: 0xffffff, ambient: 0xffffff, 
		specular: 0xffffff, emissive: 0x333333, side: THREE.FrontSide} );
	var plane = new THREE.Mesh( geometry, material );

	plane.rotation.x -= Math.PI / 2;
	plane.position.set(0, -100, 0);
	scene.add( plane );
}

function addLensFlare () {
	var flareColor = new THREE.Color( 0xffffff );
	var smallCircles = 10;
	var smallCircleMinSize = 1;
	var smallCircleMaxSize = 10;
	var smallCircleMinDistance = 0.01;
	var smallCircleCloseness = 300;

	lensFlare = new THREE.LensFlare( textureFlare1, 256, 0.0, THREE.AdditiveBlending, flareColor);
	for (var i = 0; i < smallCircles; i++) {
			lensFlare.add( textureFlare2, smallCircleMinSize + (Math.random() * smallCircleMaxSize), 
			smallCircleMinDistance + (i / smallCircleCloseness) + (Math.random() / 10),
			THREE.AdditiveBlending );
	};
	lensFlare.position.set( -1127.008, 1232.292, -11  );
	scene.add( lensFlare );
}

function initColors () {	
	sliceSelectedC = new THREE.Color(sliceSelectedC); 
}