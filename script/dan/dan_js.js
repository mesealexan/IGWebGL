var navOpen = 0;

//QUICK NAV
$(".allNav, .close-icon").hide();



$(".burger-hit").click(function(){

if ( navOpen == 1 ) {
    
    //menu open now close
   
   navOpen = 0;
    $(".allNav").stop().fadeOut(500);
    $(".close-icon").hide();
    $(".burger").stop().delay(500).fadeIn(200);
    
    } else {
    //menu closed now open
     navOpen = 1;
    $(".allNav").stop().fadeIn(500);
    $(".burger").hide();
    $(".close-icon").stop().delay(500).fadeIn(200);
    };

})

