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
<<<<<<< HEAD
  //main.Start("LoE");
  //main.Start("i89");
  main.Start("cardinal");
  //main.Start("neat");
=======
    //main.Start("LoE");
    //main.Start("i89");
    //main.Start("cardinal");
    main.Start("neat");
    //main.Start(nextScene[Math.floor(Math.random() * 3)]);

    /*
    setInterval(function(){
        main.LoadNewScene(nextScene[Math.floor(Math.random() * 3)]);
    }, 2000);
    */
>>>>>>> refs/remotes/origin/tudor
});

require(["sample"]);
