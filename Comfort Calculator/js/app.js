require.config({
    paths: {
        'three' : 'vendor/three',
        'jquery' : 'vendor/jquery.min',
        'tween' : 'vendor/Tween'
    }
});

require(['main'], function (main) {
  main.init('WebGL');
});
