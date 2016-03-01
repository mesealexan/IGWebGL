define(
  ['jquery'],
  function () {
    var ls = {
      maps_count: 0,
      maps_loaded: 0
    };

    ls.update = function (value) {
      if (value == 'done') {
        $('#ls').css('visibility', 'hidden');
      } else {
        $('#ls').html('Loading: ' + value);
      }
    };

    return ls;
  }
);
