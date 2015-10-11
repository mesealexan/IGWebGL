define(["underscore", "loader", "updater"],
    function(underscore, loader, updater){
    var animate = {};//public functionality

    /***private fields***/
    var frameID = 0;//keeps track of frame number, can be used to cancelAnimationFrame
    //delta time variables
    var then = _.now();
    var now = undefined;
    var fps = 30;//should NOT change, all JSON files exported at 30 fps
    var delta = undefined;//actual time between current and last frame
    var interval = 1000 / fps;//ideal time in ms between frames
    /***end private fields***/

    /***public fields***/
    animate.renderer = undefined;
    animate.camera = undefined;
    animate.loader = undefined;
    animate.updater = new updater();
    /***end public fields***/

    animate.Animate = function(){
        frameID = requestAnimationFrame(animate.Animate);
        now = _.now();
        delta = now - then;
        if(delta > interval){
            then = now - (delta % interval);
            animate.updater.UpdateHandlers();
            animate.renderer.render(animate.loader.scene, animate.camera);
        }
    };

    return animate;
});
