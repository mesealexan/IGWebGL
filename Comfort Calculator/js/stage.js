define(
  ['ui', 'handler', 'three', 'jquery', 'tween'],
  function (ui, handler) {
    var stage = {
      scene: undefined,
      camera: undefined,
      engine: undefined,
      clock: undefined,
      clock_delta: undefined,
      currentWalls: {
        left: undefined,
        right: undefined
      },
      currentAnimations: {
        winter: undefined,
        summer: undefined
      }
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

      this.clock = new THREE.Clock();
    };

    stage.loadStage = function () {
      handler.lights.ambientLight = new THREE.AmbientLight(0xffffff);
      this.scene.add(handler.lights.ambientLight);

      handler.lights.ambientLight2 = new THREE.AmbientLight(0x303028);
      this.scene.add(handler.lights.ambientLight2);

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
        setDefaultWalls();
      }.bind(this)).catch(console.log);
    };

    stage.loadAnimations = function () {
      var pWinterChar = handler.loadAnimatedModel('winter_char');
      pWinterChar.then(function (object) {
        object.position.set(-188, 18, -68);
        object.scale.set(2.54, 2.54, 2.54);
        this.scene.add(object);
      }.bind(this)).catch(console.log);

      var pWinterIdle = handler.loadAnimation('winter_char','winter_ani_idle');
      Promise.all([pWinterIdle]).then(function(assetNames){
        for (var key in assetNames) {
          var type = assetNames[key].slice(assetNames[key].search('_')+1, assetNames[key].length);
          ui.addButton(type, 'winter', attachCallbackAnimation.bind(this));
        }
      }).catch(console.log);

      var pSummerChar = handler.loadAnimatedModel('summer_char');
      pSummerChar.then(function (object) {
        object.position.set(188, 18, -68);
        this.scene.add(object);
      }.bind(this)).catch(console.log);

      //var pSummerHot = handler.loadAnimation('summer_char', 'summer_ani_hot');
      var pSummerIdle = handler.loadAnimation('summer_char', 'summer_ani_idle');
      //var pSummerIdleHot = handler.loadAnimation('summer_char', 'summer_ani_idle_hot');
      //var pSummerIdleWalk = handler.loadAnimation('summer_char', 'summer_ani_idle_walk');
      //var pSummerIdleWarm = handler.loadAnimation('summer_char', 'summer_ani_idle_warm');
      //var pSummerWalk = handler.loadAnimation('summer_char', 'summer_ani_walk');
      //var pSummerWarm = handler.loadAnimation('summer_char', 'summer_ani_warm');
      Promise.all([pSummerIdle]).then(function(assetNames){
        for (var key in assetNames) {
          var type = assetNames[key].slice(assetNames[key].search('_')+1, assetNames[key].length);
          ui.addButton(type, 'summer', attachCallbackAnimation.bind(this));
        }
        setDefaultAnimations();
      }).catch(console.log);
    };

    stage.startRenderLoop = function () {
      requestAnimationFrame(this.startRenderLoop.bind(this));

      this.clock_delta = this.clock.getDelta();

      if (handler.animation_mixers.winter_char) {
        handler.animation_mixers.winter_char.update(this.clock_delta);
      }

      if (handler.animation_mixers.summer_char) {
        handler.animation_mixers.summer_char.update(this.clock_delta);
      }

      TWEEN.update();
      this.engine.render(this.scene, this.camera);
    };

    function setDefaultWalls () {
      stage.currentWalls.left = handler.assets.left_small;
      stage.currentWalls.right = handler.assets.right_small;

      for (var lKey in stage.currentWalls.left.material.materials) {
        stage.currentWalls.left.material.materials[lKey].opacity = 1;
      }
      stage.currentWalls.left.visible = true;

      for (var rKey in stage.currentWalls.right.material.materials) {
        stage.currentWalls.right.material.materials[rKey].opacity = 1;
      }
      stage.currentWalls.right.visible = true;
    }

    function attachCallbackWall (e) {
      var position = e.target.id.slice(0, e.target.id.search('_'));
      var tweenTime = 100;

      for (var keyOut in this.currentWalls[position].material.materials) {
        new TWEEN.Tween(this.currentWalls[position].material.materials[keyOut]).to({opacity: 0}, tweenTime).start();
      }

      setTimeout(function () {
        this.currentWalls[position].visible = false;
        this.currentWalls[position] = handler.assets[e.target.id];
        this.currentWalls[position].visible = true;
        for (var keyIn in handler.assets[e.target.id].material.materials) {
          new TWEEN.Tween(handler.assets[e.target.id].material.materials[keyIn]).to({opacity: 1}, tweenTime).start();
        }
      }.bind(this), tweenTime);
    }

    function setDefaultAnimations () {
      stage.currentAnimations.winter = handler.animations.winter_char.winter_ani_idle;
      stage.currentAnimations.winter.play();

      stage.currentAnimations.summer = handler.animations.summer_char.summer_ani_idle;
      stage.currentAnimations.summer.play();
    }

    function attachCallbackAnimation (e) {
      var position = e.target.id.slice(0, e.target.id.search('_'));
      stage.currentAnimations[position].stop();
      stage.currentAnimations[position] = handler.animations[position + '_char'][e.target.id];
      stage.currentAnimations[position].play();
    }

    return stage;
  }
);
