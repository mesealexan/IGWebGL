define(
  ['jquery'],
  function () {
    var ui = {};

    ui.addButton = function (value, position, callback) {
      var button = document.createElement('button');
      button.innerHTML = value;
      button.onclick = callback;
      button.id = position + '_' + value;
      button.className = "button";
      document.getElementById('UI_'+position).appendChild(button);
    };

    ui.addSlider = function (position, min, max, step, callback) {
      var slider = document.createElement("INPUT");
      slider.setAttribute("type", "range");
      slider.onchange = callback;
      slider.min = min;
      slider.max = max;
      slider.step = step;
      slider.defaultValue = 0;
      document.getElementById('UI_'+position).appendChild(document.createElement("br"));
      document.getElementById('UI_'+position).appendChild(slider);
    };

    return ui;
  }
);
