var imagesArray = [];

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
