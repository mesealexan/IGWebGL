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
      this.scene.fog = new THREE.Fog(0x616161, 1720, 2000);

      this.camera = new THREE.PerspectiveCamera( 40, container_width/container_height, 100, 2000 );
      this.camera.position.set(0, 339, 987);
      this.camera.lookAt( new THREE.Vector3(0,171,237) );

      this.engine = new THREE.WebGLRenderer({antialias: true});
      this.engine.setSize(container_width, container_height);
      handler.container.appendChild(this.engine.domElement);

      // will use this later for animations
      // new THREE.Clock();
    };

    stage.loadStage = function () {
      handler.lights.ambientLight = new THREE.AmbientLight(0xffffff);
      this.scene.add(handler.lights.ambientLight);

      var pStatic = handler.loadAsset('static');
      pStatic.then(function(object){
        this.scene.add(object);
      }.bind(this)).catch(console.log);

      var pLeftSmall = handler.loadAsset('left_small');
      pLeftSmall.then(function(object){
        this.scene.add(object);
      }.bind(this)).catch(console.log);

      var pRightSmall = handler.loadAsset('right_small');
      pRightSmall.then(function(object){
        this.scene.add(object);
      }.bind(this)).catch(console.log);
    };


    stage.startRenderLoop = function () {
      requestAnimationFrame(this.startRenderLoop.bind(this));

      this.engine.render(this.scene, this.camera);
    };

    return stage;
  }
);
