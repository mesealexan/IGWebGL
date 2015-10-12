define(["underscore", "cameraHandler", "materials", "i89", "LoE"],
    function(underscore, cameraHandler, materials, i89, LoE){
    var scenes = {//all possible scenes
        i89:i89,
        LoE:LoE
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

    var loader = function(scene, animationComponent){//public functionality
        this.scene = scene;
        var selectedScene = scenes[scene.sceneID];

        /***public functions***/
        (function OnStartScene (){
            //retrieve all functions in onStartFunctions object, then call each one
            var onStartFunctions = _.functions(selectedScene.onStartFunctions);
            _.each(onStartFunctions, function(fun){
                selectedScene.onStartFunctions[fun](scene);
            });
        }());

        this.OnFinishedLoadingAssets = function(){
            //camera movement and rendering started here
            var ch = this.cameraHandler;
            ch.play();
            //window.setTimeout(function(){ch.stop();}, 100);
            animationComponent.Animate();
        };

        this.ParseJSON = function(file){
            var request = new XMLHttpRequest();
            request.open("GET", file, false);
            request.send(null);
            return JSON.parse(request.responseText);
        };

        this.UnloadScene = function(){
            for (var i = this.scene.children.length - 1; i >= 0; i--)
                traverseChildren(this.scene.children[i], disposeObject);
        };

        this.LoadAssets(selectedScene);
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

        function loadCallback(geometry, mats){
            var assignedMats = [];
            _.each(mats, function(mat){
                assignedMats.push(materials.setMaterials(folderName, mat.name));
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

            if(nextAssetName != undefined)load(nextAssetName);//still has assets to load, go again
            else _this.OnFinishedLoadingAssets();//done loading assets
        }
    };
    /***end public functions***/

    return loader;
});