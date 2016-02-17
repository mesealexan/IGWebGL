require.config({
    paths: {
        'three' : 'vendor/three.min',
        'jquery' : 'vendor/jquery.min',
        'tween' : 'vendor/Tween'
    }
});

require(['main'], function (main) {
  main.init('WebGL');
});
