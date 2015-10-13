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
        "genericHandler" : "genericHandler",
         "cameraHandler" : "cameraHandler",
      "animationHandler" : "animationHandler",
           "snowHandler" : "snowHandler",
                   "i89" : "i89",
                   "LoE" : "LoE"
    }
    ,
    shim: {
        three: {
            exports: "THREE",
            tween: "TWEEN"
        }
    }
});

var nextScene = "LoE";
require(["main"], function(main){
    main.Start("LoE");
    //main.Start("i89");

    /*setInterval(function(){
        if(nextScene == "LoE")nextScene = "i89";
        else nextScene = "LoE";
        main.LoadNewScene(nextScene);
    }, 3000);*/
});