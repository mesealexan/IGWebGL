define(["underscore", "cameraHandler", "i89", "LoE"],
    function(underscore, cameraHandler, i89, LoE){
    var scenes = {//all possible scenes
        i89:i89,
        LoE:LoE
    };

    var loader = function(scene, animationComponent){//public functionality
        var _this = this;
        this.scene = scene;

        /***public functions***/
        this.OnFinishedLoadingAssets = function(){
            this.cameraHandler.play();
            animationComponent.Animate();
        };

        this.ParseJSON = function(file){
            var request = new XMLHttpRequest();
            request.open("GET", file, false);
            request.send(null);
            return JSON.parse(request.responseText);
        };

        this.LoadAssets(scenes[scene.sceneID]);
    };

    loader.prototype.LoadAssets = function(selectedScene){
        var _this = this;
        var mesh = undefined;
        var assetIndex = 0;
        var folderName = selectedScene.folderName;
        var assetNames = selectedScene.assetNames;
        /***camera handler***/
        var cameraJSON = this.ParseJSON("media/cameras/"+folderName+"/camera.JSON");
        this.cameraHandler = new cameraHandler(cameraJSON);

        load(assetNames[assetIndex]);

        function load(name){
            var l = new THREE.JSONLoader();
            l.load("media/models/"+folderName+"/"+name+".js", loadCallback);
            l.onLoadComplete = onLoadComplete;
        }

        function loadCallback(geometry, materials){
            _.each(materials, function(mat){
                //todo: setMaterials()
            });

            geometry.computeFaceNormals();
            geometry.computeVertexNormals();

            if(geometry.morphTargets.length > 0)
                mesh = new THREE.SkinnedMesh( geometry );//animated mesh
            else mesh = new THREE.Mesh( geometry );//non-animated mesh
        }

        function onLoadComplete(){
            var curAssetName = assetNames[assetIndex];
            //function associated to current mesh, called for special features such as positioning
            var onCompleteFunction = selectedScene.loadFunctions[curAssetName];
            if(onCompleteFunction)onCompleteFunction(mesh);

            if(++assetIndex < assetNames.length){//still has assets to load
                var nextAssetName = assetNames[assetIndex];
                _this.scene.add(mesh);
                load(nextAssetName);
            } else _this.OnFinishedLoadingAssets();//done loading assets
        }
    };
    /***end public functions***/

    return loader;
});