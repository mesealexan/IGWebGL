define(["underscore"],function (underscore) {
  return function(){
    var _this = this;
    this.folderName = undefined;
    this.assetNames = [];
    this.soundNames = [];
    this.onStartFunctions = {};
    this.onLoadFunctions = {};
    this.onUnloadFunctions = {};
    this.onFinishLoadFunctions = {};
    this.animationHandlers = {};
    this.intervals = {};
    this.timeouts = {};
    this.assets = {};
    this.callbacks = {};

    this.init = function () {};

    this.addAssets = function(arr){
      _.each(arr, function (a) { _this.assetNames.push ( a ); });
    };

    this.addSounds = function(arr){
      _.each(arr, function (s) { _this.soundNames.push ( s ); });
    };
  };
});
