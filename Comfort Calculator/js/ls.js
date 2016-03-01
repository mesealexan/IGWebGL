define(
  ['jquery'],
  function () {
    var ls = {
      maps_count: 0,
      maps_loaded: 0
    };

    ls.update = function (value) {
      if (value == 'done') {
        $('#ls').html('Load completed');
        setTimeout(function(){ 
          $('#ls_holder').css('display', 'none');
         }, 1000);
        
      } else {
        $('#ls').html('Loading: ' + value + " ...");
      }
    };

    return ls;
  }
);
