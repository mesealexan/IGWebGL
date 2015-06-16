var container, camera, scene, renderer, keyboard, frameID;
var camNear = 0.1, camFar = 20000;
var width = window.innerWidth, height = window.innerHeight;


var animation = parseJSON('media/camera/sample.JSON');
var animation_interval = setInterval(function(){},10);
Init();

function Init() {
	container = document.getElementById( 'webGL' );	
	scene = new THREE.Scene();
	addRenderer();
	addCameraAndControls();
	addLight();
	initKeyboard();
	loadJSON('cardinal');
	animateCamera(camera, animation)
	animate();
}

function loadJSON (name, material, callback) {
	var mesh;
	var loader = new THREE.JSONLoader();

	loader.load( "media/models/" + name + ".js", function( geometry, materials ) {
	    var material = new THREE.MeshFaceMaterial( materials ); 
        mesh = new THREE.Mesh( geometry, material );
    });

	loader.onLoadComplete = function(){		
		mesh.name = name;
		if(callback)callback(mesh);
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

	var directionalLight = new THREE.DirectionalLight( 0xffffff );
	directionalLight.position.set( 0, 0, 1 );
	scene.add( directionalLight );
}

function addCameraAndControls() {
	camera = new THREE.PerspectiveCamera( 45, width / height, camNear, camFar ); 
	camera.position.set(0, 1000, 1500);
	scene.add( camera );

    controls = new THREE.OrbitControls( camera, renderer.domElement ); 
    controls.target = new THREE.Vector3(0, 500, 0);

    camera.lookAt(controls.target)
}

function animate() {
	frameID = requestAnimationFrame(animate);
	renderer.render(scene, camera);
} 

function initKeyboard () {
	keyboard = new THREEx.KeyboardState();
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

function animateCamera(camera, animation){
	clearInterval(animation_interval);
	var i = -1;
	animation_interval = setInterval(function(){
		if(i<animation.frames.length-1){
			i++
			camera.position.set(Number(animation.frames[i].camera.x),Number(animation.frames[i].camera.z),Number(animation.frames[i].camera.y));
			camera.target.x = Number(animation.frames[i].target.x);
			camera.target.y = Number(animation.frames[i].target.z);
			camera.target.z = Number(animation.frames[i].target.y);
		}
	},1000/animation.fps);
}