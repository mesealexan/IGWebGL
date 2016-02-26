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
        // $.get(assetURL).done(function () {
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
        // }.bind(this)).fail(function () {
          // reject('Could not find file: ' + assetURL);
        // });
      }.bind(this));
      return promise;
    };

    handler.loadMorphedAsset = function (asset) {
      var promise = new Promise(function (resolve, reject) {
        var assetURL = './assets/'+asset+'.js';
        // $.get(assetURL).done(function () {
          handler.JSONLoader.load(
            assetURL,
            function (geometry, materials) {
              geometry.computeVertexNormals();
              for (var key in materials) {
                materials[key].morphTargets = true;
              }
              var material = new THREE.MeshFaceMaterial(materials);
              var object = new THREE.Mesh(geometry, material);
              handler.assets[asset] = object;
              resolve(object);
            }
          );
        // }).fail(function () {
          // reject('Could not find file: ' + assetURL);
        // });
      });
      return promise;
    };

    handler.loadAnimatedAsset = function (asset, timeFix) {
      var promise = new Promise(function (resolve, reject) {
        var assetURL = './assets/'+asset+'.js';
        // $.get(assetURL).done(function () {
          handler.JSONLoader.load(
            assetURL,
            function (geometry, materials) {
              geometry.computeVertexNormals();
              for (var key in materials) {
                materials[key].skinning = true;
              }
              if (timeFix) {
                fixTimeFrame(geometry.animations);  
              }
              var material = new THREE.MeshFaceMaterial(materials);
              var object = new THREE.SkinnedMesh(geometry, material);
              handler.assets[asset] = object;
              if (!handler.animation_mixers[asset]) {
                handler.animation_mixers[asset] = new THREE.AnimationMixer(handler.assets[asset]);
              }
              if (!handler.animations[asset]) {
                handler.animations[asset] = [];
              }
              for (var ani_key in geometry.animations) {
                handler.animations[asset].push(handler.animation_mixers[asset].clipAction(geometry.animations[ani_key]));
              }
              resolve(object);
            }
          );
        // }).fail(function () {
          // reject('Could not find file: ' + assetURL);
        // });
      });
      return promise;
    };

    function fixTimeFrame (animations) {
      for (var key01 in animations) {
        for (var key02 in animations[key01].tracks) {
          var offSet = Math.floor(animations[key01].tracks[key02].times[1]);
          for (var i = 1; i < animations[key01].tracks[key02].times.length; i++) {
            animations[key01].tracks[key02].times[i] -= offSet;
          }
        }
      }
    }

    function setMaterials (materials) {
      for (var key in materials) {
        switch (materials[key].name) {
          case 'room_mat': {
            //materials[key] = new THREE.MeshPhongMaterial({map: materials[key].map});
            break;
          }
        }
      }
    }

    return handler;
  }
);
