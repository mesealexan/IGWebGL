define(
  ['jquery', 'three'],
  function () {
    var handler = {
      container: undefined,
      JSONLoader: undefined,
      assets: [],
      lights: [],
      tweens: [],
      animation_mixers: [],
      animations: []
    };

    handler.init = function (container_id) {
      this.container = document.getElementById(container_id);
      this.JSONLoader = new THREE.JSONLoader();
    };

    handler.loadAsset = function (asset) {
      var promise = new Promise(function (resolve, reject) {
        var assetURL = './assets/'+asset+'.js';
        $.get(assetURL).done(function () {
          this.JSONLoader.load(
            assetURL,
            function (geometry, materials) {
              setMaterials(materials);
              var material = new THREE.MeshFaceMaterial(materials);
              var object = new THREE.Mesh(geometry, material);
              object.name = asset;
              this.assets[asset] = object;
              resolve(object);
            }.bind(this)
          );
        }.bind(this)).fail(function () {
          reject('Could not find file: ' + assetURL);
        });
      }.bind(this));
      return promise;
    };

    handler.loadAnimatedModel = function (asset) {
      var promise = new Promise(function (resolve, reject) {
        var assetURL = './assets/'+asset+'.js';
        $.get(assetURL).done(function () {
          handler.JSONLoader.load(
            assetURL,
            function (geometry, materials) {
              geometry.computeVertexNormals();
              for (var key in materials) {
                materials[key].skinning = true;
              }
              var material = new THREE.MeshFaceMaterial(materials);
              var object = new THREE.SkinnedMesh(geometry, material);
              handler.assets[asset] = object;
              resolve(object);
            }
          );
        }).fail(function () {
          reject('Could not find file: ' + assetURL);
        });
      });

      return promise;
    };

    handler.loadAnimation = function (target, asset) {
      var promise = new Promise(function (resolve, reject) {
        var assetURL = './assets/'+asset+'.js';
        $.get(assetURL).done(function () {
          handler.JSONLoader.load(
            assetURL,
            function (geometry, materials) {
              if (!handler.animation_mixers[target]) {
                handler.animation_mixers[target] = new THREE.AnimationMixer(handler.assets[target]);
              }
              if (!handler.animations[target]) {
                handler.animations[target] = [];
              }
              handler.animations[target][asset] = handler.animation_mixers[target].clipAction(geometry.animations[0]);
              resolve(asset);
            }
          );
        }).fail(function () {
          reject('Could not find file: ' + assetURL);
        });
      });

      return promise;
    };

    handler.tempAnim = function (asset) {
      var promise = new Promise(function (resolve, reject) {
        var assetURL = './assets/'+asset+'.js';
        $.get(assetURL).done(function () {
          handler.JSONLoader.load(
            assetURL,
            function (geometry, materials) {
              geometry.computeVertexNormals();
              for (var key in materials) {
                materials[key].skinning = true;
              }
              var material = new THREE.MeshFaceMaterial(materials);
              var object = new THREE.SkinnedMesh(geometry, material);
              object.name = asset;
              handler.assets[asset] = object;
              if (!handler.animation_mixers[asset]) {
                handler.animation_mixers[asset] = new THREE.AnimationMixer(handler.assets[asset]);
              }
              if (!handler.animations[asset]) {
                handler.animations[asset] = [];
              }
              handler.animations[asset][asset] = handler.animation_mixers[asset].clipAction(geometry.animations[0]);
              handler.animations[asset][asset].play();
              resolve(object);
            }
          );
        }).fail(function () {
          reject('Could not find file: ' + assetURL);
        });
      });
      return promise;
    };

    function setMaterials (materials) {
      for (var key in materials) {
        switch (materials[key].name) {
          case 'room_mat': {
            materials[key] = new THREE.MeshPhongMaterial({map: materials[key].map});
            break;
          }
        }
      }
    }

    return handler;
  }
);
