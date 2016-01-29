define(["three", /*"helvetiker",*/ "bankGothinc"], function(){
  var text = {};

  text.Make = function(string, settings){
  	var textGeom = new THREE.TextGeometry( string, settings );
    return textGeom;
  }

  return text;
});
