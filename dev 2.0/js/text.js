define(["three", "helvetiker"], function(){
  //require(["../media/fonts/Bank Gothic_Regular.typeface"]);
  //require(["../media/fonts/helvetiker_regular.typeface"]);
  var text = {};

  text.Make = function(string, settings){
  	var textGeom = new THREE.TextGeometry( string, settings );
    return textGeom;
  }

  return text;
});
