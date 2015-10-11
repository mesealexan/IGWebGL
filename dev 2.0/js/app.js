require.config({
    paths: {
                "jquery" : "../lib/jquery/dist/jquery.min",
                 "three" : "../lib/three.js/build/three",
            "underscore" : "../lib/underscore/underscore",
                  "main" : "main",
               "animate" : "animate",
                "loader" : "loader",
               "updater" : "updater",
        "genericHandler" : "genericHandler",
         "cameraHandler" : "cameraHandler",
                   "i89" : "i89",
                   "LoE" : "LoE"
    }
    ,
    shim: {
        three: {exports: "THREE"}
    }
});

require(["main"], function(main){
    main.Start("LoE");
    //main.Start("i89");
});