var navOpen = 0;

//HIDE TEXT ON START
// SEQUENCE OPEN
//BLINK  SELECTED AND CLOSE
// FLASH OR shine on Burger hover
// MOve HUD down by % height screen

//Make % of screen width - with minimum size

//Cool Minority report grid in back (maybe in centered container without hide


function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}


$('.burger').show();

function openNav() {  
         navOpen = 1;
$('.burger').hide();
   $('.close-icon').show();
//$('.burger').animate({  top:'-40px'}, 2000, "easeOutBack");
    
    $("#hud-copy").delay(700).fadeIn(300)
    $(".nav_x002D_pad_selected").attr("class", "nav_x002D_pad_selected on");
    $(".nav_x002D_pad").each(function(index,item){
        
      
        
        $(this).attr("class", "nav_x002D_pad on");
   
        
        
     

    }) ;
        
        
        
        
    



}

function closeNav() {
  
    navOpen = 0;
    $('.burger').show();
      $('.close-icon').hide();
   //$('.burger').attr("class", "burger navClosed");
     $("#hud-copy").delay(10).fadeOut(100)
     $(".nav_x002D_pad.on").delay(500).attr("class", "nav_x002D_pad");
    $(".nav_x002D_pad_selected.on").delay(2000).attr("class", "nav_x002D_pad_selected");
        
        
        
        

    
}

//OPEN CLOSE NAV
$(".burger-hit").click(function(){


    
 if( navOpen == 0)  { openNav() } else { closeNav()};



});




//TAB TEST

$(".nav_x002D_pad").click(function(){
    
    // Instead of .removeClass("newclass")
$(".nav_x002D_pad_selected").attr("class", "nav_x002D_pad on");
    
  // Instead of .addClass("newclass")
$(this).attr("class", "nav_x002D_pad_selected on");

   // $(".nav_x002D_pad").css("fill","#022222");
   //$(this).className = "nav_x002D_pad selected";
    
 //   css("fill","#d0c220");
    
});
    
function ig3() {
 
    manageCameraAnimations.playZoomInAnim('animation_5')
    
}