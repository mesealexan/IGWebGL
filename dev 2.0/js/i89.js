define(["animate"], function(animate){
    var i89 = {};
    i89.folderName = "i89";
    i89.loadFunctions = {};//functions called on load complete, MUST be same name as asset
    i89.assetNames = ['floor', 'walls', 'snow', 'bck', 'grid', 'heat_source',
        'text', 'winterNight', 'winterNight', 'moon', 'logo', 'frame', 'i89',
        'window_plane', 'heat_wave', 'heat_wave_refract', 'heat_wave_reflect'];

    /***load functions***/
    i89.loadFunctions.bck = function(mesh){
        var bck2 = mesh.clone();
        bck2.material.side = THREE.DoubleSide;
        bck2.scale.z = -1;
        bck2.quaternion.set ( 0, 1, 0, 0);
        mesh.add(bck2);
    };

    i89.loadFunctions.heat_wave = function(mesh){
        var heat_wave2 = mesh.clone();
        var heat_wave3 = mesh.clone();
        heat_wave2.visible = heat_wave3.visible = false;
        heat_wave2.position.x += 26;
        heat_wave3.position.x += 46;
        mesh.add(heat_wave2);
        mesh.add(heat_wave3);
    };
    /***end load functions***/

    return i89;
});