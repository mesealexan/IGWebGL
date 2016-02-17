define(
  ['jquery', 'three'],
  function () {
    var handler = {
      container: undefined,
      JSONLoader: undefined,
      assets: [],
      lights: [],
      tweens: []
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

    return handler;
  }
);
