function loadAssets () {	
	bmap = THREE.ImageUtils.loadTexture("media/models/spacer.jpg", function(){},function(){});
	loadMaterials();
	loadAnimations();
	loadJSON('text', undefined, undefined, text);
	loadObject('cardinal_horizontal', undefined, addToScene, windowHorizontal);
	loadObject('cardinal_vertical', undefined, undefined, windowVertical);
	loadObject('cardinal_slice', undefined, undefined, slice);	
 } 