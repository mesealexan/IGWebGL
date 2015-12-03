define(["animate", "orbitControls", "underscore", "hammer"],
    function(animate, orbitControls, underscore, hammer){
    var events = {};

    events.Controls = undefined;
    events.hammer = undefined;

    $( "canvas" ).mousedown(function(event){ event.preventDefault(); });

    events.AddButton = function(btn){
        var b = $('<input type="button" class="'+btn.class+'" id="'+btn.id+'" value="'+btn.text+'"/>');

        if(btn.parent) $("#"+btn.parent).append(b);
        else $("#cameraButtons").append(b);

        if(btn.once)$("#"+btn.id).one("click",btn.function);
        else $("#"+btn.id).on("click",btn.function);
    };

    events.AddMouseDownEvent = function(fun){
        $("body").on("mousedown", "#webGL", fun);
    };

    events.RemoveMouseDownEvent = function(fun){
        $("body").off("mousedown", "#webGL", fun);
    };

    events.AddMouseUpEvent = function(fun){
        $("body").on("mouseup", "#webGL", fun);
        //events.hammer.on('panend', function() { fun(); });

    };

    events.RemoveMouseUpEvent = function(fun){
        $("body").off("mouseup", "#webGL", fun);
        //events.hammer.off('panend', function() { fun(); });
    };

    events.RemoveElementByID = function(id){
        $("#"+id).off("click").remove();
    };

    events.EmptyElementByID = function(id){ $("#"+id).empty(); };

    events.UnbindAll = function(){
      $("body").off();
    };

    events.AddControls = function(c){
        var _this = this;
        this.Controls = new orbitControls( animate.camera, animate.renderer.domElement );
        this.hammer = new hammer(animate.container);
        this.hammer.get('pan').set({ direction: hammer.DIRECTION_ALL });
        _.each(_.keys(c), function(prop){ _this.Controls[prop] = c[prop]; });
    };

    events.ToggleControls = function(bool){ this.Controls.enabled = bool; };

    return events;
});
