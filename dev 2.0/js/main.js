var GlobalFunctions = {};
define(["three", "jquery", "loader", "animate", "tween", "events", "audio", "materials"],
    function(THREE, jquery, loader, animate, tween, events, audio, materials){
    var main = {}; //public functionality
    /***private fields***/
    var camFOV =  45; //camera field of view in degrees
    var width, height; //browser window dimension
    var camNear = 1, camFar = 17000; //camera frustum near and far clip planes

    /***private functions***/
    function addRenderer() {
        animate.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true,
            logarithmicDepthBuffer: false});
        animate.renderer.setSize( width, height );
        animate.renderer.setClearColor( 0x000000, 0 );
        animate.renderer.shadowMapType = THREE.PCFShadowMap;
        animate.container.appendChild( animate.renderer.domElement );
    }

    function addCamera () {
        animate.camera = new THREE.PerspectiveCamera( camFOV, width / height, camNear, camFar );
        animate.camera.position.set(0, 0, 0);
        main.loader.scene.add( animate.camera );
    }

    function getMediaFolderURL() { return $('mediafolder').data("url"); }

    function setBackground(containerID, mediaFolderUrl) {
      $('#'+containerID).css('background', 'url('+mediaFolderUrl+'/images/bck.jpg) no-repeat center center fixed');
    }
    /***end private functions***/

    /***public fields***/
    main.scene = undefined;
    main.loader = undefined;

    /***public functions***/
    main.Start = function(containerID, sceneID){
        //entry point (first function called by require in app.js)
        loader.LoadingScreen.add();
        width = $('#'+containerID).width();
        height = $('#'+containerID).height();
        animate.container = document.getElementById( containerID );
        main.scene = new THREE.Scene();
        main.scene.sceneID = sceneID;
        var mediaFolderUrl = getMediaFolderURL();
        setBackground(containerID, mediaFolderUrl);
        materials.makeTextureCube(mediaFolderUrl);
        materials.makeCloudTextureCube(mediaFolderUrl);
        main.loader = new loader(main.scene, animate, mediaFolderUrl);
        animate.loader = main.loader;
        animate.StartWindowAutoResize();
        addRenderer();
        addCamera();
        main.buttons.loadCardinal.add();
        main.buttons.load_i89.add();
        main.buttons.loadLoE.add();
        main.buttons.loadNeat.add();
        main.buttons.loadSound.add();
        main.buttons.loadPreserve.add();
        //because they are unique, lights are added by each scene's individual file
    };

    main.LoadNewScene = function(sceneID){
        //only call after Start()
        if(main.loader.loadingScene) return;
        loader.LoadingScreen.show();
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
            main.loader = new loader(main.scene, animate, getMediaFolderURL());
            animate.loader = main.loader;
            addCamera();
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
        },
        loadSound:{
            add: function(){
                events.AddButton({text:"load sound", function: function(){
                    main.LoadNewScene("sound")}, id:"loadSound", parent:"loadButtons"
                });
            }
        },
        loadPreserve:{
            add: function(){
                events.AddButton({text:"load preserve", function: function(){
                    main.LoadNewScene("preserve")}, id:"loadPreserve", parent:"loadButtons"
                });
            }
        }
    };

    return main;
});
