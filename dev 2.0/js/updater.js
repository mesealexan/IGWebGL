define([], function(){
    return function () {
        this.handlers = [];

        this.addHandler = function(h){ this.handlers.push(h) };

        this.removeHandler = function(h){
            var index = this.handlers.indexOf(h);
            if(index > -1) this.handlers.splice(index, 1);
        };

        this.UpdateHandlers = function (systemDelta) {
            for (var i = 0; i < this.handlers.length; i++)
              this.handlers[i].update(systemDelta);
        };

        this.clearAll = function() { this.handlers = []; };

        this.stopAllSnow = function() {
            for (var i = 0; i < this.handlers.length; i++) {
                var h = this.handlers[i];
                if(h.handlerType == "snowHandler") h.stop();
            }
        };
    }
});
