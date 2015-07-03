function addControls() {	
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.noZoom = true;
    controls.noPan = true;
    controls.maxPolarAngle = 1.6;
    controls.minPolarAngle = 0.8;
   	controls.rotateSpeed = 0.11;
    controls.minAzimuthAngle = - 0.3; 
    controls.maxAzimuthAngle = 0.6;

    hammer = new Hammer(container);

    //pan in all directions
    hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });

    //dont create simultaneous tweens, stop all, create new ones
    hammer.on('panstart', function(ev) { cancelAllTweens(); });

    //trigger tween back
	hammer.on('panend', function(ev) {
        animateCamera.tween(cameraDestinationFrame, cameraTweenSpeed);
	});

    //begin with no controls
    toggleInput(false);
}
            

function cancelAllTweens () {
    TWEEN.removeAll();
}

function toggleInput (bool) {
    controls.enabled = bool;
    hammer.set({ enable: bool});
}
