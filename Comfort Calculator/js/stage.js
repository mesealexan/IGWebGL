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
      },
      currentShader: undefined
    };

    stage.init = function () {
      var container_width = $(handler.container).width();
      var container_height = $(handler.container).height();

      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.Fog(0xffffff, 1300, 2000);

      this.camera = new THREE.PerspectiveCamera( 40, container_width/container_height, 100, 2000 );
      this.camera.position.set(0, 339, 987);
      this.camera.lookAt( new THREE.Vector3(0,171,237) );

      this.engine = new THREE.WebGLRenderer({antialias: true});
      this.engine.setSize(container_width, container_height);
      this.engine.gammaInput = this.engine.gammaOutput = true;
      handler.container.appendChild(this.engine.domElement);

      this.clock = new THREE.Clock();

      window.addEventListener('resize', resizeWindow.bind(this));
    };

    stage.loadStage = function () {
      handler.lights.ambientLight = new THREE.AmbientLight(0xffffff);
      this.scene.add(handler.lights.ambientLight);

      handler.lights.ambientLight2 = new THREE.AmbientLight(0x161616);
      this.scene.add(handler.lights.ambientLight2);

      var light = new THREE.PointLight( 0xffffff, 0.2, 3000 );
        light.position.set( 555, 503, -1310 );
        this.scene.add( light );

      var pStatic = handler.loadAsset('static');
      pStatic.then(function(object){
        this.scene.add(object);
      }.bind(this)).catch(console.log.bind(console));

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
      }.bind(this)).catch(console.log.bind(console));
    };

    stage.loadAnimations = function () {
      // winter
      var pWinter = handler.loadAnimatedAsset('winter');
      pWinter.then(function (object) {
        object.position.set(-188, 18, -68);
        this.scene.add(object);
        for (var key in handler.animations.winter) {
          ui.addButton(handler.animations.winter[key]._clip.name, 'winter', attachCallbackAnimation.bind(handler.animations.winter[key]));
        }
        // default
        this.currentAnimations.winter = handler.animations.winter[0];
        this.currentAnimations.winter.play();
      }.bind(this)).catch(console.log.bind(console));

      // summer
      var pSummer = handler.loadAnimatedAsset('summer');
      pSummer.then(function (object) {
        object.position.set(188, 18, -68);
        this.scene.add(object);
        for (var key in handler.animations.summer) {
          ui.addButton(handler.animations.summer[key]._clip.name, 'summer', attachCallbackAnimation.bind(handler.animations.summer[key]));
        }
        // default
        this.currentAnimations.summer = handler.animations.summer[0];
        this.currentAnimations.summer.play();
      }.bind(this)).catch(console.log.bind(console));

      // shaders
      var pShaderSmall = handler.loadMorphedAsset('right_small_shader');
      var pShaderMedium = handler.loadMorphedAsset('right_medium_shader');
      var pShaderLarge = handler.loadMorphedAsset('right_large_shader');
      Promise.all([pShaderSmall, pShaderMedium, pShaderLarge]).then(function (objects) {
        for (var key in objects) {
          for (var mKey in objects[key].material.materials) {
            objects[key].material.materials[mKey].transparent = true;
            objects[key].material.materials[mKey].opacity = 0;
          }
          objects[key].visible = false;
          this.scene.add(objects[key]);
        }
        setDefaultShader();
        ui.addSlider('right', 0, 1, 0.25, attachCallbackShader.bind(this));
      }.bind(this)).catch(console.log.bind(console));
    };

    stage.tempLoad = function () {
      // winter
      var pWinterIdle = handler.tempAnim('winter_ani_idle');
      var pWinterFreezing = handler.tempAnim('winter_ani_freezing');
      var pWinterWalk = handler.tempAnim('winter_ani_walk');
      Promise.all([pWinterIdle, pWinterFreezing, pWinterWalk]).then(function(objects){
        for (var key in objects) {
          objects[key].position.set(-188, 18, -68);
          objects[key].visible = false;
          this.scene.add(objects[key]);
          var type = objects[key].name.slice(objects[key].name.search('_')+1, objects[key].name.length);
          ui.addButton(type, 'winter', tempCallbackAnimation.bind(this));
        }
      }.bind(this)).catch(console.log.bind(console));

      // summer
      var pSummerIdle = handler.tempAnim('summer_ani_idle');
      var pSummerWalk = handler.tempAnim('summer_ani_walk');
      var pSummerWarm = handler.tempAnim('summer_ani_warm');
      Promise.all([pSummerIdle, pSummerWalk, pSummerWarm]).then(function(objects){
        for (var key in objects) {
          objects[key].position.set(188, 18, -68);
          objects[key].visible = false;
          this.scene.add(objects[key]);
          var type = objects[key].name.slice(objects[key].name.search('_')+1, objects[key].name.length);
          ui.addButton(type, 'summer', tempCallbackAnimation.bind(this));
        }
      }.bind(this)).catch(console.log.bind(console));

      // shaders
      var pShaderSmall = handler.loadMorphedAsset('right_small_shader');
      var pShaderMedium = handler.loadMorphedAsset('right_medium_shader');
      var pShaderLarge = handler.loadMorphedAsset('right_large_shader');
      Promise.all([pShaderSmall, pShaderMedium, pShaderLarge]).then(function (objects) {
        for (var key in objects) {
          for (var mKey in objects[key].material.materials) {
            objects[key].material.materials[mKey].transparent = true;
            objects[key].material.materials[mKey].opacity = 0;
          }
          objects[key].visible = false;
          this.scene.add(objects[key]);
        }
        setDefaultShader();
        ui.addSlider('right', 0, 1, 0.01, attachCallbackShader.bind(this));
      }.bind(this)).catch(console.log.bind(console));
    };

    stage.startRenderLoop = function () {
      requestAnimationFrame(this.startRenderLoop.bind(this));

      this.clock_delta = this.clock.getDelta();

      for (var key in handler.animation_mixers) {
        handler.animation_mixers[key].update(this.clock_delta);
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

      if (position === 'right') {
        for (var keyOutShader in this.currentShader.material.materials) {
          new TWEEN.Tween(this.currentShader.material.materials[keyOutShader]).to({opacity: 0}, tweenTime).start();
        }
      }

      setTimeout(function () {
        this.currentWalls[position].visible = false;
        this.currentWalls[position] = handler.assets[e.target.id];
        this.currentWalls[position].visible = true;
        for (var keyIn in this.currentWalls[position].material.materials) {
          new TWEEN.Tween(this.currentWalls[position].material.materials[keyIn]).to({opacity: 1}, tweenTime).start();
        }

        if (position === 'right') {
          this.currentShader.visible = false;
          this.currentShader = handler.assets[e.target.id+'_shader'];
          this.currentShader.visible = true;
          for (var keyInShader in this.currentShader.material.materials) {
            new TWEEN.Tween(this.currentShader.material.materials[keyInShader]).to({opacity: 1}, tweenTime).start();
          }
        }
      }.bind(this), tweenTime);
    }

    function setDefaultShader () {
      stage.currentShader = handler.assets.right_small_shader;
      for (var key in stage.currentShader.material.materials) {
        stage.currentShader.material.materials[key].opacity = 1;
      }
      stage.currentShader.visible = true;
    }

    function attachCallbackShader (e) {
      this.currentShader.morphTargetInfluences[0] = 1 - e.target.valueAsNumber;
      this.currentShader.morphTargetInfluences[1] = e.target.valueAsNumber;
    }

    function attachCallbackAnimation (e) {
      var position = e.target.id.slice(0, e.target.id.search('_'));
      if (this == stage.currentAnimations[position]) return;
      this.play();
      this.enabled = true;
      this.crossFadeFrom(stage.currentAnimations[position], 1);
      stage.currentAnimations[position] = this;
    }

    function tempCallbackAnimation (e) {
      var position = e.target.id.slice(0, e.target.id.search('_'));
      if (this.currentAnimations[position]) this.currentAnimations[position].visible = false;
      this.currentAnimations[position] = handler.assets[e.target.id];
      this.currentAnimations[position].visible = true;
    }


    function resizeWindow () {
      var container_width = $(handler.container).width();
      var container_height = $(handler.container).height();
      this.engine.setSize(container_width, container_height);
      this.camera.aspect = container_width / container_height;
  		this.camera.updateProjectionMatrix();
    }

    return stage;
  }
);
