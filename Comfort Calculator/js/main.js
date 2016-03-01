define(
  ['handler', 'stage'],
  function (handler, stage) {
    var main = {};

    main.init = function (container_id) {
      handler.init(container_id);

      var plm = handler.preLoadMaps();
      plm.then(function () {
        stage.init();
        stage.loadStage();
        stage.startRenderLoop();
      }).catch(console.log.bind(console));
    };

    return main;
  }
);
