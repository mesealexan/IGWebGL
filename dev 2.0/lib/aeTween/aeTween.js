define(["animate"], function (animate) {
  var aeTween = function(obj){
    var _this = this,
        _obj = obj,
        _propNames = [],
        _perFame = {},
        _initialValues = {},
        _delay = 0,
        _updateFunctions = [],
        _frames = undefined,
        _curFrame = 1,
        _repeats = 0,
        _curRepeats = 0;

    this.to = function (props, frames) {
      _propNames = Object.keys(props);
      setPerFrame(props, frames);
      _frames = frames;
    };

    this.onComplete = function(){};

    this.delay = function (d) {
      _delay = d;
      _updateFunctions.unshift(delay);
    };

    this.start = function  () {
      _updateFunctions.push(linearInterpolation);
      animate.updater.addHandler(this);
    };

    this.update = function () {
      for (var a = 0; a < _updateFunctions.length; a++) {
        if(!_updateFunctions[a]()) {/*return;*/ break;}
      }

      checkFinished();
    };

    this.stop = function  () {
      _curFrame = 0;
      _updateFunctions.length = 0;
      animate.updater.removeHandler(this);
      checkRepeat();
    };

    this.repeat = function  (r) {
      _repeats = r;
    };

    function setPerFrame (props, frames) {
      for (var i = 0; i < _propNames.length; i++) {
        var curProp = _propNames[i],
            from    = _obj[curProp],
            to      = props[curProp];

        var perFrame = (to - from) / frames;
        _perFame[curProp] = perFrame;
        _initialValues[curProp] = from;
      };
    }

/***_updateFunctions***/
    function delay () {
      if(_curFrame < _delay)
        return false;
      else{
        _updateFunctions.shift();
        return true;
      }
    }

    function linearInterpolation () {
      for (var i = 0; i < _propNames.length; i++) {
        var curProp = _propNames[i];
        _obj[curProp] += _perFame[curProp];
      };
      return true;
    }

    function checkFinished () {
     if(_curFrame++ == _frames + _delay){
       _this.stop();
       _this.onComplete();
     }
    }

    function checkRepeat(){
     if(_curRepeats < _repeats){
      _curRepeats++;
      for (var key in _initialValues)
        if (_initialValues.hasOwnProperty(key))
          _obj[key] = _initialValues[key];
      _this.start();
     }
    }
  };
  aeTweenG = aeTween;
  return aeTween;
});


var aeTweenG;
