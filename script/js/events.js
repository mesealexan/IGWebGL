function addControls() {	
    controls = new THREE.OrbitControls( camera );
    //var hammer = new Hammer(container);
	//hammer.on('pan', function(ev) {
    	//bothWindowsPerspectivePan(ev);
	//});

	//hammer.on('panstart', function(ev) {
    //	getInitialMousePos(ev);
	//});
}

function initKeyboard () {
	keyboard = new THREEx.KeyboardState();
}
