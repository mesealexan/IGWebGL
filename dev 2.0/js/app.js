require.config({
    paths: {
   //"Bank Gothic_Regular" : "../media/fonts/Bank Gothic_Regular",
               "aeTween" : "../lib/aeTween/aeTween",
                "jquery" : "../lib/jquery/dist/jquery.min",
         "orbitControls" : "../lib/three.js/OrbitControls",
                 "three" : "../lib/three.js/build/three71",
                 "physi" : "../lib/physi/physi",
                  "fxaa" : "../lib/EffectComposer/fxaa",
              "MaskPass" : "../lib/EffectComposer/MaskPass",
     "ConvolutionShader" : "../lib/EffectComposer/ConvolutionShader",
             "BloomPass" : "../lib/EffectComposer/BloomPass",
            "SSAOShader" : "../lib/EffectComposer/SSAOShader",
           "BokehShader" : "../lib/EffectComposer/BokehShader",
             "BokehPass" : "../lib/EffectComposer/BokehPass",
            "RenderPass" : "../lib/EffectComposer/RenderPass",
            "ShaderPass" : "../lib/EffectComposer/ShaderPass",
            "CopyShader" : "../lib/EffectComposer/CopyShader",
        "EffectComposer" : "../lib/EffectComposer/EffectComposer",
            "underscore" : "../lib/underscore/underscore",
                 "tween" : "../lib/tween.js/src/Tween_iosFix",//modified to work for iOS
                 "watch" : "../lib/watch.js/src/watch",
                "howler" : "../lib/howler.js/howler.core",
                "bowser" : "../lib/bowser/bowser",
                  "buzz" : "../lib/buzz/buzz",
                "hammer" : "../lib/hammerjs/hammer",
                   "gui" : "../lib/gui/dat.gui.min",
                  "main" : "main"
    }
    ,
    shim: {
        three: {
            exports: "THREE",
            tween: "TWEEN",
            watch: "watch"
        }
    }
});

require(["main"], function(main){
  require(["../media/fonts/Bank Gothic_Regular.typeface"]);
    //main.Start("webGL", "LoE");
    //main.Start("webGL", "i89");
    main.Start("webGL", "cardinal");
    //main.Start("webGL", "neat");
    //main.Start("webGL", "sound");
    //main.Start("webGL", "tornado");
    //main.Start("webGL", "devScene");
    //var scenes = ["LoE", "i89", "cardinal", "neat", "sound", "tornado"];
    /*setInterval(  function(){main.LoadNewScene(scenes[
      _.random(scenes.length - 1)
    ])}, 5000);*/
});


require(["sample"]);
