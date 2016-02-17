define(
  [],
  function () {
    var ui = {};

    ui.addButton = function (value, position, callback) {
      var button = document.createElement('button');
      button.innerHTML = value;
      button.onclick = callback;
      document.getElementById('UI').appendChild(button);
    };

    return ui;
  }
);
