

function addWatch (obj) {
	watch(obj, "frame", function(prop, action, newvalue, oldvalue){
	//console.log(newvalue)
	switch (newvalue){
		case 0:
			//
		break;
	}
});
}

function animate(time) {
	setInterval(function(){ 
		renderer.render(scene, camera); 
	}, fps);
} 


