define(["animate", "fxaa"], function(animate, fxaa){
  var composers = {};

  composers.Bloom_AdditiveColor = function(set) {
    set.str = ( set.str !== undefined ) ? set.str : 1;
      var fadeToWhite = {
        uniforms: {
          "tDiffuse": { type: "t", value: null },
          "amount":   { type: "f", value: 0 }
        }
        ,
        vertexShader: [
          "varying vec2 vUv;",
          "void main() {",
            "vUv = uv;",
            "gl_Position = projectionMatrix * modelViewMatrix * vec4( position , 1.0 );",
          "}"
        ].join( "\n" )
        ,
        fragmentShader: [
          "uniform sampler2D tDiffuse;",
          "varying vec2 vUv;",
          "uniform float amount;",

          "void main() {",
            "vec4 tex = texture2D(tDiffuse, vUv);",
            //"gl_FragColor = vec4(tex.r + amount, tex.g + amount, tex.b + amount, tex.a);",
            "gl_FragColor = vec4(tex.r + amount, tex.g + amount, tex.b + amount, tex.a);",
          "}"
        ].join( "\n" )
      };

      var rtParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat };
      var depthMat = new THREE.MeshDepthMaterial();
      var renderTarget = new THREE.WebGLRenderTarget( animate.renderSize.width,
        animate.renderSize.height, rtParameters );

      var composer = new THREE.EffectComposer( animate.renderer );
      composer.addPass( new THREE.RenderPass( animate.loader.scene, animate.camera ) );

      var fadeToWhitePass = new THREE.ShaderPass( fadeToWhite );
      composer.addPass( fadeToWhitePass );

      var bloomPass = new THREE.BloomPass(set.str, 25, 5);
      composer.addPass(bloomPass);

      var fxaaPass = new THREE.ShaderPass( fxaa );
      fxaaPass.uniforms[ 'resolution' ].value.set( 1 / animate.renderSize.width, 1 / animate.renderSize.height );
      composer.addPass( fxaaPass );

      var bokehPass = new THREE.BokehPass( animate.loader.scene, animate.camera, {
					focus: 		1.0,
					aperture:	0.025,
					maxblur:	1.0,
					width: animate.renderSize.width,
					height: animate.renderSize.height
				});

      bokehPass.renderToScreen = true;

      var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
      effectCopy.renderToScreen = true;
      composer.addPass(effectCopy);

      return composer;
    };

    return composers;
});
