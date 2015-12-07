define(["genericHandler"], function(genericHandler){
    animationHandler.prototype = new genericHandler();
    function animationHandler(){
        var meshes = [];
        var loop = false;
        var influence = 1;
        var influencePerFrame = influence / (1 / this.speed);

        this.setInfluence = function (newInfluence) {
          influence = newInfluence;
          influencePerFrame = influence / (1 / this.speed);
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
              var influences = meshes[i].morphTargetInfluences;
              /*if(this.speed < 1){
                influences[ this.frame ] += 3;
                console.log(influences[ this.frame ])
              }*/
              if (this.forward)influences[ this.frame - this.ceilSpeed ] -= influencePerFrame;
              else influences[ this.frame + this.ceilSpeed ] -= influencePerFrame;
              influences[ this.frame ] += influencePerFrame;
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
            meshes[j].morphTargetInfluences[ this.from ] = influence;
            meshes[j].morphTargetInfluences[ this.to ] = 0;
          }
        };

        function subFrameInfluence(){

        }
    }
    return animationHandler;
});
