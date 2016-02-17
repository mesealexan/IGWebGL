require.config({
    paths: {
        "three" : "vendor/three.min"
    }
});

require(['main'], function (main) {
  main.init('WebGL');
});
