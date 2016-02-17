require.config({
    paths: {
        "three" : "vendor/three.min",
        'jquery': 'vendor/jquery.min'
    }
});

require(['main'], function (main) {
  main.init('WebGL');
});
