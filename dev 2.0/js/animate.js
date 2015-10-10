define(["underscore", "loader"], function(underscore, loader){
    /***private fields***/
    var animate = {};//public functionality
    var frameID = 0; //keeps track of frame number, can be used to cancelAnimationFrame
    //delta time variables
    var then = _.now();
    var now = undefined;
    var fps = 30;
    var delta = undefined;
    var frame = 0;
    var interval = 1000 / fps;
    /***end private fields***/

    /***public fields***/
    animate.renderer = undefined;
    animate.camera = undefined;
    animate.loader = undefined;
    /***end public fields***/

    animate.Animate = function(){
        frameID = requestAnimationFrame(animate.Animate);
        now = _.now();
        delta = now - then;
        if(delta > interval){
            then = now - (delta % interval);
            animate.renderer.render(animate.loader.scene, animate.camera);
        }
    };

    return animate;
});
