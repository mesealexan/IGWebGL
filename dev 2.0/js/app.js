require.config({
    paths: {
                "jquery" : "../lib/jquery/dist/jquery.min",
                 "three" : "../lib/three.js/build/three",
            "underscore" : "../lib/underscore/underscore",
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
        three: {exports: "THREE"}
    }
});
var nextScene = "LoE";
require(["main"], function(main){
    main.Start("LoE");
    //main.Start("i89");

    /*setInterval(function(){
        main.loader.UnloadScene();
        if(nextScene == "LoE")nextScene = "i89";
        else nextScene = "LoE";
        main.LoadScene(nextScene);
    }, 3000);*/
});