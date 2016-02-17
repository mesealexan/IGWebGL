define(
  [],
  function () {
    var ui = {};

    ui.addButton = function (value, position, callback) {
      var button = document.createElement('button');
      button.innerHTML = value;
      button.onclick = callback;
      button.id = position + '_' + value;
      document.getElementById('UI_'+position).appendChild(button);
    };

    return ui;
  }
);
