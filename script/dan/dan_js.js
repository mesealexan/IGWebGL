

function startSVG() {
  var g;
    var burger;
    var hit_btn;
    var closeIcon;
    var all_nav_pads;
    var padHolder;
    var padMask;
    
    var padFill = "#444444";
    var padHover = "#d37032";
    var padSelected = "#aed332";
    
    
//OPENCLOSE
    
       //add hoverts to PADS
       // var hoverover = function() { g.animate({ transform: 'S0.7' }, 1000, mina.bounce ) };
        //var hoverout = function() { g.animate({ transform: 'S1' }, 1000, mina.bounce ) };
        
       //  g.hover( hoverover, hoverout );
    
    
function openNav() {
   
     $("#hud").removeClass("closed");
     burger.attr({visibility: "hidden"});
    
    //$("#hud-copy").fadeIn(2000);
    padMask.transform("S1,1");
    
    all_nav_pads.forEach( function(elem,i) {
        
        elem.stop().attr({fill:"#ffffff", "fill-opacity": 0 })
         .animate({ fill: padFill, "fill-opacity": 1 }, ( 200 * i ), mina.bounce )
    
     });
    
    
}
    
    function closeNav() {
        
        function closePart2 () {
        $("#hud").addClass("closed");
        burger.attr({visibility: "visible"});
        }
     
        
      padMask.stop().animate({ transform: "S0,1,1200,400" }, 600, mina.easeinout, closePart2 )
    }
    
function toggleNav() {
       
    if ( $("#hud").hasClass("closed") ) { openNav() } else { closeNav() };
   
    }
    function delayClose() {
        setTimeout(function () { closeNav(); }, 200);
    }
    
    
//LOAD TOP SVG
    
    var topHUD = Snap('#svg-top-svg');
    
    Snap.load("rawSVG/hud_top_pads.svg", function (f) {
    
       
    //GRAB MASTER G
    g = f.select("#STATIC");
        
    //ASSIGN VARS
    burger = g.select("#burger"); 
    hit_btn = g.select("#burger-hit"); 
    close_btn = g.select("#close-icon"); 
    all_nav_pads = g.selectAll('.nav_pad');
    padHolder = g.select("#navPads");
    
    //HIT TOGGLE BTN
    hit_btn.click( toggleNav );
        
    //add to scene
    topHUD.append(g);
        g.transform("t1,50")
        
    //
        svgBlur = g.filter(Snap.filter.blur(3, 3));
        svgShadow = g.filter(Snap.filter.shadow(0, 2, 3));
        svgNone = g.filter(Snap.filter.shadow(0,0,0));
        filterAnimRef = svgBlur.node.firstChild;
      
   //mask rect
   padMask = g.rect(0, 0, 1260, 708).attr({fill: "#FFFFFF"});
padHolder.attr({ mask: padMask});
   
        
        
    // and for each one we add the desired interactivity
     all_nav_pads.forEach( function(elem,i) {
         
    // change the color on mouse over
    elem.mouseover(function(){
       this.stop().animate({ fill: padHover, transform: 'S.95, .95' }, 300, mina.elastic );
        
       
    });
    // restore the color on mouse out
    elem.mouseout(function(){
       this.stop().animate({fill: padFill }, 600, mina.easein).animate({  transform: 'S1, 1' }, 500, mina.bounce );
       
    });
    // open the popup on click or whatever
    elem.click(function(){
       
        all_nav_pads.forEach( function(elem,i) { 
            
            elem.removeClass("selected").attr("filter", svgNone); 
            elem.stop().animate({ fill: padFill }, 500, mina.easeOut );
                                               
                                               });
        elem.addClass("selected").animate({ fill: padSelected  }, 500, mina.easein, delayClose );
       
       //elem.attr("filter", svgBlur)
      // Snap.animate( 0, .5, function( value ) { filterAnimRef.attributes[0].value = value + ',' + value;  }, 1000, mina.elastic );	
        
        }); 
   
});
        
  
    //burger.attr({visibility: "hidden"});
       
      //  g.attr({
   // fill: "#bada55",
   //stroke: "#000",
   // strokeWidth: 0.4
       // });
        
        //g.transform('s0.5,0.5');
        
        
    
        });
    
   
       
    
}
    
function ig3() {
 
    manageCameraAnimations.playZoomInAnim('animation_5')
    
}