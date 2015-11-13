define(["three", "underscore", "animate"], function(three, underscore, animate){
return function(s){
    var _this = this;
    this.width = s.width;
    this.height = s.height;
    this.depth = s.depth;
    this.particleCount = s.num;
    this.direction = s.dir;
    this.rotation = s.rot;
    this.scene = undefined;
    this.holder = new THREE.Object3D();
    this.position = s.pos;
    this.speed = s.speed;
    this.randomInitialRot = s.rndRotInit;
    this.rndSizeVariation = s.rndSizeVariation;
    this.stopped = false;
    this.mapNames = s.mapNames;
    this.loadedMaps = [];
    this.meshes = s.meshes;
    this.created = false;
    this.mediaFolderUrl = animate.loader.mediaFolderUrl;
    var geometry = undefined;

    function randomPos(){
      return new THREE.Vector3(
        _.random(-_this.width / 2, _this.width / 2),
        _.random(_this.height),
        _.random(-_this.depth / 2, _this.depth / 2)
      );
    }

    function loadMap(i) {
      if(i == _this.mapNames.length){ addToScene_Sprites(); return; }//done loading maps

      var url = _this.mediaFolderUrl+"/particles/"+_this.mapNames[i]+".png";
      var map = THREE.ImageUtils.loadTexture(url, undefined, onLoadComplete);

      function onLoadComplete(tex) {
        _this.loadedMaps.push(tex);
        i++;
        loadMap(i);
      }
    }

    function addToScene_Sprites() {
      var ps = _this.createPS_Sprites();
      if(s.pos)ps.position.copy(_this.position);
      _this.scene.add(ps);
      _this.created = true;
      animate.updater.addHandler(_this);
    }

    function addToScene_Meshes() {
      var ps = _this.createPS_Meshes();
      if(s.pos)ps.position.copy(_this.position);
      _this.scene.add(ps);
      _this.created = true;
      animate.updater.addHandler(_this);
    }

    this.createPS_Sprites = function(){
      var loops = _this.loadedMaps.length;
      var individualCount = Math.round(this.particleCount / loops);

      if(!_this.rndSizeVariation)//just one geom
      geometry = new THREE.PlaneBufferGeometry(s.size.w, s.size.h);
      for(var l = 0; l < loops; l++){
        var mat = new THREE.MeshLambertMaterial({
          map: _this.loadedMaps[l],
          transparent: true,
          side: THREE.DoubleSide
        });

        for(var i = 0; i < individualCount; i++) {
          if(_this.rndSizeVariation){
            var rndSize = _.random(_this.rndSizeVariation) + 0.1;
            geometry = new THREE.PlaneBufferGeometry(
                s.size.w + s.size.w * rndSize,
                s.size.h + s.size.h * rndSize);
          }
          var pos = randomPos();
          var particlePlane = new THREE.Mesh(geometry.clone(), mat);
          particlePlane.initialPos = pos;
          particlePlane.minY = _this.position.y - (_this.height / 2);
          particlePlane.maxY = _this.position.y + (_this.height / 2);
          particlePlane.position.copy(pos);

          if(_this.randomInitialRot) particlePlane.rotation.set(
            _.random(Math.PI * 2),
            _.random(Math.PI * 2),
            _.random(Math.PI * 2));
          else particlePlane.rotation.set(0, 0, _this.direction.x);

          _this.holder.add(particlePlane);
        }
      }
      return _this.holder;
    };

    this.createPS_Meshes = function () {
      for (var i = 0; i < this.particleCount; i++) {
        var mesh = this.meshes[0].clone();
        var pos = randomPos();
        mesh.initialPos = pos;
        mesh.minY = _this.position.y - (_this.height / 2);
        mesh.maxY = _this.position.y + (_this.height / 2);
        mesh.position.copy(pos);
        _this.holder.add(mesh);
      }
      return _this.holder;
    }

    this.Init = function(scene){
        if(_this.created){ _this.Start(); return; }
        _this.scene = scene;
        if(!_this.meshes) loadMap(0);
        else addToScene_Meshes();
    };

    this.Start = function(){
        _this.stopped = false;
    };

    this.Stop = function(){
        _this.stopped = true;
    };

    this.update = function(){
        _.each(_this.holder.children, function(child){
            /***start/stop***/
            if(child.stopped && _this.stopped) return;
            else if (child.stopped && !_this.stopped){
                child.stopped = false;
                child.visible = true;
                var restPos = randomPos();
                child.position.set(
                    restPos.x,
                    _.random(child.maxY, child.maxY * 2),
                    restPos.z
                );
            }
            /***start/stop***/

            child.position.add(_this.direction.clone().multiplyScalar(_this.speed));
            if(child.position.y < child.minY)
            {
                var pos = randomPos();
                child.position.set(
                    pos.x,
                    _.random(child.maxY - child.maxY * 0.1, child.maxY + child.maxY * 0.1),
                    pos.z
                );
                if(_this.stopped){
                    child.visible = false;
                    child.stopped = true;
                }
            }
            if(!_this.rotation) return;
            child.rotation.x += _this.rotation.x;
            child.rotation.y += _this.rotation.y;
            child.rotation.z += _this.rotation.z;
        });
    };
}
});
