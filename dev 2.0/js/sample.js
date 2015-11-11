define(["cardinal", "i89", "LoE", "neat"],
function(cardinal, i89, LoE, neat){
  console.info('cardinal:', cardinal);
  console.info('i89:', i89);
  console.info('LoE:', LoE);
  console.info('neat:', neat);

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

  //tween camera position
  //i89.tweenCamera("inside");
  //i89.tweenCamera("outside");

  /******LoE******/
  //manageBackgroundOpacity("hot");
  //manageBackgroundOpacity("cold");
  //manageBackgroundOpacity("mixed");
});
