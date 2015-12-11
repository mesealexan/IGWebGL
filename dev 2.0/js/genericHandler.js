define(["animate"], function(animate){
    return function () {
        var _this = this;
        this.frame = this.subFrame = -1;
        this.nextFrame = this.frame + 1;
        this.lastFrame = this.frame - 1;
        this.from = undefined;
        this.to = undefined;
        this.speed = 1;
        this.ceilSpeed = Math.ceil(this.speed);
        this.forward = true;

        this.basePlay = function(from, to){
            this.from = from;
            this.frame = this.from - 1;
            this.subFrame = this.frame;
            this.nextFrame = this.frame + 1;
            this.lastFrame = this.frame - 1;
            if(this.speed < 1) this.selectedModifyFrame = subZeroModifyFrame;
            else this.selectedModifyFrame = standardModifyFrame;
            this.to = --to;

            if(from <= to) this.forward = true;
            else this.forward = false;

            animate.updater.addHandler(this);
        };

        this.update = function() {};

        this.setSpeed = function(s){
          this.speed = s;
          this.ceilSpeed = Math.ceil(s);
        };

        this.pause = function() { animate.updater.removeHandler(this); };

        this.stop = function() { this.pause(); /*this.frame = -1;*/ };

        this.onComplete = function(){};

        this.selectedModifyFrame = function () {};

        this.checkPlayback = function(from, to){
            if (from <= to){//regular playback
                if (this.frame < to){//still has to play
                  this.selectedModifyFrame();
                  return true;
                }
                else {
                    if(this.onComplete)this.onComplete();
                    return false;
                }//reached the end
            }
            else if (from > to){//reverse playback
                if (this.frame > to){//still has to play
                  this.frame -= this.speed;
                  return true;
                }
                else{
                    if(this.onComplete)this.onComplete();
                    return false;
                }//reached the end
            }
        };

        function subZeroModifyFrame(){//TODO: only works for forward playback
          this.subFrame += this.speed;
          if(Math.round( this.subFrame.toFixed(2) * 10) / 10 >= this.nextFrame){
            this.frame++;
            this.nextFrame = this.frame + 1;
          }
        }

        function standardModifyFrame(){ this.frame += this.speed; }
    }
});
