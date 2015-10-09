require.config({
    paths: {
        "jquery" : "../lib/jquery/dist/jquery.min",
         "three" : "../lib/three.js/build/three",
          "main" : "main",
       "animate" : "animate"
    }
});

require(["main"], function(main){
    main.Start();
    console.log(main)
});