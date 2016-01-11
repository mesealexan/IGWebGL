var GlobalFunctions = {};
define(["three", "jquery", "loader", "animate", "tween", "events", "audio", "materials", "physi", "aeTween", "degradation"],
    function(THREE, jquery, loader, animate, tween, events, audio, materials, physi, aeTween, degradation){
    var main = {}; //public functionality
    /***private fields***/
    var version = 3;
    var camFOV =  45; //camera field of view in degrees
    var width, height; //browser window dimension
    var camNear = 1, camFar = 17000; //camera frustum near and far clip planes

    /***private functions***/
    function reportVersion(){
      console.info("Cardinal BETA v" + version);
    }

    function addRenderer() {
        animate.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false,
            logarithmicDepthBuffer: false});
        animate.renderer.autoClear = false;
        animate.renderer.setSize( width, height );
        animate.renderer.setClearColor( 0x000000, 1 );
        animate.renderer.shadowMapType = THREE.PCFShadowMap;
        animate.container.appendChild( animate.renderer.domElement );
    }

    function addCamera () {
        animate.camera = new THREE.PerspectiveCamera( camFOV, width / height, camNear, camFar );
        animate.camera.position.set(0, 0, 0);
        return animate.camera;
    }

    function getMediaFolderURL() { return $('mediafolder').data("url"); }

    function setBackground(containerID, mediaFolderUrl) {
      $('#'+containerID).css('background', 'url('+mediaFolderUrl+'/images/bck.jpg) no-repeat center center fixed');
    }

    function addButtons() {
      main.buttons.fullscreen.add();
      main.buttons.loadCardinal.add();
      main.buttons.load_i89.add();
      main.buttons.loadLoE.add();
      main.buttons.loadNeat.add();
      main.buttons.loadSound.add();
      main.buttons.loadTornado.add();
      //main.buttons.loadDevScene.add();
    }
    /***end private functions***/

    /***public fields***/
    main.scene = undefined;
    main.loader = undefined;

    /***public functions***/
    main.Start = function(containerID, sceneID){
        reportVersion();
        //check webGL compatibility
        if(!degradation.webgl_detect({id: containerID})) return;
        //entry point (first function called by require in app.js)
        loader.LoadingScreen.add();
        width = $('#'+containerID).width();
        height = $('#'+containerID).height();
        animate.renderSize = {width: width, height: height};
        animate.container = document.getElementById( containerID );
        animate.containerID = containerID;
        addRenderer();
        main.mediaFolderUrl = getMediaFolderURL();
        main.scene = new Physijs.Scene({mediaFolderUrl: main.mediaFolderUrl});
        main.scene.sceneID = sceneID;
        setBackground(containerID, main.mediaFolderUrl);
        materials.makeTextureCube(main.mediaFolderUrl);
        materials.makeCloudTextureCube(main.mediaFolderUrl);
        animate.loader = main.loader = new loader(main.scene, animate, main.mediaFolderUrl, addCamera());
        animate.StartWindowAutoResize();
        animate.SetDefaultRenderFunction();
        addButtons();
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
            //main.scene = new Physijs.Scene({mediaFolderUrl: main.mediaFolderUrl});
            main.scene.sceneID = sceneID;
            main.loader = new loader(main.scene, animate, getMediaFolderURL(), addCamera());
            animate.loader = main.loader;
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
        loadTornado:{
            add: function(){
                events.AddButton({text:"load tornado", function: function(){
                    main.LoadNewScene("tornado")}, id:"loadTornado", parent:"loadButtons"
                });
            }
        },
        loadDevScene:{
            add: function(){
                events.AddButton({text:"load dev", function: function(){
                    main.LoadNewScene("devScene")}, id:"loadDevScene", parent:"loadButtons"
                });
            }
        },
        fullscreen:{
            add: function(){
                events.AddButton({text:"fullscreen", function: function(){
                    animate.Fullscreen()}, id:"fullscreen", parent:"loadButtons", id: "fullscreen"
                });
            }
        }
    };

    return main;
});
