require.config({
    paths: {
        'three' : 'vendor/three',
        'jquery' : 'vendor/jquery.min',
        'tween' : 'vendor/Tween',
        'threex' : 'vendor/threex.volumetricspotlightmaterial'
    }
});

require(['main'], function (main) {
  main.init('WebGL');
});
