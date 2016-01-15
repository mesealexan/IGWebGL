define(["scene", /*"jquery",*/ "underscore", "cameraHandler", "materials", "animate", "i89", "LoE", "cardinal", "neat", "sound", "events",
"audio", "watch", "tornado", "devScene"],
function(_scene, /*jquery,*/ underscore, cameraHandler, materials, animate, i89, LoE, cardinal, neat, sound, events,
  audio, watch, tornado, devScene){

    var scenes = { //all possible scenes
        i89: i89,
        LoE: LoE,
        cardinal: cardinal,
        neat: neat,
        sound: sound,
        tornado: tornado,
        devScene: devScene
    };

    var matProps = ['map', 'lightMap', 'bumpMap', 'normalMap', 'specularMap'/*, 'envMap'*/];

    function disposeObject (obj, skipMat) {
        //.dispose() removes the object (geometry, material and/or texture) from memory
        if(obj.geometry) obj.geometry.dispose(); //has geometry
        if(obj.material){ //has material
            if(obj.material instanceof THREE.MeshFaceMaterial)
              for (var j = obj.material.materials.length - 1; j >= 0; j--)
                disposeMaterial(obj.material.materials[j], skipMat);
            else // has one material
              disposeMaterial(obj.material, skipMat);
        }
        if(obj.parent) obj.parent.remove(obj);
        obj = undefined;

        function disposeMaterial(mtrl, skip) {
          if(skip && skip.all) return;
          _.each(matProps, function (p) {
            if(skip && _.has(skip, p)) return;
            if(mtrl[p]) mtrl[p].dispose();
          });
          mtrl.dispose();
          mtrl = undefined;
        }
    }

    function traverseChildren (obj, fun) {
      //also calls a function provided as an argument for all children
      if(obj.children.length > 0)
          for (var i = obj.children.length - 1; i >= 0; i--)
              traverseChildren(obj.children[i], fun);
      fun(obj);
    }

    function checkCameraAnimationState(l, animationComponent){
      if(l.cameraHandler && !l.cameraHandler.started)
        l.cameraHandler.play(
          undefined,undefined,undefined,//from, to and onComplete undefined
          animationComponent.Animate
        );
      else if(!l.cameraHandler) animationComponent.Animate();
      loader.LoadingScreen.hide();
    }

    var loader = function(scene, animationComponent, mediaFolderUrl, camera){//public functionality
        var _this = this;
        this.loadingScene = true;
        this.scene = scene;
        this.animationComponent = animationComponent;
        this.animationComponent.loader = this;
        this.DisposeObject = disposeObject;
        this.sceneID = scene.sceneID;


        var selectedScene = scenes[this.sceneID].scene = new scenes[this.sceneID].constructor();


        this.mediaFolderUrl =
        selectedScene.mediaFolderUrl =
        materials.mediaFolderUrl =
        mediaFolderUrl;

        scene.add(camera);


        (function OnStartScene (){
          //retrieve all functions in onStartFunctions object, then call each one
          var onStartFunctions = _.functions(selectedScene.onStartFunctions);
          _.each(onStartFunctions, function(fun){
              selectedScene.onStartFunctions[fun](scene, _this);
          });
        }());

        /***public functions***/
        this.OnFinishedLoadingAssets = function(){
          var onFinishLoadFunctions = _.functions(selectedScene.onFinishLoadFunctions);
          _.each(onFinishLoadFunctions, function(fun){
              selectedScene.onFinishLoadFunctions[fun](scene, _this);
          });
          //checkCameraAnimationState(_this, animationComponent);
          //animationComponent.Animate();
          animationComponent.ResizeWindow();
          loader.LoadingScreen.hide();
          _this.loadingScene = false;
        };

        this.ParseJSON = function(file){
          var request = new XMLHttpRequest();
          request.open("GET", file, false);
          request.send(null);
          if(request.responseURL != "") return JSON.parse(request.responseText);
          else return false;
        };

        this.UnloadScene = function(onComplete){
          this.animationComponent.SetDefaultRenderFunction();
          var onUnloadFunctions = _.functions(selectedScene.onUnloadFunctions);

          _.each(onUnloadFunctions, function(fun){
              selectedScene.onUnloadFunctions[fun](scene, _this);
          });


          for (var i = this.scene.children.length - 1; i >= 0; i--){
            traverseChildren(this.scene.children[i], disposeObject);
            if(i == 0){
              onComplete();
              //dereference(scenes[_this.sceneID]);
              scenes[this.sceneID].scene = null;
            }
          }
        };

        function dereference(scene) {
          var props = (Object.keys(scene));

          _.each(props, function(p){
            if (scene.hasOwnProperty(p))
              scene[p] = null;
          });
        }

        this.LoadAssets(selectedScene);
    };

    loader.prototype.LoadAssets = function(selectedScene){
        var _this = this,
            mesh = undefined,
            assetIndex = 0,
            folderName = selectedScene.folderName,
            assetNames = selectedScene.assetNames,
            soundNames = selectedScene.soundNames,
            nextAsset = undefined;

        //camera handler
        var cameraJSON = this.ParseJSON(_this.mediaFolderUrl+"/cameras/"+folderName+"/camera.JSON");
        if(cameraJSON != false) this.cameraHandler = new cameraHandler(cameraJSON);

        //check if no assets exist
        if(assetNames == undefined || assetNames.length == 0){ loadSounds(); return; };
        //load next asset if it exists
        if((nextAsset = assetNames[assetIndex]) !== undefined) load(nextAsset);

        function load(name){
            var loader = new THREE.JSONLoader();
            loader.load(_this.mediaFolderUrl+"/models/"+folderName+"/"+name+".js", loadCallback);
            loader.onLoadComplete = onLoadComplete;
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
          var nextAssetName = assetNames[++assetIndex];

          //function associated to current mesh, called for features such as positioning
          _this.scene.add(mesh);
          var onCompleteFunction = selectedScene.onLoadFunctions[curAssetName];
          if(onCompleteFunction)onCompleteFunction(mesh, _this);//pass the mesh and instance of loader

          //still has assets to load, go again
          if(nextAssetName !== undefined){ load(nextAssetName); return; }
          //done loading assets, load sounds
          loadSounds();
        }

        function loadSounds(){
            //call on load complete on all sounds loaded
            audio.LoadAll(soundNames, _this.OnFinishedLoadingAssets, _this.mediaFolderUrl);
        }
    };

    loader.LoadingScreen = {
        add: function(){
            $('body').append('<div class="loader"></div>');
            $('.loader').append('<h1 id="loadingText">loading</h1>');
        },
        show: function(){
            animate.renderer.clear()
            $('.loader').show();
        },
        hide: function(){
            $('.loader').hide();
        }
    };
    /***end public functions***/

    return loader;
});
