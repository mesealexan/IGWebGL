function addControls() {	
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enabled = false;
    controls.noZoom = true;
    controls.noPan = true;
    controls.maxPolarAngle = 1.6;
    controls.minPolarAngle = 1.3;
   	controls.rotateSpeed = 0.3;

    hammer = new Hammer(container);
    
    hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });

    hammer.on('panstart', function(ev) {
        cancelAllTweens();
    });

	hammer.on('panend', function(ev) {
        animateCamera.tween(cameraDestinationFrame, cameraTweenSpeed);
	});

    hammer.set({ enable: false});
}
            

function cancelAllTweens () {
    var tweens = TWEEN.getAll();
    for (var i = 0; i < tweens.length; i++) {
        tweens[i].stop();
    };
}

function toggleInput (bool) {    
    controls.enabled = bool;   
    hammer.set({ enable: bool});
}
