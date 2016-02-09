define([ "scene", /*"jquery",*/ "underscore", "cameraHandler", "materials", "animate", "i89", "LoE", "cardinal",
  "neat", "sound", "events", "audio", "watch", "tornado", "devScene", "camPan"],
function(_scene, /*jquery,*/ underscore, cameraHandler, materials, animate, i89, LoE, cardinal, neat,
  sound, events, audio, watch, tornado, devScene, camPan ) {

    var scenes = {
        i89: i89,
        loe: LoE,
        ig: cardinal,
        neat: neat,
        //sound: sound, // disabled
        seastorm: tornado,
        //devScene: devScene
    };

    function disposeObject (obj, skipMat) {
        //.dispose() removes the object (geometry, material and/or texture) from memory
        if( obj.geometry ) obj.geometry.dispose(); //has geometry
        if( obj.material ) { //has material
            if( obj.material instanceof THREE.MeshFaceMaterial )
              for ( var j = obj.material.materials.length - 1; j >= 0; j-- )
                disposeMaterial(obj.material.materials[j], skipMat);
            else // has one material
              disposeMaterial(obj.material, skipMat);
        }
        if(obj.parent) obj.parent.remove(obj);
        obj = undefined;

        function disposeMaterial(mtrl, skip) {
          var matProps = [ "map", "lightMap", "bumpMap", "normalMap", "specularMap" ];
          if(skip && skip.all) return;
          _.each(matProps, function (p) {
            if(skip && _.has(skip, p)) return;
            if(mtrl[p]) mtrl[p].dispose();
          });
          mtrl.dispose();
          mtrl = undefined;
        }
    }

    function traverseChildren ( obj, fun ) {
      //also calls a function provided as an argument for all children
      if(obj.children.length > 0)
          for (var i = obj.children.length - 1; i >= 0; i--)
              traverseChildren(obj.children[i], fun);
      fun(obj);
    }

    function getLoadingPercentage ( l ) {
      var curAssetNo = l.assetIndex;
      var totalAssets = l.totalAssets;
      return ( Math.round( ((curAssetNo + audio.audioArrIndex) / totalAssets) * 100 ));
    }

    function changeURL ( id ) {
      var curURL = String(window.location.href);
      history.pushState( {}, "", "#" + id);
    }

    var loader = function( scene, animationComponent, mediaFolderUrl, camera ) {//public functionality
      var _this = this;
      animate.ClearPanTimeout();
      animate.ClearLowPowerTimeout();
      animationComponent.cPan = new camPan( animationComponent );
      this.scenes = scenes;
      if ( !this.scenes[scene.sceneID] ) scene.sceneID = "ig";
      this.loadingScene = true;
      this.scene = scene;
      this.animationComponent = animationComponent;
      this.animationComponent.loader = this;
      this.DisposeObject = disposeObject;
      this.sceneID = scene.sceneID.toLowerCase();
      this.onLoadProgressFunctions = _.functions( this.animationComponent.onLoadProgress );
      this.selectedScene = scenes[this.sceneID].scene = new scenes[this.sceneID].constructor();

      this.mediaFolderUrl =
      materials.mediaFolderUrl =
      this.selectedScene.mediaFolderUrl =
      mediaFolderUrl;

      scene.add(camera);

      //check custom url
      ( scenes[this.sceneID].url ) ? changeURL( scenes[this.sceneID].url ) : changeURL( this.sceneID );

      (function OnStartScene (){
        //retrieve all functions in onStartFunctions object, then call each one
        var onStartFunctions = _.functions(_this.selectedScene.onStartFunctions);
        _.each(onStartFunctions, function(fun){
            _this.selectedScene.onStartFunctions[fun](scene, _this);
        });
      }());

      /***public functions***/
      this.RandomNum = function( min, max ) {
      	return Math.floor( Math.random() * (max - min + 1 ) + min );
      };

      this.OnFinishedLoadingAssets = function(){
        var onFinishLoadFunctions = _.functions( _this.selectedScene.onFinishLoadFunctions );
        _.each(onFinishLoadFunctions, function( fun ) {
            _this.selectedScene.onFinishLoadFunctions[ fun ] ( scene, _this );
        });

        animationComponent.composer = _this.selectedScene.assets.composer;
        animationComponent.ResizeWindow();
        _this.LoadingScreen.hide();
        _this.loadingScene = false;
      };

      this.LoadingScreen = {
        add: function () {
            $( "#" + animate.containerID ).append( '<div class="loader"></div>' );
            $( "#" + animate.containerID ).append( '<h1 id="loadingText">loading</h1>' );
        },
        show: function () {
            animate.renderer.clear();
            $( '#loadingText' ).text( "0%" );
            $( '.loader, #loadingText' ).show();
        },
        hide: function () {
            $( '.loader, #loadingText' ).hide();
        },
        update: function ( percent ) {
            $( '#loadingText' ).text( percent + "%" );
        }
      };

      this.LowPowerScreen = {
        add: function () {
            $( "#" + animate.containerID ).append( '<div id="lowPower"></div>' );
            $( "#lowPower" ).append( '<p id="lowPowerText">User inactive. Click to resume.</p>' );
        },
        show: function () {
            $( '#lowPower, #lowPowerText' ).show();
        },
        hide: function () {
            $( '#lowPower, #lowPowerText' ).hide();
        },
      }

      this.ParseJSON = function ( file ) {
        var request = new XMLHttpRequest();
        request.open("GET", file, false);
        request.send(null);
        if(request.responseURL != "") return JSON.parse(request.responseText);
        else return false;
      };

      this.UnloadScene = function ( onComplete ) {
        this.animationComponent.SetDefaultRenderFunction();
        var onUnloadFunctions = _.functions(_this.selectedScene.onUnloadFunctions);

        _.each(onUnloadFunctions, function(fun){
            _this.selectedScene.onUnloadFunctions[fun](scene, _this);
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

      this.OnLoadProgress = function () {
        _.each(_this.onLoadProgressFunctions, function(fun){
          var percent = getLoadingPercentage(_this);
          _this.LoadingScreen.update( percent );
          _this.animationComponent.onLoadProgress [fun] (percent, _this) ;
        });
      }

      function dereference ( scene ) {
        var props = (Object.keys(scene));

        _.each(props, function(p){
          if (scene.hasOwnProperty(p))
            scene[p] = null;
        });
      }

      this.LoadAssets( _this.selectedScene );
    };

    loader.prototype.LoadAssets = function ( selectedScene ) {
      var _this = this,
          mesh = undefined,
          folderName = this.selectedScene.folderName,
          assetNames = this.selectedScene.assetNames,
          soundNames = this.selectedScene.soundNames,
          nextAsset = undefined;

      this.assetIndex = 0;
      this.totalAssets = assetNames.length + soundNames.length;

      // camera handler
      var cameraJSON = this.ParseJSON( _this.mediaFolderUrl+"/cameras/"+folderName+"/camera.JSON" );
      if( cameraJSON != false ) this.cameraHandler = new cameraHandler( cameraJSON );

      // check if no assets exist
      if( assetNames == undefined || assetNames.length == 0){ loadSounds(); return; };
      // load next asset if it exists
      if( ( nextAsset = assetNames[_this.assetIndex] ) !== undefined ) load ( nextAsset );

      function load(name){
          var loader = new THREE.JSONLoader();
          loader.load( _this.mediaFolderUrl + "/models/" + folderName + "/" + name + ".js", loadCallback);
          loader.onLoadComplete = onLoadComplete;
      }

      function loadCallback( geometry, mats ) {
        var assignedMats = [];
        _.each( mats, function ( mat ) {
            assignedMats.push( materials.setMaterials( folderName, mat ) );
        });

        geometry.computeFaceNormals();
        geometry.computeVertexNormals();

        var faceMaterial = new THREE.MeshFaceMaterial( assignedMats );

        if( geometry.morphTargets.length > 0 )
            mesh = new THREE.SkinnedMesh( geometry, faceMaterial );//animated mesh
        else mesh = new THREE.Mesh( geometry, faceMaterial );//non-animated mesh
      }

      function onLoadComplete(){
        var curAssetName = assetNames[_this.assetIndex];
        var nextAssetName = assetNames[++_this.assetIndex];

        //function associated to current mesh, called for features such as positioning
        _this.scene.add(mesh);
        var onCompleteFunction = _this.selectedScene.onLoadFunctions[curAssetName];
        if(onCompleteFunction)onCompleteFunction(mesh, _this);//pass the mesh and instance of loader
        _this.OnLoadProgress();
        //still has assets to load, go again
        if( nextAssetName !== undefined ) {
          load( nextAssetName );
          return;
        }
        //done loading assets, load sounds
        loadSounds();
      }

      function loadSounds(){
          //call on load complete on all sounds loaded
          audio.LoadAll(soundNames, _this);
      }
    };

    /***end public functions***/

    return loader;
});
