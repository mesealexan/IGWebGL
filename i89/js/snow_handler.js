var sh1 = new SnowHandler({posX: 0, posY:-200, width: 400, depth: 400, num: 500});
var sh2 = new SnowHandler({posX: 190, posY: 250, width: 100, depth: 500, num: 400});
var sh3 = new SnowHandler({posX: 0, posY: 600, width: 400, depth: 400, num: 500});

function SnowHandler (s){
    this.particleSystem = {};    
    this.deathCount = 0;
    var _this = this,
        numParticles = s.num,
        height = 800,
        systemGeometry = new THREE.Geometry(),
        flake = THREE.ImageUtils.loadTexture("media/snowflake.png"),
        systemMaterial = new THREE.PointCloudMaterial({ 
            blending: THREE.AdditiveBlending, 
            map: flake, size: 8, transparent: true }),
        clock = new THREE.Clock(),
        stopping = false;

    function randomInitialPositions (){
        for( var i = 0; i < numParticles; i++ ) {
            var vertex = new THREE.Vector3(
                rand( s.width ), Math.random() * height , rand( s.depth )
            );

            systemGeometry.vertices.push( vertex );
        }
        function rand(n) { return n * (Math.random() - 0.5) }
    }

    this.start = function (){
        updater.addHandler(this); 
        this.particleSystem.position.set(s.posX, 0, s.posY);
        scene.add( this.particleSystem );
    }

    this.stop = function () {
        stopping = true;
    }

    this.removeHandler = function () {
        updater.removeHandler(this);
    }

    this.update = function() {
        var geometry = this.particleSystem.geometry,
            vertices = geometry.vertices,
            numVertices = vertices.length,
            speedY = 5;

        var check = {
            stopping: function  () {
                return stopping;
            }
            ,
            remove: function () {
                if(_this.deathCount == numParticles)
                    _this.removeHandler();
            }
            ,
            death: function (v) {
                 if(!v.dead){ 
                    v.dead = true;
                    _this.deathCount++; 
                    return true;
                }
            }
        }

        for(var i = 0; i < numVertices; i++) {
            var v = vertices[i];
            if( !v.uniqueSpeed ) v.uniqueSpeed = Math.random() + 0.3;
            if( v.y > 0 ) 
                v.y -= speedY * v.uniqueSpeed;
            else onComplete(v);
        }

        geometry.verticesNeedUpdate = true;

        function onComplete (v) {
            if(check.stopping()){
                if (check.death(v)) return;
                check.remove();
                return;
            } 
            else v.y = height;
        }
    };

    randomInitialPositions();   
    this.particleSystem = new THREE.PointCloud( systemGeometry, systemMaterial );
}

