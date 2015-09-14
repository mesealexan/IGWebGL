function addControls() {	
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.noZoom = false;
    controls.noPan = true;
    controls.maxAzimuthAngle = -0.9;
    controls.minAzimuthAngle = -1.6;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minPolarAngle = 1;
   	controls.rotateSpeed = 0.5;
    controls.noZoom = true;

    hammer = new Hammer(container);

    //pan in all directions
    hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });

    //don't create simultaneous tweens, stop all, create new ones
    hammer.on('panstart', function(ev) {
        //cancelAllTweens();
    });

    //trigger tween back
	hammer.on('panend', function(ev) {
        //animateCamera.tween(cameraDestinationFrame, cameraTweenSpeed);
	});

    //begin with no controls
    toggleInput(false);
}

function setControlsMinMax (af, pf) {
    var a = controls.getAzimuthalAngle(),
        p = controls.getPolarAngle();
        console.log(a, p)
    controls.maxAzimuthAngle = a + af;
    controls.minAzimuthAngle = a - af;

    controls.maxPolarAngle = p + pf;
    controls.minPolarAngle = p - pf;
}            

function cancelAllTweens () {
    TWEEN.removeAll();
}

function toggleInput (bool) {
    controls.enabled = bool;
    hammer.set({ enable: bool});
}
