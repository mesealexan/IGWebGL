require.config({
    paths: {
        "jquery" : "../lib/jquery/dist/jquery.min",
         "three" : "../lib/three.js/build/three",
    "underscore" : "../lib/underscore/underscore",
          "main" : "main",
       "animate" : "animate",
        "loader" : "loader",
           "i89" : "i89"
    }
    ,
    shim: {
        three: {exports: "THREE"}
    }
});

require(["main"], function(main){
    main.Start("i89");//pass selected sceneID
});