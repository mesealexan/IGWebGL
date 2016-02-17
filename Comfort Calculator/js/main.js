define(
  ['handler', 'stage'],
  function (handler, stage) {
    var main = {};

    main.init = function (container_id) {
      handler.init(container_id);
      stage.init();
      stage.loadStage();
      stage.startRenderLoop();
    };

    return main;
  }
);
