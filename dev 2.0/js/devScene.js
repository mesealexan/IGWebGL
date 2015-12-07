define(["animate", "physi", "materials", "composers", "events"], function (animate, physi, materials, composers, events) {
  var devScene = {
    folderName: "devScene",
    assetNames: ["House_collider"],
    soundNames: [],
    onStartFunctions: {},
    onLoadFunctions: {},
    onUnloadFunctions: {},
    onFinishLoadFunctions: {},
    animationHandlers: {},
    assets: {}
  };

  /***on start functions***/
	devScene.onStartFunctions.addLights = function (scene) {
		devScene.assets.directionalLight = new THREE.DirectionalLight(0xffffff);
    scene.add(devScene.assets.directionalLight);

    devScene.assets.ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(devScene.assets.ambientLight);
        events.AddControls();
	};

  devScene.onFinishLoadFunctions.applyComposer = function(scene){
    devScene.assets.composer = new composers.Outline();
    animate.SetCustomRenderFunction( function(){ devScene.assets.composer.render();} );
  };

  /***on load functions***/
	devScene.onLoadFunctions.House_collider = function (mesh, loader) {
  //  mesh.scale.set(0.3, 0.3, 0.3);
  //  mesh.position.y += 0.5;
    mesh.rotation.y -= Math.PI / 4;
    mesh.material = materials.setMaterials("tornado", {name: "checker"});

    var boxMat = Physijs.createMaterial(
      new THREE.MeshLambertMaterial( {color: Math.random() * 0xffffff} ),
      .6, // medium friction
      .3 // low restitution
    );
    mesh.visible = false;

    var houseMesh = new Physijs.ConvexMesh (mesh.geometry.clone(), boxMat, 0 );
    houseMesh.material.depthWrite = false;
    houseMesh.scale.set(2, 2, 2);
    houseMesh.position.y += 1;
    houseMesh.material = materials.setMaterials("tornado", {name: "checker"});
    loader.scene.add( houseMesh );
	};

  /***on finish load functions***/
  devScene.onFinishLoadFunctions.addCube = function (scene, loader) {
    animate.camera.position.set(0, 10, 10);
    animate.camera.lookAt(new THREE.Vector3(0,0,0));

		var ground_material = Physijs.createMaterial(
			new THREE.MeshLambertMaterial( {color: 0x00ff00} ),
			.8, // high friction
			.3 // low restitution
		);

    var ground = new Physijs.BoxMesh(
      new THREE.BoxGeometry( 15, 1, 15 ),
      ground_material,
      0 // mass
    );
  //  scene.add( ground )

    ;/*scene.setGravity(new THREE.Vector3( 0, -30, 0 ));
		scene.update = function() { scene.simulate( undefined, 1 ); };

    setInterval( function(){
      var box_geometry = new THREE.BoxGeometry( Math.random() + 0.3,
                                                Math.random() + 0.3,
                                                Math.random() + 0.3 );
      var boxMat = Physijs.createMaterial(
  			new THREE.MeshLambertMaterial( {color: Math.random() * 0xffffff} ),
  			.6, // medium friction
  			.3 // low restitution
  		);

      var box = new Physijs.BoxMesh(box_geometry, boxMat);
      box.position.y += 10;
      box.rotation.set(Math.random(),Math.random(),Math.random())
      scene.add( box );
    }, 1000 );*/
  };

  return devScene;
});
