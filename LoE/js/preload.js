var imagesArray = [];
	imagesArray.push("media/skybox/cube_b.jpg");
	imagesArray.push("media/skybox/cube_d.jpg");
	imagesArray.push("media/skybox/cube_f.jpg");
	imagesArray.push("media/skybox/cube_l.jpg");
	imagesArray.push("media/skybox/cube_r.jpg");
	imagesArray.push("media/skybox/cube_u.jpg");

	for(var i = 0, l = imagesArray.length; i < l; i++){
		var img = new Image();
			img.src = imagesArray[i]
	}

var animation = parseJSON('media/camera/camera.JSON');
var tambur_a_pos = parseJSON('media/models/tambur_a_pos.JSON');
var tambur_b_pos = parseJSON('media/models/tambur_b_pos.JSON');

parseJSON('media/models/plane.js');
parseJSON('media/models/rail.js');
parseJSON('media/models/rotator.js');
parseJSON('media/models/text.js');
parseJSON('media/models/window.js');

function parseJSON(file) {
	var request = new XMLHttpRequest();
   		request.open("GET", file, false);
   		request.send(null);
   	return JSON.parse(request.responseText);
}
