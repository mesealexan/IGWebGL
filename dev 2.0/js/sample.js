define( [ "callback" ] ,
function( callback ) {

  /*
  console.info('cardinal:', cardinal);
  console.info('i89:', i89);
  console.info('LoE:', LoE);
  console.info('neat:', neat);
  console.info('animate:', animate);
  var cardinal = new cardinalClass();
  */

  /******callbacks****/


  callback.cardinal.introAnimDone.extraCallback = function () {
    console.info("this callback was added dynamically");
  };
  console.log(callback.cardinal.introAnimDone);


  /*
  i89.callbacks.heaterStart.extraCallback = function () {
    console.info("this callback was added dynamically");
  };
  */

  /******animate******/
  //start window auto resize. default is 'on'
  //animate.StartWindowAutoResize();
  //stop window auto resize
  //animate.StopWindowAutoResize();
  //call window resize
  //animate.ResizeWindow();

  /******cardinal******/
  //zoom from main view to slice
  //cardinal.goToSlice();

  //further zoom on the slice
  //cardinal.zoomOnSlice.sealantA();
  //cardinal.zoomOnSlice.sealantB();
  //cardinal.zoomOnSlice.spacer();
  //cardinal.zoomOnSlice.dessicant();

  //back to slice from zoom in
  //cardinal.zoomOnSlice.backToSlice();

  //zoom out to main view
  //cardinal.backToMain();

  /******i89******/
  //toggle i89 window on/off
  //i89.switchWindow.toggleON();
  //i89.switchWindow.toggleOFF();
  //i89.onFinishLoadFunctions.testFunc = function(){...};

  //tween camera position
  //i89.tweenCamera("inside");
  //i89.tweenCamera("outside");

  /******LoE******/
  //LoE.manageBackgroundOpacity("hot");
  //LoE.manageBackgroundOpacity("cold");
  //LoE.manageBackgroundOpacity("mixed");
});
