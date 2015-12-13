define(["animate", "orbitControls", "underscore", "hammer", "gui"],
    function(animate, orbitControls, underscore, hammer, gui){
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



    events.addDOF_GUI = function(scene) {
      return;
      var effectController  = {
        focus: 		1.0,
        aperture:	0.025,
        maxblur:	1.0
      };

      var matChanger = function( ) {
        scene.assets.composer.passes[4].uniforms[ "focus" ].value = effectController.focus;
        scene.assets.composer.passes[4].uniforms[ "aperture" ].value = effectController.aperture;
        scene.assets.composer.passes[4].uniforms[ "maxblur" ].value = effectController.maxblur;
      };

      var ui = new gui.GUI();
				ui.add( effectController, "focus", 0.0, 3.0, 0.025 ).onChange( matChanger );
				ui.add( effectController, "aperture", 0.001, 0.2, 0.001 ).onChange( matChanger );
				ui.add( effectController, "maxblur", 0.0, 3.0, 0.025 ).onChange( matChanger );
		  ui.close();

      $(".dg").css('z-index', 6);
    }

    return events;
});
