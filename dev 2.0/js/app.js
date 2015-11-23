require.config({
    paths: {
                "jquery" : "../lib/jquery/dist/jquery.min",
         "orbitControls" : "../lib/three.js/OrbitControls",
                 "three" : "../lib/three.js/build/three",
            "underscore" : "../lib/underscore/underscore",
                 "tween" : "../lib/tween.js/src/Tween_iosFix",//modified to work for iOS
                 "watch" : "../lib/Watch.js/src/watch",
                "howler" : "../lib/howler.js/howler.core",
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
    main.Start("webGL", "sound");
    //console.log(require("tornado"));
});
