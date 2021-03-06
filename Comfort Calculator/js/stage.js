define(
  ['ls', 'ui', 'handler', 'three', 'jquery', 'tween','threex'],
  function (ls, ui, handler, three, $, tween, threex) {
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
      currentShader: undefined,
      timeOuts: {
        winter: undefined,
        summer: undefined
      }
    };

    stage.init = function () {
      var container_width = $(handler.container).width();
      var container_height = $(handler.container).height();

      this.scene = new THREE.Scene();
      //this.scene.fog = new THREE.Fog(0xffffff, 1300, 2000);

      this.camera = new THREE.PerspectiveCamera( 40, container_width/container_height, 100, 2000 );
      this.camera.position.set(0.66, 339, 987);
      this.camera.lookAt( new THREE.Vector3(0,171,237) );
      this.camera.aspect = container_width / container_height;
      this.camera.fov = interpolate(0.35,this.camera.aspect,3,85,10);
      this.camera.updateProjectionMatrix();

      this.engine = new THREE.WebGLRenderer({antialias: true, alpha: true});
      this.engine.setClearColor('black', 0 );
      this.engine.setSize(container_width, container_height);
      this.engine.shadowMap.enabled = true;
      this.engine.shadowMap.type = THREE.PCFSoftShadowMap;
      this.engine.gammaInput = this.engine.gammaOutput = true;
      handler.container.appendChild(this.engine.domElement);

      this.clock = new THREE.Clock();

      window.addEventListener('resize', resizeWindow.bind(this));

    };

    stage.loadStage = function () {

      handler.lights.ambientLight = new THREE.AmbientLight(0xffffff);
      this.scene.add(handler.lights.ambientLight);

      handler.lights.ambientLight2 = new THREE.AmbientLight(0x161616);
      //this.scene.add(handler.lights.ambientLight2);

      var light = new THREE.PointLight( 0xB5CCFF, 0.4 );

      light.position.set( -260, 320, -50);
      light.castShadow = true;
      light.shadow.mapSize.width =
      light.shadow.mapSize.height = 2048;

      light.shadow.camera.near = 4;
      light.shadow.camera.far = 3000;
      light.shadow.camera.fov = 90;
      this.scene.add( light );

      var timeOutValue = 1000;

      var light2 = new THREE.SpotLight( 0xffffff, 3 );
      light2.position.set(1557, 593, 10);
      light2.target.position.set( 117, 18, -28);
      light2.target.updateMatrixWorld();
      light2.castShadow = true;
      light2.shadow.mapSize.width =
      light2.shadow.mapSize.height = 2048;

      light2.shadow.camera.near = 500;
      light2.shadow.camera.far = 3000;
      light2.shadow.camera.fov = 40;
      this.scene.add( light2 );
      this.scene.add( light2.target );




      var light3 = new THREE.PointLight( 0xffffff, 0.2 );

      light3.position.set( 5, 290, 740);

      this.scene.add( light3 );

      ls.update('room');
      var pStatic = handler.loadAsset('static');
      pStatic.then(function(object){
        setTimeout (function () {
          this.scene.add(object);
          ls.update('furniture');
          var pFurniture = handler.loadAsset('furniture');
          pFurniture.then(function(object){
            setTimeout(function () {

              this.scene.add(object);
              ls.update('walls');
              var pLeftSmall = handler.loadAsset('left_small');
              var pRightSmall = handler.loadAsset('right_small');
              var pLeftMedium = handler.loadAsset('left_medium');
              var pRightMedium = handler.loadAsset('right_medium');
              var pLeftLarge = handler.loadAsset('left_large');
              var pRightLarge = handler.loadAsset('right_large');

              Promise.all([pLeftSmall, pRightSmall, pLeftMedium, pRightMedium, pLeftLarge, pRightLarge]).then(function(objects){
                setTimeout(function () {
                  for (var key in objects) {
                    for (var mKey in objects[key].material.materials) {
                      objects[key].material.materials[mKey].transparent = true;
                      if (objects[key].material.materials[mKey].name == 'Glass') continue;
                      objects[key].material.materials[mKey].opacity = 0;
                    }
                    objects[key].visible = false;
                    this.scene.add(objects[key]);

                    var position = objects[key].name.slice(0, objects[key].name.search('_'));
                    var type = objects[key].name.slice(objects[key].name.search('_')+1, objects[key].name.length);
                    ui.addButton(type, position, attachCallbackWall.bind(this));
                  }
                  setDefaultWalls();
                  ls.update('shaders');
                  var pShaderSmall = handler.loadMorphedAsset('right_small_shader');
                  var pShaderMedium = handler.loadMorphedAsset('right_medium_shader');
                  var pShaderLarge = handler.loadMorphedAsset('right_large_shader');
                  Promise.all([pShaderSmall, pShaderMedium, pShaderLarge]).then(function (objects) {
                    setTimeout(function () {
                      for (var key in objects) {
                        objects[key].visible = false;
                        this.scene.add(objects[key]);
                      }
                      setDefaultShader();
                      ls.update('cold shader');
                      ui.addSlider('right', 0, 2, 1, attachCallbackShader.bind(this));
                      var pCold = handler.loadMorphedAsset('cold').then(function (object) {
                        setTimeout(function () {
                          this.scene.add(object);
                          for (var mKey in object.material.materials) {
                            object.material.materials[mKey].transparent = true;
                          }
                          ui.addSlider('left', 0, 3, 1, attachCallbackCold.bind(this));
                          ls.update('winter character');
                          var pWinter = handler.loadAnimatedAsset('winter', true);
                          pWinter.then(function (object) {
                            setTimeout(function () {
                              object.position.set(-270, 18, -68);
                              //object.scale.set(2.54,2.54,2.54);
                              this.scene.add(object);
                              for (var key in handler.animations.winter) {
                                if (handler.animations.winter[key]._clip.name.includes('_to_') || handler.animations.winter[key]._clip.name == 'idle') { }
                                else {
                                  ui.addButton(handler.animations.winter[key]._clip.name, 'winter', attachCallbackAnimation.bind(handler.animations.winter[key]));
                                  handler.animations.winter[key].repetitions = 0;
                                }
                              }
                              // default
                              this.currentAnimations.winter = handler.animations.winter[0];
                              this.currentAnimations.winter.play();
                              ls.update('summer character');
                              var pSummer = handler.loadAnimatedAsset('summer', true);
                              pSummer.then(function (object) {
                                setTimeout(function () {
                                  object.position.set(266, 18, -45);
                                  this.scene.add(object);
                                  for (var key in handler.animations.summer) {
                                    if (handler.animations.summer[key]._clip.name.includes('_to_') || handler.animations.summer[key]._clip.name == 'idle') { }
                                    else {
                                      ui.addButton(handler.animations.summer[key]._clip.name, 'summer', attachCallbackAnimation.bind(handler.animations.summer[key]));
                                      handler.animations.summer[key].repetitions = 0;
                                    }
                                  }
                                  // default
                                  this.currentAnimations.summer = handler.animations.summer[0];
                                  this.currentAnimations.summer.play();
                                  ls.update('done');
                                }.bind(this), timeOutValue);
                              }.bind(this));
                            }.bind(this), timeOutValue);
                          }.bind(this));
                        }.bind(this), timeOutValue);
                      }.bind(this));
                    }.bind(this), timeOutValue);
                  }.bind(this));
                }.bind(this), timeOutValue);
              }.bind(this));
            }.bind(this), timeOutValue);
          }.bind(this));
        }.bind(this), timeOutValue);
      }.bind(this));
    };

    stage.startRenderLoop = function () {
      requestAnimationFrame(this.startRenderLoop.bind(this));

      this.clock_delta = this.clock.getDelta();

      for (var key in handler.animation_mixers) {
        handler.animation_mixers[key].update(this.clock_delta );
      }

      TWEEN.update();
      this.engine.render(this.scene, this.camera);
    };

    function setDefaultWalls () {
      stage.currentWalls.left = handler.assets.left_small;
      stage.currentWalls.right = handler.assets.right_small;

      for (var lKey in stage.currentWalls.left.material.materials) {
        if (stage.currentWalls.left.material.materials[lKey].name == 'Glass') continue;
        stage.currentWalls.left.material.materials[lKey].opacity = 1;
      }
      stage.currentWalls.left.visible = true;

      for (var rKey in stage.currentWalls.right.material.materials) {
        if (stage.currentWalls.right.material.materials[rKey].name == 'Glass') continue;
        stage.currentWalls.right.material.materials[rKey].opacity = 1;
      }
      stage.currentWalls.right.visible = true;
    }

    function attachCallbackWall (e) {
      var position = e.target.id.slice(0, e.target.id.search('_'));
      var tweenTime = 100;

      for (var keyOut in this.currentWalls[position].material.materials) {
        if (this.currentWalls[position].material.materials[keyOut].name == 'Glass') continue;
        new TWEEN.Tween(this.currentWalls[position].material.materials[keyOut]).to({opacity: 0}, tweenTime).start();
      }

      setTimeout(function () {
        this.currentWalls[position].visible = false;
        this.currentWalls[position] = handler.assets[e.target.id];
        this.currentWalls[position].visible = true;
        for (var keyIn in this.currentWalls[position].material.materials) {
          if (this.currentWalls[position].material.materials[keyIn].name == 'Glass') continue;
          new TWEEN.Tween(this.currentWalls[position].material.materials[keyIn]).to({opacity: 1}, tweenTime).start();
        }

        if (position === 'right') {
          this.currentShader.visible = false;
          this.currentShader = handler.assets[e.target.id+'_shader'];
          this.currentShader.visible = true;
        }
      }.bind(this), tweenTime);
    }

    function setDefaultShader () {
      stage.currentShader = handler.assets.right_small_shader;
      stage.currentShader.visible = true;
    }

    function attachCallbackShader (e) {
      switch( e.target.valueAsNumber) {
        case 0:
            this.currentShader.morphTargetInfluences[0] = 1;
            this.currentShader.morphTargetInfluences[1] = 0;
            this.currentShader.morphTargetInfluences[2] = 0;
            break;
        case 1:
            this.currentShader.morphTargetInfluences[0] = 0;
            this.currentShader.morphTargetInfluences[1] = 1;
            this.currentShader.morphTargetInfluences[2] = 0;
            break;
        case 2:
            this.currentShader.morphTargetInfluences[0] = 0;
            this.currentShader.morphTargetInfluences[1] = 0;
            this.currentShader.morphTargetInfluences[2] = 1;
            break;
          }
    }

    function attachCallbackCold (e) {
      for (var key in handler.assets.cold.morphTargetInfluences) {
        handler.assets.cold.morphTargetInfluences[key] = 0;
      }
      handler.assets.cold.morphTargetInfluences[e.target.valueAsNumber] = 1;
    }

    function attachCallbackAnimation (e) {
      var position = e.target.id.slice(0, e.target.id.search('_'));
      if (this == stage.currentAnimations[position]) return;
      clearTimeout(stage.timeOuts[position]);
      this.enabled = true;
      if (this.isRunning()) {
        this.reset();
      } else {
        this.play();
      }
      this.crossFadeFrom(stage.currentAnimations[position], 0.5);
      stage.currentAnimations[position] = this;
      stage.timeOuts[position] = setTimeout(function () {
        handler.animations[position][0].enabled = true;
        handler.animations[position][0].play();
        handler.animations[position][0].crossFadeFrom(stage.currentAnimations[position], 1);
        stage.currentAnimations[position] = handler.animations[position][0];
      }, this._clip.duration * 1000 - 1000);
      if (this._clip.name == 'side_walk' && handler.assets[position].position.x < -90) {
         new TWEEN.Tween(handler.assets[position].position).to({x: handler.assets[position].position.x + 30}, this._clip.duration * 700).easing(TWEEN.Easing.Cubic.In).start();
      //handler.assets[position].position.x += 100;
      }
          }

    function resizeWindow () {

      var container_width = $(handler.container).width();
      var container_height = $(handler.container).height();
      this.engine.setSize(container_width, container_height);

      this.camera.aspect = container_width / container_height;
      this.camera.fov = interpolate(0.35,this.camera.aspect,3,85,10);
  		this.camera.updateProjectionMatrix();

    }
    function interpolate(x1,x2,x3,y1,y3) {
      return ((x2 - x1) * (y3 - y1)) / (x3 - x1) + y1;
    }
    return stage;
  }
);
