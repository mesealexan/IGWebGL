define(["genericHandler"], function(genericHandler){
    animationHandler.prototype = new genericHandler();
    function animationHandler(){
        var meshes = [];
        var loop = false;
        var influence = 1;

        this.setInfluence = function (newInfluence) {
          influence = newInfluence;
        };

        this.setMesh = function(m) {
          if(m.constructor === Array)
            for(var i = 0; i < m.length; i++) meshes.push(m[i]);
          else meshes.push(m);
        };

        this.play = function(from, to){
            this.basePlay(from, to);
        };

        this.loop = function(from, to){
            loop = true;
            this.basePlay(from, to);
        };

        this.update = function () {
          if(this.checkPlayback(this.from, this.to)){
            for(var i = 0; i < meshes.length; i++){
              meshes[i].morphTargetInfluences[ this.frame - this.speed ] = 0;
              meshes[i].morphTargetInfluences[ this.frame ] = influence;
              meshes[i].morphTargetInfluences[ this.frame + this.speed ] = 0;
            }
          }
          else {
            if(loop){
                this.stop();
                this.resetInfluences();
                this.basePlay(this.from, this.to + 1);
            }
            else this.stop();
          } //reached the end
        };

        this.resetInfluences = function(){
          for(var j = 0; j < meshes.length; j++){
            meshes[j].morphTargetInfluences[ this.from ] = 1;
            meshes[j].morphTargetInfluences[ this.to ] = 0;
          }
        };
    }
    return animationHandler;
});
