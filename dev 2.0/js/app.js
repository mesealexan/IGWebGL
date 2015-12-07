require.config({
    paths: {
                "jquery" : "../lib/jquery/dist/jquery.min",
         "orbitControls" : "../lib/three.js/OrbitControls",
                 "three" : "../lib/three.js/build/three71",
                 "physi" : "../lib/physi/physi",
                  "fxaa" : "../lib/EffectComposer/fxaa",
              "MaskPass" : "../lib/EffectComposer/MaskPass",
     "ConvolutionShader" : "../lib/EffectComposer/ConvolutionShader",
             "BloomPass" : "../lib/EffectComposer/BloomPass",
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
                "hammer" : "../lib/hammerjs/hammer",
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
    //main.Start("webGL", "LoE");
    //main.Start("webGL", "i89");
    //main.Start("webGL", "cardinal");
    //main.Start("webGL", "neat");
    //main.Start("webGL", "sound");
    main.Start("webGL", "tornado");
    //main.Start("webGL", "devScene");
});

require(["sample"]);
