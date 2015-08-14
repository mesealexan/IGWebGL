var menu = document.getElementById("menu");
var background = document.getElementById("background"); 
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
	
	var light1 = new THREE.PointLight( 0xffffff, 1, 10000 );
		light1.position.set( 0,100,0 );
		scene.add( light1 );
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