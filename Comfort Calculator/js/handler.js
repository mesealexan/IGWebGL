define(
  ['jquery', 'three'],
  function () {
    var handler = {
      container: undefined,
      JSONLoader: undefined,
      assets: []
    };

    handler.init = function (container_id) {
      this.container = document.getElementById(container_id);
      this.JSONLoader = new THREE.JSONLoader();
    };

    handler.loadAsset = function (asset) {
      var promise = new Promise(function (resolve, reject) {
        var assetURL = './assets/'+asset;
        $.get(assetURL).done(function () {
          handler.JSONLoader.load(
            assetURL,
            function (geometry, materials) {
              var material = new THREE.MeshFaceMaterial(materials);
              var object = new THREE.Mesh(geometry, material);
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

    return handler;
  }
);
