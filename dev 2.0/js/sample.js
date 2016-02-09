define( [ "animate", "cardinal", "i89", "LoE", "audio" ] ,
function( animate, cardinal, i89, LoE, audio ) {

console.info( "audio", audio );

/***animate***/
//start window auto resize. default is 'on'
//animate.StartWindowAutoResize();
//stop window auto resize
//animate.StopWindowAutoResize();
//call window resize
//animate.ResizeWindow();

animate.onLoadProgress.test = function (percent, loader) {

};

function onSampleSoundLoad (sound) {
  console.info("sound loaded");
  console.info(sound);
  //audio.sounds.neatmagicwand.play();
}

var sampleSound = audio.LoadExternal( "neat-magic-wand",  // pass a name
                                      "media",            // media folder URL
                                       onSampleSoundLoad  // on load function
                                     );

/***adding callbacks***/
cardinal.callbacks.introAnimHalfway.extraCallback = function () {
  console.info("introAnimHalfway callback was added dynamically");
};

cardinal.callbacks.introAnimDone.extraCallback = function () {
    console.info("scene also accesible from callbacks: " , cardinal.scene);
    console.info("introAnimDone callback was added dynamically");
};

cardinal.callbacks.goToSliceStart.extraCallback = function () {
  console.info("goToSliceStart callback was added dynamically");
};

/***scene control***/
GlobalFunctions.cardinal = {
  goToSlice: function() {
    cardinal.scene.goToSlice();
  },
  backToMain: function() {
    cardinal.scene.backToMain();
  },
  sealantA: function() {
    cardinal.scene.zoomOnSlice.sealantA();
  },
  sealantB: function() {
    cardinal.scene.zoomOnSlice.sealantB();
  },
  spacer: function() {
    cardinal.scene.zoomOnSlice.spacer();
  },
  dessicant: function() {
    cardinal.scene.zoomOnSlice.dessicant();
  },
  backToSlice: function() {
    cardinal.scene.zoomOnSlice.backToSlice();
  }
};

GlobalFunctions.i89 = {
  i89off: function() {
    i89.scene.switchWindow.toggleOFF();
  },
  i89on: function() {
    i89.scene.switchWindow.toggleON();
  },
  goOutside: function(){
    i89.scene.tweenCamera("outside");
  },
  goInside: function(){
    i89.scene.tweenCamera("inside");
  }
};

GlobalFunctions.LoE = {
  changeBackground: function(val){// "hot", "cold", "mixed"
    LoE.scene.manageBackgroundOpacity(val)
  }
};
});
