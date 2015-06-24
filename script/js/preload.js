var imagesArray = [];
	imagesArray.push("media/models/spacer.jpg");
	imagesArray.push("media/models/p1_op.png");
	imagesArray.push("media/models/p2_op.png");
	imagesArray.push("media/LensFlare/Flare_1.png");
	imagesArray.push("media/LensFlare/Flare_2.png");
	imagesArray.push("media/LensFlare/Flare_3.png");

	for(var i=0,l=imagesArray.length;i<l;i++){
		var img = new Image();
			img.src = imagesArray[i]
	}

var animation = parseJSON('media/camera/anim_all.JSON');

parseJSON('media/models/cardinal_horizontal.js');
parseJSON('media/models/cardinal_vertical.js');
parseJSON('media/models/cardinal_slice.js');

 function parseJSON(file) {
	//	file - JSON path
	//	returns JS object
	var request = new XMLHttpRequest();
   		request.open("GET", file, false);
   		request.send(null);
   	var JSON_object = JSON.parse(request.responseText);
   	return JSON_object;
}