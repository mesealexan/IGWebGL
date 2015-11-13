define(["underscore", "cameraHandler", "materials", "i89", "LoE", "cardinal", "neat", "events", "audio"],
function(underscore, cameraHandler, materials, i89, LoE, cardinal, neat, events, audio){
    var scenes = {//all possible scenes
        i89:i89,
        LoE:LoE,
        cardinal:cardinal,
        neat: neat
    };

    function disposeObject (obj) {
        //.dispose() removes the object (geometry, material and/or texture) from memory
        if(obj.geometry) obj.geometry.dispose();
        if(obj.material){
            if(obj.material.materials)
                for (var j = obj.material.materials.length - 1; j >= 0; j--)
                    obj.material.materials[j].dispose();
            else obj.material.dispose();
        }
        obj.parent.remove(obj);
    }

    function traverseChildren (obj, fun) {
        //also calls a function provided as an argument for all children
        if(obj.children.length > 0){
            for (var i = obj.children.length - 1; i >= 0; i--)
                traverseChildren(obj.children[i], fun);
        }
        fun(obj);
    }

    function checkCameraAnimationState(l, animationComponent){
        if(!l.cameraHandler.started)l.cameraHandler.play(
            undefined,undefined,undefined,//from, to and onComplete undefined
            animationComponent.Animate);
        loader.LoadingScreen.hide();
    }

    var loader = function(scene, animationComponent, mediaFolderUrl){//public functionality
        var _this = this;
        this.scene = scene;
        var selectedScene = scenes[scene.sceneID];

        this.mediaFolderUrl =
        selectedScene.mediaFolderUrl =
        materials.mediaFolderUrl =
        mediaFolderUrl;

        /***public functions***/
        (function OnStartScene (){
            //retrieve all functions in onStartFunctions object, then call each one
            var onStartFunctions = _.functions(selectedScene.onStartFunctions);
            _.each(onStartFunctions, function(fun){
                selectedScene.onStartFunctions[fun](scene, _this);
            });
        }());

        this.OnFinishedLoadingAssets = function(){
            var onFinishLoadFunctions = _.functions(selectedScene.onFinishLoadFunctions);
            _.each(onFinishLoadFunctions, function(fun){
                selectedScene.onFinishLoadFunctions[fun](scene, _this);
            });
            checkCameraAnimationState(_this, animationComponent);
        };

        this.ParseJSON = function(file){
            var request = new XMLHttpRequest();
            request.open("GET", file, false);
            request.send(null);
            return JSON.parse(request.responseText);
        };

        this.UnloadScene = function(onComplete){
            var onUnloadFunctions = _.functions(selectedScene.onUnloadFunctions);

            _.each(onUnloadFunctions, function(fun){
                selectedScene.onUnloadFunctions[fun](scene, _this);
            });


            for (var i = this.scene.children.length - 1; i >= 0; i--)
                traverseChildren(this.scene.children[i], disposeObject);
            onComplete();
        };

        this.LoadAssets(selectedScene);
    };

    loader.prototype.LoadAssets = function(selectedScene){
        var _this = this;
        var mesh = undefined;
        var assetIndex = 0;
        var folderName = selectedScene.folderName;
        var assetNames = selectedScene.assetNames;
        var soundNames = selectedScene.soundNames;

        /***camera handler***/
        var cameraJSON = this.ParseJSON(_this.mediaFolderUrl+"/cameras/"+folderName+"/camera.JSON");
        this.cameraHandler = new cameraHandler(cameraJSON);

        load(assetNames[assetIndex]);

        function load(name){
            var l = new THREE.JSONLoader();
            l.load(_this.mediaFolderUrl+"/models/"+folderName+"/"+name+".js", loadCallback);
            l.onLoadComplete = onLoadComplete;
        }

        function loadCallback(geometry, mats){
            var assignedMats = [];
            _.each(mats, function(mat){
                assignedMats.push(materials.setMaterials(folderName, mat));
            });

            geometry.computeFaceNormals();
            geometry.computeVertexNormals();

            var faceMaterial = new THREE.MeshFaceMaterial( assignedMats );

            if(geometry.morphTargets.length > 0)
                mesh = new THREE.SkinnedMesh( geometry, faceMaterial );//animated mesh
            else mesh = new THREE.Mesh( geometry, faceMaterial );//non-animated mesh
        }

        function onLoadComplete(){
            var curAssetName = assetNames[assetIndex];
            //function associated to current mesh, called for features such as positioning
            var onCompleteFunction = selectedScene.onLoadFunctions[curAssetName];
            if(onCompleteFunction)onCompleteFunction(mesh, _this);//pass the mesh and instance of loader

            var nextAssetName = assetNames[++assetIndex];
            _this.scene.add(mesh);

            if(nextAssetName != undefined){//still has assets to load, go again
                load(nextAssetName);
                return;
            }
            loadSounds();//done loading assets, load sounds
        }

        function loadSounds(){
            audio.LoadAll(soundNames, _this.OnFinishedLoadingAssets, _this.mediaFolderUrl);//call on load complete on all sounds loaded
        }
    };

    loader.LoadingScreen = {
        add: function(){
            $('body').append('<div class="loader"></div>');
            $('.loader').append('<h1 id="loadingText">loading</h1>');
        },
        show: function(){
            $('#webGL').hide();
            $('.loader').show();
        },
        hide: function(){
            $('#webGL').show();
            $('.loader').hide();
        }
    };
    /***end public functions***/

    return loader;
});
