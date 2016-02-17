define(
  ['ui', 'handler', 'three', 'jquery', 'tween'],
  function (ui, handler) {
    var stage = {
      scene: undefined,
      camera: undefined,
      engine: undefined,
      currentAssets: {
        left: undefined,
        right: undefined
      },
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
      var pRightSmall = handler.loadAsset('right_small');
      var pLeftMedium = handler.loadAsset('left_medium');
      var pRightMedium = handler.loadAsset('right_medium');
      var pLeftLarge = handler.loadAsset('left_large');
      var pRightLarge = handler.loadAsset('right_large');

      Promise.all([pLeftSmall, pRightSmall, pLeftMedium, pRightMedium, pLeftLarge, pRightLarge]).then(function(objects){
        for (var key in objects) {
          for (var mKey in objects[key].material.materials) {
            objects[key].material.materials[mKey].transparent = true;
            objects[key].material.materials[mKey].opacity = 0;
          }
          objects[key].visible = false;
          this.scene.add(objects[key]);

          var position = objects[key].name.slice(0, objects[key].name.search('_'));
          var type = objects[key].name.slice(objects[key].name.search('_')+1, objects[key].name.length);
          ui.addButton(type, position, attachCallbackWall.bind(this));
        }
        setDefaults();
      }.bind(this)).catch(console.log);
    };

    stage.startRenderLoop = function () {
      requestAnimationFrame(this.startRenderLoop.bind(this));
      TWEEN.update();
      this.engine.render(this.scene, this.camera);
    };

    function setDefaults () {
      stage.currentAssets.left = handler.assets.left_small;
      stage.currentAssets.right = handler.assets.right_small;

      for (var lKey in stage.currentAssets.left.material.materials) {
        stage.currentAssets.left.material.materials[lKey].opacity = 1;
      }
      stage.currentAssets.left.visible = true;

      for (var rKey in stage.currentAssets.right.material.materials) {
        stage.currentAssets.right.material.materials[rKey].opacity = 1;
      }
      stage.currentAssets.right.visible = true;
    }

    function attachCallbackWall (e) {
      var position = e.target.id.slice(0, e.target.id.search('_'));
      var tweenTime = 1000;

      for (var keyOut in this.currentAssets[position].material.materials) {
        new TWEEN.Tween(this.currentAssets[position].material.materials[keyOut]).to({opacity: 0}, tweenTime).start();
      }

      setTimeout(function () {
        this.currentAssets[position].visible = false;
        this.currentAssets[position] = handler.assets[e.target.id];
        this.currentAssets[position].visible = true;
        for (var keyIn in handler.assets[e.target.id].material.materials) {
          new TWEEN.Tween(handler.assets[e.target.id].material.materials[keyIn]).to({opacity: 1}, tweenTime).start();
        }
      }.bind(this), tweenTime);
    }

    return stage;
  }
);
