var container, camera, scene, renderer, keyboard, frameID;
var camNear = 0.1, camFar = 20000;
var width = window.innerWidth, height = window.innerHeight;

var refractSphereCamera, refractSphere, skyBox, windowMesh;

Init();

function Init() {
	container = document.getElementById( 'container' );	
	scene = new THREE.Scene();
	addRenderer();
	addSkybox();
	addCameraAndControls();
	addLight();
	initKeyboard();
	loadJSON('window', glassMaterial1(), manageWindow);
	animate();
}

function loadJSON (name, material, callback) {
	var windowMesh;
	var loader = new THREE.JSONLoader();

	loader.load( "media/models/" + name + ".js", function( geometry, materials ) {
	    var material = new THREE.MeshFaceMaterial( materials ); 
        windowMesh = new THREE.Mesh( geometry, material );
    });

	loader.onLoadComplete = function(){		
		windowMesh.name = name;
		if(callback)callback(windowMesh);
    	scene.add(windowMesh);
	};
}

function manageWindow(obj) {
	refractSphereCamera = new THREE.CubeCamera( 0.1, 5000, 512 );
	scene.add( refractSphereCamera );
	
	refractSphereCamera.renderTarget.generateMipmaps = false;
	refractSphereCamera.renderTarget.mapping = THREE.CubeRefractionMapping;

	refractSphereCamera.renderTarget.wrapS = THREE.RepeatWrapping;
	refractSphereCamera.renderTarget.wrapT = THREE.RepeatWrapping;
	refractSphereCamera.renderTarget.repeat.x = 100;
	refractSphereCamera.renderTarget.repeat.y = 100;

	var refractMaterial = new THREE.MeshPhongMaterial({ 
		color: 0xccddff, 
		envMap: refractSphereCamera.renderTarget, 
		refractionRatio: 0.985, 
		reflectivity: 0.9,
		specular: 0x222222,  
		emissive: 0x006063,
		shininess: 30
		});
	obj.material.materials[0] = refractMaterial;
	obj.material.materials[1] = new THREE.MeshPhongMaterial({
		color: 0x333333, ambient: 0x000000, specular:0xffffff, shininess: 20});
}

function addSkybox () {
	var size = 10000;
	var imagePrefix = "media/skybox/test_";
	var directions  = ["r", "r", "u", "d", "f", "b"];
	var imageSuffix = ".jpg";
	var skyGeometry = new THREE.BoxGeometry( size, size, size );	
	
	var materialArray = [];
	for (var i = 0; i < 6; i++)
		materialArray.push( new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
			side: THREE.BackSide
		}));
	var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
	skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
	scene.add( skyBox );
}

function addRenderer() {
	renderer = new THREE.WebGLRenderer({ antialias: true });
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
	if(windowMesh)windowMesh.visible = false;
	if(refractSphereCamera)refractSphereCamera.updateCubeMap( renderer, scene );
	if(windowMesh)windowMesh.visible = true;
	renderer.render(scene, camera);
} 

function initKeyboard () {
	keyboard = new THREEx.KeyboardState();
}