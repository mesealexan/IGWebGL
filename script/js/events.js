var camPosition1 = new THREE.Vector3();
var camPosition2 = new THREE.Vector3();
var camPosition1Target = new THREE.Vector3();

function addControls() {
	
    var hammer = new Hammer(container);

	hammer.on('pan', function(ev) {
    	//bothWindowsPerspectivePan(ev);
	});

	hammer.on('panstart', function(ev) {
    	getInitialMousePos(ev);
	});
}

function bothWindowsPerspectivePan (ev) {
	if(camAtPosition1) 
	{			
		if(checkCameraDeviation('x')) 
			camera.position.x -= (ev.deltaX - initialMousePos.x) / panSlowDown;	
		if(checkCameraDeviation('z'))	
			camera.position.z += (ev.deltaY - initialMousePos.y) / panSlowDown;
		initialMousePos = { x: ev.deltaX, y: ev.deltaY };
	}	
}

function checkCameraDeviation (axis) {
	if(Math.abs(camPosition1[axis] - camera.position[axis]) > maxCameraDeviation){
		if(axis == 'x'){
			if(camPosition1.x - camera.position.x > 0)
				camera.position.setX(camPosition1.x - (maxCameraDeviation - cameraOutOfBoundsReset));
			else camera.position.setX(camPosition1.x + (maxCameraDeviation - cameraOutOfBoundsReset));
		}

		if (axis == 'z'){
			if(camPosition1.z - camera.position.z > 0)
				camera.position.setZ(camPosition1.z - (maxCameraDeviation - cameraOutOfBoundsReset));
			else camera.position.setZ(camPosition1.z + (maxCameraDeviation - cameraOutOfBoundsReset));
		}
	}		
	else return true;
}

function getInitialMousePos (ev) {
	initialMousePos = {x: ev.deltaX, y: ev.deltaY };
}

function initKeyboard () {
	keyboard = new THREEx.KeyboardState();
}