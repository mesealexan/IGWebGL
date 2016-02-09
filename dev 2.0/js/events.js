define( ["animate", "orbitControls", "underscore", "hammer", "gui"],
    function( animate, orbitControls, underscore, hammer, gui ) {
    var events = {};
    var activeClassName = "activated";

    events.Controls = undefined;
    events.hammer = undefined;
    events.containerID = undefined;

    function activateButton ( button ) {
      $(button).addClass( activeClassName )
      .siblings()
      .removeClass( activeClassName );
    }

    function resetAnimateTimeout () {
      animate.ResetTimeout();
      animate.StopPan();
    }

    events.Init = function ( containerID ) {
      events.containerID = containerID;
      $( "#" + events.containerID ).mousedown(function ( event ) { event.preventDefault(); });
      $( "#" + events.containerID ).on( "click mousemove", function (event) {
        resetAnimateTimeout();
      });
    }

    events.AddButton = function ( btn ) {
        btn.class = btn.class || " ";
        btn.id = btn.id || " ";
        btn.text = btn.text || " ";

        var b = $('<input type="button" class="' + btn.class +
                                     '" id="' + btn.id +
                                     '" value="' + btn.text + '"/>');

        if( btn.parent )
          $( "#" + btn.parent ).append( b );
        else {
          $( "#cameraButtons" ).append( b );

          $( b ).on( "click", function (){
            activateButton( this ); // add 'active' class to camera control buttons
          });
        }


        if( btn.once)
          $( "#"+btn.id ).one( "click", btn.function );
        else
          $( "#"+btn.id ).on( "click", btn.function );
    };

    events.AddMouseDownEvent = function ( fun ) {
        $("body").on("mousedown", "#"+events.containerID, fun);
    };

    events.RemoveMouseDownEvent = function ( fun ) {
        $("body").off("mousedown", "#"+events.containerID, fun);
    };

    events.AddMouseUpEvent = function ( fun ) {
        $("body").on("mouseup", "#"+events.containerID, fun);
        //events.hammer.on('panend', function() { fun(); });
    };

    events.RemoveMouseUpEvent = function ( fun ) {
        $("body").off("mouseup", "#"+events.containerID, fun);
        //events.hammer.off('panend', function() { fun(); });
    };

    events.RemoveElementByID = function ( id ) {
        $("#"+id).off("click").remove();
    };

    events.EmptyElementByID = function ( id ) { $( "#" + id ).empty(); };

    events.UnbindAll = function () {
      $("body").off();
    };

    events.AddControls = function ( c ) {
        var _this = this;
        this.Controls = new orbitControls( animate.camera, animate.renderer.domElement );
        //this.hammer = new hammer(animate.container);
        //this.hammer.get('pan').set({ direction: hammer.DIRECTION_ALL });
        _.each(_.keys(c), function(prop){ _this.Controls[prop] = c[prop]; });
    };

    events.ToggleControls = function ( bool ) {
      events.Controls.enabled = bool;
    };

    events.addDOF_GUI = function ( scene ) {
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
