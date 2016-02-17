define(
  ['handler', 'three', 'jquery'],
  function (handler) {
    var stage = {
      scene: undefined,
      camera: undefined,
      engine: undefined
    };

    stage.init = function () {
      var container_width = $(handler.container).width();
      var container_height = $(handler.container).height();

      this.scene = new THREE.Scene();

      this.camera = new THREE.PerspectiveCamera( 30, container_width/container_height, 1, 10000 );
      this.camera.position.set(-1, 168, 1616);

      this.engine = new THREE.WebGLRenderer({antialias: true});
      this.engine.setSize(container_width, container_height);
      handler.container.appendChild(this.engine.domElement);

      // will use this later for animations
      // new THREE.Clock();
    };

    stage.loadStage = function () {
      var ambientLight = new THREE.AmbientLight(0xffffff);
      this.scene.add(ambientLight);

      var p1 = handler.loadAsset('static.js');
      p1.then(function(object){
        this.scene.add(object);
      }.bind(this));

      var p2 = handler.loadAsset('left_small.js');
      p2.then(function(object){
        this.scene.add(object);
      }.bind(this));

      var p3 = handler.loadAsset('right_small.js');
      p3.then(function(object){
        this.scene.add(object);
      }.bind(this));
    };


    stage.startRenderLoop = function () {
      requestAnimationFrame(this.startRenderLoop.bind(this));

      this.engine.render(this.scene, this.camera);
    };

    return stage;
  }
);
