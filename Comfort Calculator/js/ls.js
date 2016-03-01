define(
  ['jquery'],
  function () {
    var ls = {
      maps_count: 0,
      assets_count: 0,
      maps_loaded: 0,
      assets_loaded: 0
    };

    ls.updateLoader = function () {
      $('#ls').html(Math.floor((this.maps_loaded+this.assets_loaded)/(this.maps_count+this.assets_count) * 100)+'%');
      if (this.maps_loaded+this.assets_loaded == this.maps_count+this.assets_count) {
        setTimeout(function () {
          $('#ls').css( "visibility", "hidden" );
        }, 1000);
      }
    };

    return ls;
  }
);
