var menu = document.getElementById("menu");
var background = document.getElementById("background"); 
var width = window.innerWidth, height = window.innerHeight;
var fov = 45;
var camNear = 1, camFar = 100000;

aspectRatio = width / height;

Init();

function Init() {
	if(!webgl_detect()) return;	
	container = document.getElementById( 'webGL' );	
	scene = new THREE.Scene();
	addRenderer();
	detectOrientationChange();
	addCamera();
	addSkybox ();
	loadAssets();
	new THREEx.WindowResize(renderer, camera);
	addControls();	
	addLight();	
}

function addRenderer() {
	renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
	renderer.setClearColor( 0x000000, 0.0 );
	renderer.setSize( width, height );
	container.appendChild( renderer.domElement );
}

function addLight () {
	var ambientLight = new THREE.AmbientLight( 0xffffff );
	scene.add( ambientLight );
	

	var spotLight = new THREE.SpotLight( 0xb99bfd);
		spotLight.position.set( 980, 1049, -656 );
		spotLight.target.position.set( 34, 0, 85 );
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