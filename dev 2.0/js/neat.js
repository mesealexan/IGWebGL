define(["events"], function(events){
    var neat = {};
    neat.folderName = "neat";
    neat.assetNames = ['House', 'Floor_grid', 'Floor_grass', 'Sky_plane'];
    neat.soundNames = [];
    neat.onStartFunctions = {};
    neat.onLoadFunctions = {};
    neat.onFinishLoadFunctions = {};
    neat.assets = {};

    /***on start functions***/
    neat.onStartFunctions.addLights = function(scene){
        scene.add(new THREE.AmbientLight(0xffffff));
        var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
        directionalLight.position.set( 0.894, 0,  0.446 );
        scene.add( directionalLight );
        /*var spotLight = new THREE.SpotLight(0xb99bfd);
        spotLight.position.set(980, 1049, -656);
        spotLight.target.position.set(34, 0, 85);
        scene.add( spotLight );*/
    };
    /***end on start functions***/

    /***on load functions***/
    neat.onLoadFunctions.House = function(mesh){
        //mesh.geometry.mergeVertices();
        //console.log(mesh.material)
    };
    /***end on load functions***/

    /***on finish functions***/
    neat.onFinishLoadFunctions.addControls = function(){
        events.AddControls();
        events.ToggleControls(false);
    };
    /***end on finish functions***/



    return neat;
});