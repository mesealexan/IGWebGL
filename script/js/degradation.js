function webgl_detect(return_context)
{
    if (!!window.WebGLRenderingContext) {
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
        return webGL_disabled();
    }
 
    // WebGL not supported
    return webGL_notSupported();
}

function webGL_disabled () {
    if(bowser.safari){
     $( "#background" ).append( "<p>webGL is disabled.</p>" );
     $( "#background" ).append( "<p>Open the Safari menu and select Preferences.</p>" );
     $( "#background" ).append( "<p>Then, click the Advanced tab in the Preferences window.</p>" );
     $( "#background" ).append( "<p>At the bottom of the window, check the Show Develop menu in menu bar checkbox.</p>" );
     $( "#background" ).append( "<p>Finally, open the Develop menu in the menu bar and select Enable WebGL.</p>" );
    }
    else background.textContent = "Please enable WebGL for the best experience.";

    return false;    
}

function webGL_notSupported() {
    if(bowser.msie)        
        background.textContent = "webGL not supported. For the best results, "+ 
                                 "please update to Internet Explorer 11."; 
    else if (bowser.safari && !bowser.ios) 
       background.textContent = "Please change to Firefox or Chrome for the best experience.";    
    else if(bowser.safari && bowser.ios) 
        background.textContent = "webGL not supported. For the best results, "+
                                 "please update to iOS 8."; 
    else if(bowser.chrome) 
        background.textContent = "webGL not supported. For the best results, "+
                                 "please update Chrome."; 
    else background.textContent = "webGL not supported. For the best results, "+
                                 "please update your browser.";     

    return false;        
}