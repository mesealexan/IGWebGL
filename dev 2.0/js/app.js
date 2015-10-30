require.config({
    paths: {
                "jquery" : "../lib/jquery/dist/jquery.min",
        "orbitControls" : "../lib/three.js/OrbitControls",
                 "three" : "../lib/three.js/build/three",
            "underscore" : "../lib/underscore/underscore",
                 "tween" : "../lib/tween.js/src/Tween_iosFix",//modified to work for iOS
                 "watch" : "../lib/Watch.js/src/watch",
                "howler" : "../lib/howler.js/howler.core",
                  "main" : "main",
             "materials" : "materials",
                 "audio" : "audio",
               "animate" : "animate",
                "loader" : "loader",
               "updater" : "updater",
                "events" : "events",
        "genericHandler" : "genericHandler",
         "cameraHandler" : "cameraHandler",
      "animationHandler" : "animationHandler",
        "particleSystem" : "particleSystem",
           "snowHandler" : "snowHandler",
                   "i89" : "i89",
                   "LoE" : "LoE",
              "cardinal" : "cardinal",
                  "neat" : "neat"
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

var nextScene = ["LoE", "cardinal", "i89", "neat"];
require(["main"], function(main){
    //main.Start("LoE");
    main.Start("i89");
    //main.Start("cardinal");
    //main.Start("neat");
    //main.Start(nextScene[Math.floor(Math.random() * 3)]);

    /*
    setInterval(function(){
        main.LoadNewScene(nextScene[Math.floor(Math.random() * 3)]);
    }, 2000);
    */
});
