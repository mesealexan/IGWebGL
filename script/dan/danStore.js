
function goSVG() {
    
  //  $("#hud_top").attr("display", "none"); //will hide an element.
   // shape = document.getElementsByTagName("svg")[0];
   // shape.setAttribute("viewBox", "0 0 1260 1260"); 
    
}

    

 $('img.svg').each(function(){
     console.log("item found");
     
            var $img = jQuery(this);
            var imgID = $img.attr('id');
            var imgClass = $img.attr('class');
            var imgURL = $img.attr('src');

            jQuery.get(imgURL, function(data) {
                // Get the SVG tag, ignore the rest
                var $svg = jQuery(data).find('svg');

                // Add replaced image's ID to the new SVG
                if(typeof imgID !== 'undefined') {
                    $svg = $svg.attr('id', imgID);
                }
                // Add replaced image's classes to the new SVG
                if(typeof imgClass !== 'undefined') {
                    $svg = $svg.attr('class', imgClass+' replaced-svg');
                }

                // Remove any invalid XML tags as per http://validator.w3.org
                $svg = $svg.removeAttr('xmlns:a');
                

                // Replace image with new SVG
                $img.replaceWith($svg);

            }, 'xml');
     
     
        

        });







//AFTER EVERYTHING ELSE IS LOADED
$(window).load(function () {



$( document ).ready(function() {
   
 // Get the SVG document inside the Object tag
var svgDoc = $("#hud_bottom")[0].contentDocument;
    $(".zoom_btn", svgDoc).hide();
    
  //  var a = document.getElementById("BTN_ZOOM_HERE_7_");
    
   // $("#hit_secondary_seal_8_").click(function(){
////alert("yes");
//manageCameraAnimations.playZoomInAnim('animation_3');





    
    	
    
    // Get the Object by ID
	//var a = document.getElementById("bottomHud");
	
	// Get one of the SVG items by ID;
	//$("#BOTTOM_LINE_8_", svgDoc).css("fill","red");
    
   // $(".st6", svgDoc).hover(function(){alert("yes we can")});
	
  // $("#hit_secondary_seal_8_", svgDoc).hover($(this).css("fill", "red"), $(this).css("fill", "blue") )
 
    
    // $("#bottomHud").svg()
   // $.svg.addExtension('dom', SVGDom);
   // var svg = $("#bottomHud").svg('get'); 
   // svg.circle(130, 75, 50, {fill: 'none', stroke: 'red', strokeWidth: 3});
    
  // var svg = document.getElementById("bottomHud"); 
  //var svgDoc = svg.contentDocument;
    //var my =svgDoc.getElementsByClassName("zoom");
 
  //$(my).css("opacity", .02);
    
    

    
 
   


});
    
    $('img.svg').each(function () {


    var $img = jQuery(this);
    var imgID = $img.attr('id');
    var imgClass = $img.attr('class');
    var imgURL = $img.attr('src');

    jQuery.get(imgURL, function (data) {
        // Get the SVG tag, ignore the rest
        var $svg = jQuery(data).find('svg');
        
       

        // Add replaced image's ID to the new SVG
        if (typeof imgID !== 'undefined') {
            $svg = $svg.attr('id', imgID);
        }
        // Add replaced image's classes to the new SVG
        if (typeof imgClass !== 'undefined') {
            $svg = $svg.attr('class', imgClass + ' replaced-svg');
        }

        // Remove any invalid XML tags as per http://validator.w3.org
        $svg = $svg.removeAttr('xmlns:a');


        // Replace image with new SVG
        $img.replaceWith($svg);

    }, 'xml');

 $(this).find('g').addClass("yesWeCan");


});


function parseSVG() {

    var svgDoc = $('.svg')[0].contentDocument;
    //$('.zoom_btn g', svgDoc).css('fill', 'lime'); // Manipulate the SVG to your heart’s content!

    $(svgDoc).attr("visibility", "none");

    $("g").each(function () {

        console.log("PARSE found ONE")

    })

}


window.onload = function () {

    // Get the Object by ID
    //var a = document.getElementById("hud_bottom");
    //// Get the SVG document inside the Object tag
    //var svgDoc = a.contentDocument;
    // Get one of the SVG items by ID;
    //var svgItem = svgDoc.getElementById("BTN_ZOOM_HERE_7_");
    // Set the colour to something else
    //svgItem.setAttribute("fill", "lime");


 //   var a = document.getElementById("alphasvg");

    //it's important to add an load event listener to the object, as it will load the svg doc asynchronously

      //  var svgDoc = a.contentDocument; //get the inner DOM of alpha.svg
       // var delta = svgDoc.getElementById("BOTTOM_LINE_8_"); //get the inner element by id
 
   // delta.attr("class","newOrange");
   // delta.addEventListener("mousedown",function(){alert('hello world!')},false);  
        //$(delta).attr("class" ,"newOrange");
        
  


};


$(document).ready(function () {

    //  parseSVG();

    // Get the document object for the SVG

    //$(".zoom_btn").css("fill", "red");

    //var svgDoc = $('#hud_bottom')[0].contentDocument; 
    //$('.zoom_btn g', svgDoc).css('fill', 'lime'); // Manipulate the SVG to your heart’s content!

    // var svg = $('#hud_bottom').svg('get');
    // $.svg.addExtension('domh', SVGDom);

    //$(".svg-container").svg('../../hud/hud_BOTTOM.svg');


    // var svgDoc = $("#hud_bottom")[0].contentDocument;

    // Get the SVG document inside the Object tag
    // var element = svgDoc.getElementById("BTN_ZOOM_HERE_7_");
    // Instead of .addClass("newclass")
    //element.setAttribute("class", "newOrange");


    //var svgDoc = $("#hud_bottom")[0].contentDocument;
    //  $("#BTN_ZOOM_HERE_7_", svgDoc).attr("class" , "newOrange");

    console.log("done ready");

});

$(function(){
return;
	$("#stage").load('hud/hud_BOTTOM.svg',function(response){

		$(this).addClass("svgLoaded");
		
		if(!response){ // Error loading SVG
			$(this).html('Error loading SVG. Be sure you are running from a the http protocol (not locally) and have read <strong><a href="http://tympanus.net/codrops/?p=13831#the-javascript">this important part of the tutorial</a></strong>');
		}

	});
    
     var path=document.getElementById("smiley")
      .getSVGDocument()
      .getElementById("path2383");
   path.style.setProperty("fill",color, "");
    
   var o = document.getElementById('stage').contentDocument.getElementById('svgID');
document.adoptNode(o);
document.getElementById('target').appendChild(o);
    
});
