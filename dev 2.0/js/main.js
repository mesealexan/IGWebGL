var GlobalFunctions = new Object();
define(["three", "jquery", "loader", "animate", "tween", "events"],
    function(THREE, jquery, loader, animate, tween, events){
    var main = {}; //public functionality
    /***private fields***/
    var camFOV = 45; //camera field of view in degrees
    var width, height; //browser window dimension
    var container; //html element for webGL renderer
    var camNear = 1, camFar = 17000; //camera frustum near and far clip planes

    /***private functions***/
    function addRenderer() {
        animate.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
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
        width = $(window).width();
        height = $(window).height();
        container = document.getElementById( 'webGL' );
        main.scene = new THREE.Scene();
        main.scene.sceneID = sceneID;
        main.loader = new loader(main.scene, animate);
        animate.loader = main.loader;
        addRenderer();
        addCamera();
        //because they are unique, lights are added by each scene's individual file
    };

    main.LoadNewScene = function(sceneID){
        //only call after Start()
        events.UnbindAll();
        animate.updater.clearAll();
        main.loader.UnloadScene();
        animate.StopAnimating();
        TWEEN.removeAll();

        main.scene = new THREE.Scene();
        main.scene.sceneID = sceneID;
        main.loader = new loader(main.scene, animate);
        animate.loader = main.loader;
        addCamera();
    };
    /***end public functions***/

    return main;
});
