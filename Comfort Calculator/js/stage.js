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

      this.camera = new THREE.PerspectiveCamera( 75, container_width/container_height, 1, 1000 );

      this.engine = new THREE.WebGLRenderer({antialias: true});
      this.engine.setSize(container_width, container_height);
      handler.container.appendChild(this.engine.domElement);

      // will use this later for animations
      // new THREE.Clock();
    };


    stage.startRenderLoop = function () {
      requestAnimationFrame(this.startRenderLoop.bind(this));

      this.engine.render(this.scene, this.camera);
    };

    return stage;
  }
);
