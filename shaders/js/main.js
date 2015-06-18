var container, camera, scene, renderer, keyboard, frameID;
var camNear = 0.1, camFar = 20000;
var width = window.innerWidth, height = window.innerHeight;

var refractSphereCamera, refractSphere, skyBox;

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

function manageWindow(obj) {
	var urls = [];
	var imagePrefix = "media/skybox/cube__";
	var directions  = ["r", "l", "u", "d", "f", "b"];
	var imageSuffix = ".jpg";

	for (var i = 0; i < 6; i++)
		urls.push(imagePrefix + directions[i] + imageSuffix);

	var textureCube = THREE.ImageUtils.loadTextureCube( urls, THREE.CubeRefractionMapping );

	var refractMaterial = new THREE.MeshPhongMaterial({ 
		color: 0xccddff, 
		//envMap: refractSphereCamera.renderTarget, 
		envMap: textureCube,
		refractionRatio: 0.985, 
		//reflectivity: 0.9,
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
	var imagePrefix = "media/skybox/cube__";
	var directions  = ["r", "l", "u", "d", "f", "b"];
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
	//skyBox.visible = false;
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
	//refractSphereCamera.updateCubeMap( renderer, scene );
	renderer.render(scene, camera);
} 

function initKeyboard () {
	keyboard = new THREEx.KeyboardState();
}