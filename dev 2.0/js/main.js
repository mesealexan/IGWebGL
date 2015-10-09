define(["three", "jquery"], function(THREE, jquery){
    var pub = {}; //public functionality
    var width, height; //browser window dimension
    var container; //html element for webGL renderer
    pub.scene = undefined;

    pub.Start = function(){
        //first function called by require in app.js
        width = $(window).width();
        height = $(window).height();
        container = $('#webGL');
        pub.scene = new THREE.Scene();
    };

    return pub;
});
