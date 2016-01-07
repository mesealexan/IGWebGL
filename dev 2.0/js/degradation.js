define(["bowser"], function (bowser) {
  var degradation = {};
  var containerID = undefined;

  degradation.webgl_detect = function(obj){
    var return_context = obj.return_context;
    containerID = obj.id;

      if (!!window.WebGLRenderingContext){
          var canvas = document.createElement("canvas"),
               names = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
             context = false;

          for(var i=0;i<4;i++) {
              try {
                  context = canvas.getContext(names[i]);
                  if (context && typeof context.getParameter == "function") {
                      // WebGL is enabled
                      if (return_context) {
                          // return WebGL object if the function's argument is present
                          return {name:names[i], gl:context};
                      }
                      // else, return just true
                      return true;
                  }
              } catch(e) {}
          }
          // WebGL is supported, but disabled
          return degradation.webGL_disabled();
      }

      // WebGL not supported
      return degradation.webGL_notSupported();
  };

  degradation.webGL_disabled = function () {
      if(bowser.safari){
         this.append( "webGL is disabled." );
         this.append( "Open the Safari menu and select Preferences." );
         this.append( "Then, click the Advanced tab in the Preferences window." );
         this.append( "At the bottom of the window, check the Show Develop menu in menu bar checkbox." );
         this.append( "Finally, open the Develop menu in the menu bar and select Enable WebGL." );
      }
      else this.append("Please enable WebGL for the best experience.");

      return false;
  };

  degradation.webGL_notSupported = function() {
      if(bowser.msie){
        this.append( "webGL not supported. For the best results," );
        this.append( "please update to Internet Explorer 11." );
      }
      else if (bowser.safari && !bowser.ios)
         this.append( "Please change to Firefox or Chrome for the best experience." );
      else if(bowser.safari && bowser.ios)
          this.append( "webGL not supported. For the best results, please update to iOS 8." );
      else if(bowser.chrome)
          this.append( "webGL not supported. For the best results, please update Chrome." );
      else this.append( "webGL not supported. For the best results, please update your browser.");

      return false;
  };

  degradation.append = function(txt){
    $( "#" + containerID ).append("<p>" + txt + "</p>");
  };

  return degradation;
});
