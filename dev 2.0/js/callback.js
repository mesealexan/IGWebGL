define(["underscore"], function(underscore){
  var callback = {
    cardinal:{
      introAnimDone:{

      }
    }
  };

  callback.go = function (obj) {
    _.each(_.functions(obj), function(fun){ obj[fun](); });
  };

  return callback;
});
