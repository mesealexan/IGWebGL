define(["animate"], function(animate){
    return function () {
        var _this = this;
        this.frame = -1;
        this.from = undefined;
        this.to = undefined;

        this.basePlay = function(from, to){
            this.from = from;
            this.frame = this.from - 1;
            this.to = --to;

            animate.updater.addHandler(this);
        };

        this.update = function() {};

        this.pause = function() { animate.updater.removeHandler(this) };

        this.stop = function() { this.pause(); this.frame = -1 };

        this.checkPlayback = function(from, to){
            if (from <= to) //regular playback
                if (this.frame++ < to) return true; //still has to play
                else return false; //reached the end

            else if (from > to) //reverse playback
                if (this.frame-- > to) return true; //still has to play
                else return false; //reached the end
        };
    }
});