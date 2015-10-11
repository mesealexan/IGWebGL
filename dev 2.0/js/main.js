define(["three", "jquery", "loader", "animate"],
    function(THREE, jquery, loader, animate){
    var main = {}; //public functionality
    /***private fields***/
    var camFOV = 45; //camera field of view in degrees
    var width, height; //browser window dimension
    var container; //html element for webGL renderer
    var camNear = 1, camFar = 10000; //camera frustum near and far clip planes
    /***end private fields***/

    /***private functions***/
    function addRenderer() {
        animate.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        animate.renderer.setSize( width, height );
        animate.renderer.setClearColor( 0x000000, 0.0 );
        container.appendChild( animate.renderer.domElement );
    }

    function addCamera () {
        animate.camera = new THREE.PerspectiveCamera( camFOV, width / height, camNear, camFar );
        animate.camera.position.set(0, 1000, 1500);
        main.loader.scene.add( animate.camera );
    }

    function addLight () {
        var ambientLight = new THREE.AmbientLight( 0xffffff );
        main.loader.scene.add( ambientLight );
    }
    /***end private functions***/

    /***public fields***/
    main.scene = undefined;
    main.loader = undefined;
    /***end public fields***/

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
        addLight();
    };
    /***end public functions***/

    return main;
});
