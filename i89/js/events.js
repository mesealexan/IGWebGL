function addControls() {	
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.noZoom = false;
    controls.noPan = true;
    //controls.maxAzimuthAngle = -0.9;
    //controls.minAzimuthAngle = -1.6;
    //controls.maxPolarAngle = Math.PI / 2;
    //controls.minPolarAngle = 1;
   	//controls.rotateSpeed = 0.05;

    hammer = new Hammer(container);

    //pan in all directions
    hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });

    //dont create simultaneous tweens, stop all, create new ones
    hammer.on('panstart', function(ev) {
        //cancelAllTweens();
    });

    //trigger tween back
	hammer.on('panend', function(ev) {
        //animateCamera.tween(cameraDestinationFrame, cameraTweenSpeed);
	});

    //begin with no controls
    //toggleInput(false);
}

function setControlsMinMax (f) {
    var a = controls.getAzimuthalAngle(),
        p = controls.getPolarAngle(),
        f = 0.3;

    controls.maxAzimuthAngle = a + f;
    controls.minAzimuthAngle = a - f;

    controls.maxPolarAngle = p + f;
    controls.minPolarAngle = p - f;
}            

function cancelAllTweens () {
    TWEEN.removeAll();
}

function toggleInput (bool) {
    controls.enabled = bool;
    hammer.set({ enable: bool});
}
