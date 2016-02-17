define(
  ['handler', 'stage'],
  function (handler, stage) {
    var main = {};

    main.init = function (container_id) {
      handler.container = document.getElementById(container_id);
      stage.init();
    };

    return main;
  }
);
