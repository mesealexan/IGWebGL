define(["underscore","i89"], function(underscore, i89){
    var scenes = {//all possible scenes
        i89:i89
    };

    var loader = function(scene, sceneID){//public functionality
        var _this = this;
        this.scene = scene;
        this.selectedScene = scenes[sceneID];
        this.LoadAssets(sceneID, this.selectedScene.assetNames);
    };

    loader.prototype.LoadAssets = function(folderName, assetNames){
        var _this = this;
        var index = 0;
        load(assetNames[index]);

        function load(name){
            var l = new THREE.JSONLoader();
            l.load("media/models/"+folderName+"/"+name+".js", loadCallback);
            l.onLoadComplete = onLoadComplete;
        }

        function loadCallback(geometry, materials){
            var mesh;
            _.each(materials, function(mat){
                //todo: setMaterials()
            });

            geometry.computeFaceNormals();
            geometry.computeVertexNormals();

            mesh = new THREE.Mesh( geometry, materials );
        }

        function onLoadComplete(){
            index++;
            if(index < assetNames.length){
                _this.scene.add(mesh);
                load(assetNames[index]);
            }
        }
    };

    return loader;
});