define(["genericHandler", "underscore"], function(genericHandler, underscore){
    animationHandler.prototype = new genericHandler();
    function animationHandler(){
        var meshes = [];
        var loop = false;
        var influence = 1;
        var influencePerFrame = influence / (1 / this.speed);
        var _this = this;

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
            selectInfluenceFunction();
            this.basePlay(from, to);
        };

        this.loop = function(from, to){
            selectInfluenceFunction();
            loop = true;
            this.basePlay(from, to);
        };

        this.selectedModifyInfluence = function () {};

        this.update = function () {
          if(this.checkPlayback(this.from, this.to)){
            for(var i = 0; i < meshes.length; i++){
              var influences = meshes[i].morphTargetInfluences;
              this.selectedModifyInfluence(influences);
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
            meshes[j].morphTargetInfluences[ this.from  ] = 1;
            meshes[j].morphTargetInfluences[ this.to ] = 0;
          }
        };

        function selectInfluenceFunction() {
            if(_this.speed < 1) _this.selectedModifyInfluence = subFrameInfluence;
            else _this.selectedModifyInfluence = standardFrameInfluence;
        }

        function subFrameInfluence(influences){
          if (this.forward)influences[ this.frame - this.ceilSpeed ] -= influencePerFrame;
          else influences[ this.frame + this.ceilSpeed ] -= influencePerFrame;
          influences[ this.frame ] += influencePerFrame;
        }

        function standardFrameInfluence(influences) {
          influences[ this.frame - 1] = 0;
          influences[ this.frame ] = influence;
          influences[ this.frame + 1] = 0;
        }
    }
    return animationHandler;
});
