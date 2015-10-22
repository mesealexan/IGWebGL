define(["three", "underscore", "animate"], function(three, underscore, animate){
return function(s){
    var _this = this;
    this.width = s.width;
    this.height = s.height;
    this.depth = s.depth;
    this.particleCount = s.num;
    this.direction = s.dir;
    this.rotation = s.rot;
    this.holder = new THREE.Object3D();
    this.position = s.pos;
    this.speed = s.speed;
    this.randomInitialRot = s.rndRotInit;
    this.rndSizeVariation = s.rndSizeVariation;
    this.stopped = false;
    var geometry = undefined;

    function randomPos(){
        return new THREE.Vector3(
            _.random(-_this.width / 2, _this.width / 2),
            _.random(_this.height),
            _.random(-_this.depth / 2, _this.depth / 2)
        );
    }

    this.createPS = function(){
        var maps = [];
        var holder = new THREE.Object3D();
        var loops = s.mapNames.length;
        var individualCount = Math.round(this.particleCount / loops);

        _.each(s.mapNames, function(name){
            maps.push(THREE.ImageUtils.loadTexture( "media/particles/"+name+".png" ))
        });

        if(!_this.rndSizeVariation)//just one geom
        geometry = new THREE.PlaneBufferGeometry(s.size.w, s.size.h);

        for(var l = 0; l < loops; l++){
            var mat = new THREE.MeshLambertMaterial({
                map: maps[l],
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

    this.Init = function(scene){
        var ps = this.createPS();
        if(s.pos)ps.position.copy(_this.position);
        animate.updater.addHandler(this);
        scene.add(ps);
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