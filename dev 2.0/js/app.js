require.config({
    paths: {
            //"helvetiker" : "../lib/helvetiker_regular.typeface",
           "bankGothinc" : "../lib/Bank Gothic_Regular.typeface",
               "aeTween" : "../lib/aeTween/aeTween",
                "jquery" : "../lib/jquery/dist/jquery.min",
         "orbitControls" : "../lib/three.js/OrbitControls",
                 "cloth" : "../lib/three.js/Cloth",
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
                 "tween" : "../lib/tween.js/src/Tween_iosFix", //modified to work for iOS
                 "watch" : "../lib/watch.js/src/watch",
                "bowser" : "../lib/bowser/bowser",
                  "buzz" : "../lib/buzz/buzz",
                "hammer" : "../lib/hammerjs/hammer",
                   "gui" : "../lib/gui/dat.gui.min"
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

require(["main", "jquery"], function ( main ) {
  var scenes = [ "ig", "i89", "loe", "neat", "seaStorm" ];
  main.Start( "webGL", "seaStorm" );
});

require( ["sample"] );
