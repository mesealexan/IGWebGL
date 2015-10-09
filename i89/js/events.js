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
$("#i89on").click(function(){switchWindow.toggleON()});
$("#i89off").click(function(){switchWindow.toggleOFF()});
$("#outside").click(function(){tweenCamera("out")});
$("#inside").click(function(){tweenCamera("in")});
$("#insideClose").click(function(){tweenCamera("inClose")});
$("#backOut").click(function(){tweenCamera("backOut")});


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

function tweenCamera(pos){
    //cancelAllTweens();
    var outsidePos = new THREE.Vector3(-118, 111, -372),
        windowPos = new THREE.Vector3( 14, 80, 0),
        facingWallPos = new THREE.Vector3( -300, 100 ,0),
        insidePos = new THREE.Vector3(-424.235, 111.635, 326.101),
        inClosePos = new THREE.Vector3( -172.235, 111.635, 102.101);
    var tween = new TWEEN.Tween( camera.position );
    var tweenTime = 2000;
    switch(pos){
        case "out":
            if(camera.outside) return;
            $("#insideClose").toggle();
            tween.to( { x: [facingWallPos.x, outsidePos.x],
                y: [facingWallPos.y, outsidePos.y],
                z: [facingWallPos.z, outsidePos.z]}, tweenTime );
            tween.onComplete(function(){
                camera.outside = true;
                camera.inside = false;
                camera.inClose = false;
            });
            tween.onUpdate( function () {camera.lookAt(windowPos); });
        break;
        case "in":
            if(camera.inside) return;
            if(camera.position.floor().equals(insidePos)) return;
            tween.to( { x: [facingWallPos.x, insidePos.x],
                y: [facingWallPos.y, insidePos.y],
                z: [facingWallPos.z, insidePos.z]}, tweenTime );
            tween.onComplete(function(){
                $("#insideClose").toggle();
                camera.inside = true;
                camera.outside = false;
                camera.inClose = false;
            });
            tween.onUpdate( function () {camera.lookAt(windowPos); });
        break;
        case "inClose":
            //if(camera.inClose) return;
            $("#insideClose").toggle();
            $("#outside").toggle();
            $("#inside").toggle();
            tween.to( { x: inClosePos.x,
                        y: inClosePos.y,
                        z: inClosePos.z}, tweenTime );
            tween.onComplete(function(){ $("#backOut").toggle();});

            var lookAtTween = new TWEEN.Tween( controls.target );
            lookAtTween.to( { x: windowPos.x, y: windowPos.y, z: windowPos.z}, tweenTime );
            lookAtTween.onUpdate( function() {camera.lookAt(controls.target) });
            lookAtTween.start();
        break;
        case "backOut":
            $("#backOut").toggle();
            tween.to( { x: insidePos.x,
                        y: insidePos.y,
                        z: insidePos.z}, tweenTime );
            tween.onUpdate( function() {camera.lookAt(windowPos) });
            tween.onComplete(function(){
                $("#insideClose").toggle();
                $("#outside").toggle();
                $("#inside").toggle();
                camera.inside = true;
                camera.outside = false;
                camera.inClose = false;
            });
        break;
    }
    tween.interpolation( TWEEN.Interpolation.CatmullRom );
    //tween.easing(TWEEN.Easing.Quadratic.In);
    tween.start();
}
