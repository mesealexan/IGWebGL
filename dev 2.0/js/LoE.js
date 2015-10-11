define(["animate"], function(animate){
    var LoE = {};
    LoE.folderName = "LoE";
    LoE.loadFunctions = {};//functions called on load complete, MUST be same name as asset
    LoE.assetNames = ['text', 'rail', 'plane', 'rotator', 'window', 'fixed_glass',
        'tambur_a', 'tambur_b'];

    /***load functions***/

    /***end load functions***/

    return LoE;
});