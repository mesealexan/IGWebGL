var container, camera, scene, renderer, keyboard, frameID;
var camNear = 1, camFar = 10000;
var width = window.innerWidth, height = window.innerHeight;
var menu = document.getElementById("menu");
var closeUpMenu = document.getElementById("closeUpMenu");
var backButton = document.getElementById("backButton");

var animation = parseJSON('media/camera/anim_1.JSON');
var animation_interval = setInterval(function(){},10);
Init();

function Init() {
	container = document.getElementById( 'webGL' );	
	scene = new THREE.Scene();
	addRenderer();
	addCameraAndControls();
	addLight();
	initKeyboard();
	loadAssets();	
	manageCameraAnimations.playAnim_1();
	animate();
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
	var ambientLight = new THREE.AmbientLight( 0x808080 );
	scene.add( ambientLight );

	var spotLight = new THREE.SpotLight( 0xffffff );
		spotLight.position.set( 3806, -3550, 1336 );
		scene.add( spotLight );
}

function animate() {
	frameID = requestAnimationFrame(animate);
	renderer.render(scene, camera);
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