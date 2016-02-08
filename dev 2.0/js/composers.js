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

          /*"float random(float p){",
            "return fract(sin(p)*100000.);",
          "}",*/

          "void main() {",
            "vec4 tex = texture2D(tDiffuse, vUv );",
            //"if(vUv.x > 0.5) gl_FragColor;",
            //"if(random(tex.b) < .2) discard;",
            //"gl_FragColor = vec4(random(tex.r), random(tex.g) , random(tex.b), tex.a);",
            //"gl_FragColor = vec4((tex.r), smoothstep(0., 1., vUv.x) , tex.b, tex.a);",
            "gl_FragColor = vec4(tex.r + amount, tex.g + amount, tex.b + amount, tex.a);",
            //"gl_FragColor = tex;",
          "}"
        ].join( "\n" )
      };

      var rtParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat };
      var depthMat = new THREE.MeshDepthMaterial();
      var renderTarget = new THREE.WebGLRenderTarget (
        animate.renderSize.width,
        animate.renderSize.height,
        rtParameters
      );

      var composer = new THREE.EffectComposer( animate.renderer );
      composer.renderPass = new THREE.RenderPass( animate.loader.scene, animate.camera );
      composer.addPass( composer.renderPass );

      composer.bloomPass = new THREE.BloomPass(set.str, 25, 5);
      composer.bloomPass.name = "bloom";
      composer.addPass(composer.bloomPass);

      composer.fadeToWhitePass = new THREE.ShaderPass( fadeToWhite );
      composer.fadeToWhitePass.name = "fadeToWhite";
      composer.addPass( composer.fadeToWhitePass );



      composer.fxaaPass = new THREE.ShaderPass( fxaa );
      composer.fxaaPass.name = "fxaa";
      composer.fxaaPass.uniforms[ 'resolution' ].value.set( 1 / animate.renderSize.width, 1 / animate.renderSize.height );
      composer.fxaaPass.renderToScreen = true;
      composer.addPass( composer.fxaaPass );

      console.log(composer)

      /*
      var bokFoc, bokApe;
      if(set.bok != undefined){ bokFoc = set.bok.foc; bokApe = set.bok.ape; }
      else {bokFoc = 1; bokApe = 0;}

      var bokehPass = new THREE.BokehPass( animate.loader.scene, animate.camera, {
					focus: 	  bokFoc,
					aperture:	bokApe,
					maxblur:	1.0,
					width: animate.renderSize.width,
					height: animate.renderSize.height
				});

      bokehPass.renderToScreen = true;
      composer.addPass( bokehPass );
      */
      return composer;
    };

    return composers;
});
