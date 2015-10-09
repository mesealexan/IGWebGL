function returnFormatsArray(name){
    var pre = 'media/audio/' + name;
    return [pre + '.mp3', pre + '.ogg', pre + '.m4a'];
}

Howler.iOSAutoEnable = true;

var coldnightIntro = new Howl({
    src: returnFormatsArray("i89-coldnight-intro")
});

var heaterLoop = new Howl({
    src: returnFormatsArray("i89-heater-loop"),
    volume: 0
});

var cameraZoom = new Howl({
    src: returnFormatsArray("i89-camera-zoom")
});

var windowToggleS = new Howl({
    src: returnFormatsArray("i89-toggle-glasstype")
});





