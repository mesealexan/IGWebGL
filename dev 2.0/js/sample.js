var resize;
define(["cardinal", "i89", "LoE", "neat", "animate"],
function(cardinal, i89, LoE, neat, animate){
  console.info('cardinal:', cardinal);
  console.info('i89:', i89);
  console.info('LoE:', LoE);
  console.info('neat:', neat);
  console.info('animate:', animate);
  /******callbacks****/
  cardinal.callbacks.introAnimDone.extraCallback = function () {
    console.info("this callback was added dynamically for cardinal scene");
  };

  i89.callbacks.heaterStart.extraCallback = function () {
    console.info("this callback was added dynamically for i89 scene");
  };
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
