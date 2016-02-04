define(["three", "underscore", "animate"], function(three, underscore, animate){
return function ( s ) {
  var _this = this;
  var speed = s.speed;
  this.systemGeometry = new THREE.Geometry();
  this.blending = THREE.AdditiveBlending;
  this.transparent = false;
  this.side = 1;

  this.uniforms = {
    map: { type: 't', value: undefined },
    size: { type: 'f', value: s.size },
    time: { type: 'f', value: 0 },
    height: { type: 'f', value: s.height }

  };

  this.update = function () {
    this.uniforms.time.value += speed;
  }

  this.Start = function () {
    animate.updater.addHandler(this);
  }

  this.Stop = function () {
    animate.updater.removeHandler(this);
  }

  this.vertexShader = [
    "uniform float size;",
    "uniform float height;",
    "uniform float time;",

    "void main () {",
      "vec3 pos = position;",
      "pos.y = mod( pos.y - time, height );",
      //"pos.x = mod( pos.x - time, height );",
      "gl_PointSize = size;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );",
    "}"
  ].join("\n");

  this.fragmentShader = [
    "uniform sampler2D map;",

    "void main () {",
      "vec4 texColor = texture2D( map, gl_PointCoord );",
      "if ( texColor.a < 1. ) discard;",
      "gl_FragColor = texColor;",
    "}"
  ].join("\n");

  placeRandomParticles();

  function placeRandomParticles () {
    _.times( s.num, function () {
      var vertex = new THREE.Vector3(
        random ( -s.width  / 2, s.width  / 2 ),
        random ( -s.height / 2, s.height / 2 ),
        random ( -s.depth  / 2, s.depth  / 2 )
      );
      _this.systemGeometry.vertices.push( vertex );
    });
    loadMap({ name: s.mapName });
  }

  function loadMap ( obj ) {
    var url = animate.loader.mediaFolderUrl+"/particles/" + obj.name + ".png";
    _this.uniforms.map.value = THREE.ImageUtils.loadTexture( url, undefined, obj.onComplete );
  }

  function random (min, max) {
     return /*Math.floor*/(Math.random() * (max - min + 1)) + min;
  }
}
});
