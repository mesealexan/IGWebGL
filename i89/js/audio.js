// Howler.iOSAutoEnable = true;

// var backgroundSpaceSound = new Howl({
// 	src: ['media/audio/002965538-space-impact-reverb_01.mp3'],
// 	sprite: {full: [0, 12000]}
// });
// backgroundSpaceSound.play('full');

// var buttonPressSound = new Howl({ src: ['media/audio/036640938_prev_01c.mp3'] });
// $('.btn').on('click', function(){buttonPressSound.stop().play();})
function returnFormatsArray(name){
    var pre = 'media/audio/' + name;
    return [pre + '.mp3', pre + '.ogg', pre + '.m4a'];
}

Howler.iOSAutoEnable = true;

var sound = new Howl({
    src: ['media/audio/i89-coldnight-intro.ogg',
        'media/audio/i89-coldnight-intro.m4a',
        'media/audio/i89-coldnight-intro.mp3']//returnFormatsArray('i89-coldnight-intro')
});



