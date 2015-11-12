define(["animate", "three"], function(animate, THREE){
    function snowHandler (s){
        this.particleSystem = {};
        this.deathCount = 0;
        this.handlerType = "snowHandler";

        var _this = this,
            numParticles = s.num,
            height = 1000,
            systemGeometry = new THREE.Geometry(),
            flake = THREE.ImageUtils.loadTexture(animate.loader.mediaFolderUrl+"/models/i89/snowflake.png"),
            systemMaterial = new THREE.PointCloudMaterial({
                blending: THREE.AdditiveBlending,
                map: flake,
                size: 12,
                transparent: true
            }),
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

        this.start = function (scene){
            animate.updater.addHandler(this);
            this.particleSystem.position.set(s.posX, 0, s.posY);
            scene.add( this.particleSystem );
        };

        this.stop = function () {
            stopping = true;
        };

        this.removeHandler = function () {
            animate.updater.removeHandler(this);
        };

        this.update = function() {
            var geometry = this.particleSystem.geometry,
                vertices = geometry.vertices,
                numVertices = vertices.length,
                speedY = 2;

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
            };

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
                }
                else v.y = height;
            }
        };

        randomInitialPositions();
        this.particleSystem = new THREE.PointCloud( systemGeometry, systemMaterial );

        /*var width = s.width,
            height = 1000,
            depth = s.depth,
            particleCount = s.num,
            geometry = new THREE.Geometry();

        for(var i = 0; i < particleCount; i++) {
            var vertex = new THREE.Vector3(
                _.random(-width / 2, width / 2),
                _.random(height),
                _.random(-depth / 2, depth / 2)
            );
            geometry.vertices.push(vertex);
        }

        this.start = function (scene){
            var snow = new THREE.PointCloud(geometry, new SnowShader());
            snow.position.set(s.posX, 0, s.posY);
            animate.updater.addHandler(snow.material);
            scene.add( snow );
        };

        SnowShader.prototype = new THREE.ShaderMaterial();
        function SnowShader(){
            var snowflake = THREE.ImageUtils.loadTexture( "media/models/i89/snowflake.png" );
            var speed = 1.6;

            this.uniforms = {
                texture: { type: 't', value: snowflake },
                height: { type: 'f', value: 1000 },
                color: {type: 'c', value: new THREE.Color(0xffffff)},
                time: { type: 'f', value: 0 }
            };

            this.vertexShader = vSh();
            this.fragmentShader = fSh();
            this.blending = THREE.AdditiveBlending;
            this.transparent = true;
            //this.depthTest = false;
            this.update = function(){ this.uniforms.time.value += speed; };


            function vSh(){
                return[
                    "uniform float height;",
                    "uniform float time;",

                    "void main() {",
                    "vec3 pos = position;",
                    "pos.y = mod(pos.y - time, height);",
                    "gl_PointSize = 3.0;",
                    "gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );}"
                ].join('\n');
            }

            function fSh(){
                return[
                    "uniform vec3 color;",
                    "uniform sampler2D texture;",

                    "void main() {",
                    "vec4 texColor = texture2D( texture, gl_PointCoord);",
                    "gl_FragColor = texColor * vec4(color, 1.0);}"
                ].join('\n');
            }
        }*/
    }

    return snowHandler;
});
