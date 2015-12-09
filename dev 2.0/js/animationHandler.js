define(["genericHandler", "underscore"], function(genericHandler, underscore){
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
          if(this.checkPlayback(this.from, this.to+1)){
            for(var i = 0; i < meshes.length; i++){
              var influences = meshes[i].morphTargetInfluences;
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
            /*for (var i = 0; i < meshes[j].morphTargetInfluences.length; i++)
              meshes[j].morphTargetInfluences[i] = 0;*/
            meshes[j].morphTargetInfluences[ this.from  ] = 0;
            //meshes[j].morphTargetInfluences[ this.from + 1 ] = 0;
            //meshes[j].morphTargetInfluences[ this.to  - 1] = 0;
            meshes[j].morphTargetInfluences[ this.to ] = 0;
          }
        };

        function subFrameInfluence(){

        }
    }
    return animationHandler;
});
