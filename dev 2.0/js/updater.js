define(["underscore"], function(underscore){
    //todo: implement underscore each loops
    return function () {
        this.handlers = [];

        this.addHandler = function(h){ this.handlers.push(h) };

        this.removeHandler = function(h){
            var index = this.handlers.indexOf(h);
            if(index > -1) this.handlers.splice(index, 1);
        };

        this.UpdateHandlers = function () {
            for (var key in this.handlers) this.handlers[key].update();
        };

        this.clearAll = function(){ this.handlers = []; };

        this.stopAllSnow = function() {
            for (var i = 0; i < this.handlers.length; i++) {
                var h = this.handlers[i];
                if(h.handlerType == "snowHandler") h.stop();
            }
        }
    }
});