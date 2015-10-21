var GlobalFunctions = {};
define(["three", "jquery", "loader", "animate", "tween", "events", "audio"],
    function(THREE, jquery, loader, animate, tween, events, audio){
    var main = {}; //public functionality
    /***private fields***/
    var camFOV = 45; //camera field of view in degrees
    var width, height; //browser window dimension
    var container; //html element for webGL renderer
    var camNear = 1, camFar = 17000; //camera frustum near and far clip planes
    var loadingScene = true;

    /***private functions***/
    function addRenderer() {
        animate.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false,
            logarithmicDepthBuffer: false});
        animate.renderer.setSize( width, height );
        animate.renderer.setClearColor( 0x000000, 0.0 );
        container.appendChild( animate.renderer.domElement );
    }

    function addCamera () {
        animate.camera = new THREE.PerspectiveCamera( camFOV, width / height, camNear, camFar );
        animate.camera.position.set(0, 0, 0);
        main.loader.scene.add( animate.camera );
    }
    /***end private functions***/

    /***public fields***/
    main.scene = undefined;
    main.loader = undefined;

    /***public functions***/
    main.Start = function(sceneID){
        //entry point (first function called by require in app.js)
        loader.LoadingScreen.add();
        width = $(window).width();
        height = $(window).height();
        container = document.getElementById( 'webGL' );
        main.scene = new THREE.Scene();
        main.scene.sceneID = sceneID;
        main.loader = new loader(main.scene, animate);
        animate.loader = main.loader;
        addRenderer();
        addCamera();
        main.buttons.loadCardinal.add();
        main.buttons.load_i89.add();
        main.buttons.loadLoE.add();
        //main.buttons.loadNeat.add();
        loadingScene = false;
        //because they are unique, lights are added by each scene's individual file
    };

    main.LoadNewScene = function(sceneID){
        //only call after Start()
        if(loadingScene) return;
        loader.LoadingScreen.show();
        loadingScene = true;
        audio.StopAll();
        animate.StopAnimating();
        events.UnbindAll();
        events.EmptyElementByID("cameraButtons");
        animate.updater.clearAll();
        TWEEN.removeAll();
        main.loader.UnloadScene(newScene);

        function newScene(){
            main.scene = new THREE.Scene();
            main.scene.sceneID = sceneID;
            main.loader = new loader(main.scene, animate);
            animate.loader = main.loader;
            addCamera();
            loadingScene = false;
        }
    };
    /***end public functions***/

    main.buttons = {
        loadCardinal:{
            add: function(){
                events.AddButton({text:"load cardinal", function: function(){
                    main.LoadNewScene("cardinal")}, id:"load_cardinal", parent:"loadButtons"
                });
            }
        },
        load_i89:{
            add: function(){
                events.AddButton({text:"load i89", function: function(){
                    main.LoadNewScene("i89")}, id:"load_i89", parent:"loadButtons"
                });
            }
        },
        loadLoE:{
            add: function(){
                events.AddButton({text:"load LoE", function: function(){
                    main.LoadNewScene("LoE")}, id:"load_LoE", parent:"loadButtons"
                });
            }
        },
        loadNeat:{
            add: function(){
                events.AddButton({text:"load neat", function: function(){
                    main.LoadNewScene("neat")}, id:"loadNeat", parent:"loadButtons"
                });
            }
        }
    };

    return main;
});
