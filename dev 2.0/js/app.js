require.config({
    paths: {
                "jquery" : "../lib/jquery/dist/jquery.min",
                 "three" : "../lib/three.js/build/three",
            "underscore" : "../lib/underscore/underscore",
                 "tween" : "../lib/tween.js/src/Tween_iosFix",//modified to work for iOS
                 "watch" : "../lib/Watch.js/src/watch",
                  "main" : "main",
             "materials" : "materials",
               "animate" : "animate",
                "loader" : "loader",
               "updater" : "updater",
                "events" : "events",
        "genericHandler" : "genericHandler",
         "cameraHandler" : "cameraHandler",
      "animationHandler" : "animationHandler",
           "snowHandler" : "snowHandler",
                   "i89" : "i89",
                   "LoE" : "LoE",
              "cardinal" : "cardinal"
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

var nextScene = ["LoE", "cardinal", "i89"];
require(["main"], function(main){
    //main.Start("LoE");
    //main.Start("i89");
    main.Start("cardinal");

    /*setInterval(function(){
        main.LoadNewScene(nextScene[Math.floor(Math.random() * 3)]);
    }, 5000);*/
});