define( [], function() {
return function ( animate ) {
  var _this = this;
  var animate = animate;
  var locked = false;

  this.Camera = animate.camera;
  this.Events = animate.events;

  this.update = function () {
    if ( locked ) return;
    var currentAzimuth = this.Events.Controls.getAzimuthalAngle();
    if( currentAzimuth <= this.Events.Controls.minAzimuthAngle ||
        currentAzimuth >= this.Events.Controls.maxAzimuthAngle)
          this.Events.Controls.flipRotationAngle();
    this.Events.Controls.update();
  };

  this.Start = function () {
    this.Events.Controls.autoRotate = true;
    animate.updater.addHandler( this );
  };

  this.Stop = function () {
    if ( this.Events.Controls == undefined ) return;
    this.Events.Controls.autoRotate = false;
    animate.updater.removeHandler( this );
  };

  this.Lock = function ( bool ) {
    locked = bool;
  }
}
});
