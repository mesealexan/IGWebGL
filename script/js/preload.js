var menu = document.getElementById("menu");
var closeUpMenu = document.getElementById("closeUpMenu");
var backButton = document.getElementById("backButton");

var spacerNormalImg = new Image();
	spacerNormalImg.src = "media/models/spacer.jpg";

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