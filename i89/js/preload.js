var imagesArray = [];
	imagesArray.push('media/models/grid.jpg');
	imagesArray.push('media/models/floor.jpg');
	imagesArray.push('media/models/floor_b.jpg');
	imagesArray.push('media/models/bck.jpg');
	imagesArray.push('media/models/snow.jpg');
	imagesArray.push('media/models/moon.jpg');
    imagesArray.push('media/models/window_plane.png');
    imagesArray.push('media/models/logo_diff.png');

	for(var i = 0, l = imagesArray.length; i < l; i++){
		var img = new Image();
			img.src = imagesArray[i];
	}

function parseJSON(file) {
	var request = new XMLHttpRequest();
   		request.open("GET", file, false);
   		request.send(null);
   	return JSON.parse(request.responseText);
}
