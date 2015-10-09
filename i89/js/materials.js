var imagePrefix = "media/skybox/Cube_";
var directions  = ["r", "l", "u", "d", "f", "b"]; 
var imageSuffix = ".jpg";

makeTextureCube();
function makeTextureCube (argument) {
	var urls = [];
	for (var i = 0; i < 6; i++)
		urls.push(imagePrefix + directions[i] + imageSuffix);
	textureCube = THREE.ImageUtils.loadTextureCube( urls, THREE.CubeRefractionMapping );
}

function addSkybox () {
	var cubeGeom = new THREE.BoxGeometry(5000,5000,5000);
	var materialArray = [];
	for (var i = 0; i < 6; i++){
		materialArray.push( new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
			side: THREE.DoubleSide
		}));
	}
	var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
	var skyBox = new THREE.Mesh( cubeGeom, skyMaterial );
	//scene.add( skyBox );
}

function setMaterials(materialName){
	var material;
	switch(materialName){
        case "logo":       
            material = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture(imagesArray[7])});
        break;

        case "window_plane":
            material = new RadialGradientMaterial();
        break;

		case 'sealant a':
		    material = new THREE.MeshPhongMaterial({
		    	color: new THREE.Color("rgb(161,161,161)"),
		    	ambient: new THREE.Color("rgb(116,116,116)"),
		    	specular: new THREE.Color("rgb(255,255,255)")
		    })
	    break;

	    case 'sealant b':
		    material = new THREE.MeshPhongMaterial({
		    	color: new THREE.Color("rgb(213,213,213)"),
		    	ambient: new THREE.Color("rgb(116,116,116)"),
		    	specular: new THREE.Color("rgb(255,255,255)")
		    })
	    break;

	    case 'Spacer':
		    material = new THREE.MeshPhongMaterial({
		    	color: new THREE.Color("rgb(213,213,213)"),
		    	ambient: new THREE.Color("rgb(222,222,222)"),
		    	specular: new THREE.Color("rgb(255,255,255)")
		    })
	    break;

	    case 'Spacer Cap':
		    material = new THREE.MeshPhongMaterial({
		    	color: new THREE.Color("rgb(213,213,213)"),
		    	ambient: new THREE.Color("rgb(116,116,116)"),
		    	specular: new THREE.Color("rgb(255,255,255)"),
		    	normalMap: THREE.ImageUtils.loadTexture(imagesArray[4])
		    })
	    break;

	    case 'Glass':	
			material = new THREE.MeshPhongMaterial({ 
				color: new THREE.Color("rgb(255,255,255)"),
				specular: new THREE.Color("rgb(0,80,60)"),
				vertexColors: THREE.VertexColors,
				envMap: textureCube,
				refractionRatio: 0.985, 
				reflectivity: 0.99,
				shininess: 30,
				transparent: true,
				opacity: 0.61
			});
	    break;

	    case 'Glass Sides':
			material = new THREE.MeshPhongMaterial({ 
				color: new THREE.Color("rgb(46,56,31)"),
				ambient: new THREE.Color("rgb(46,56,31)"),
				emissive: new THREE.Color("rgb(46,56,31)"),
				specular: new THREE.Color("rgb(0,80,60)"),
				envMap: textureCube,
				refractionRatio: 0.985, 
				reflectivity: 0.99,
				shininess: 30,
				transparent: true,
				opacity: 0.96
			});
	    break;

		case 'window frame':
		material = new THREE.MeshLambertMaterial({
	    	color: new THREE.Color("rgb(10,4,3)"),
	    	ambient: new THREE.Color("rgb(22,16,15)"),
	    	specular: new THREE.Color("rgb(255,255,255)")
	    });
		break;

		case 'heat wave':
		material = new THREE.MeshPhongMaterial({
	    	color: new THREE.Color("rgb(223,116,20)"),
	    	ambient: new THREE.Color("rgb(223,116,20)"),
	    	specular: new THREE.Color("rgb(230,220,60)"),
	    	emissive: new THREE.Color("rgb(223,116,20)"),
	    	opacity: 0.35,
	    	transparent: true,
	    	morphTargets : true,
	    	depthWrite: true,
	    	depthTest: true
	    });
		break;

		case 'text':
		material = new THREE.MeshLambertMaterial({
	    	color: new THREE.Color("rgb(27,12,8)"),
	    	ambient: new THREE.Color("rgb(27,12,8)"),
	    	specular: new THREE.Color("rgb(27,12,8)"),
	    	emissive: new THREE.Color("rgb(27,12,8)")
	    });
	    break;

		case 'snow':
		var map = THREE.ImageUtils.loadTexture(imagesArray[4]);

		material = new THREE.MeshLambertMaterial({
	    	map: map
	    });
	    break;

		case 'background':
		var map = THREE.ImageUtils.loadTexture(imagesArray[3]);

		material = new THREE.MeshLambertMaterial({
	    	map: map
	    });
	    break;

		case 'wall1':
		material = new THREE.MeshLambertMaterial({
	    	color: new THREE.Color("rgb(69,30,15)"),
	    	ambient: new THREE.Color("rgb(69,30,15)"),
	    	specular: new THREE.Color("rgb(255,255,255)")
	    });
	    break;
	    	
	    case 'metal':
		material = new THREE.MeshPhongMaterial({
	    	color: new THREE.Color("rgb(34,34,34)"),
	    	ambient: new THREE.Color("rgb(61,61,61)"),
	    	specular: new THREE.Color("rgb(255,255,255)"),
	    	metal: true,
	    	shininess: 60
	    });
	    break;

	    case 'wall2':
		material = new THREE.MeshLambertMaterial({
	    	color: new THREE.Color("rgb(212,175,122)"),
	    	ambient: new THREE.Color("rgb(212,175,122)"),
	    	specular: new THREE.Color("rgb(255,255,255)")
	    });
	    break;

		case 'concrete':
		material = new THREE.MeshLambertMaterial({
	    	color: new THREE.Color("rgb(125,125,125)"),
	    	ambient: new THREE.Color("rgb(125,125,125)"),
	    	specular: new THREE.Color("rgb(255,255,255)")
	    });
	    break;

		case 'outer wall':
		material = new THREE.MeshPhongMaterial({
	    	color: new THREE.Color("rgb(217,216,219)"),
	    	ambient: new THREE.Color("rgb(125,125,125)"),
	    	specular: new THREE.Color("rgb(191,172,233)")
	    });
		break;

		case 'moon':
		var map = THREE.ImageUtils.loadTexture(imagesArray[5]);
		material = new THREE.MeshPhongMaterial({
	    	emissive: new THREE.Color(0xb99bfd),
	    	map: map
	    });
		break;

		case 'wood':
		var map = THREE.ImageUtils.loadTexture(imagesArray[1]);
		var bump = THREE.ImageUtils.loadTexture(imagesArray[2]);
		material = new THREE.MeshPhongMaterial({
	    	color: new THREE.Color("rgb(125,125,125)"),
	    	ambient: new THREE.Color("rgb(125,125,125)"),
	    	specular: new THREE.Color("rgb(169,119,70)"),
	    	bumpMap: bump,
	    	bumpScale: 1,
	    	shininess: 8,
	    	map: map
	    });
		break;

		case 'grid':
		var map = THREE.ImageUtils.loadTexture(imagesArray[0]);
			map.wrapS = THREE.RepeatWrapping;
			map.wrapT = THREE.RepeatWrapping;
			map.repeat.x = 12;
			map.repeat.y = 12;

		 material = new THREE.MeshLambertMaterial({
	    	color: new THREE.Color("rgb(125,125,125)"),
	    	ambient: new THREE.Color("rgb(125,125,125)"),
	    	specular: new THREE.Color("rgb(255,255,255)"),
	    	map: map,
	    	transparent: true
	    });
		break;

	    default:
	    	material =  new THREE.MeshBasicMaterial();
	    	material.depthTest = true;
	    	material.depthWrite = true;
	    break;
	}
	material.name = materialName;
	material.defaultEmissive = material.emissive;
	material.maxOpacity = material.opacity;

	return material;
}

function RadialGradientMaterial (){
    var canvas = document.createElement( 'canvas' );
    canvas.width = canvas.height = 128;
    var context = canvas.getContext( '2d' );
    var gradient = context.createRadialGradient( canvas.width / 2,
        canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
    gradient.addColorStop( 0, 'rgba(255, 120, 0, 1)' );
    gradient.addColorStop( 1, 'rgba(0, 0, 0, 0)' );
    context.fillStyle = gradient;
    context.fillRect( 0, 0, canvas.width, canvas.height );
    var shadowTexture = new THREE.Texture( canvas );
    shadowTexture.needsUpdate = true;
    return new THREE.MeshPhongMaterial({
        map: shadowTexture,
        specular: new THREE.Color("rgb(0,80,60)"),
        //vertexColors: THREE.VertexColors,
       // envMap: textureCube,
        refractionRatio: 0.985,
        reflectivity: 0.99,
        shininess: 30,
        transparent: true,
        //opacity: 0.61
    });
}

/*material = new THREE.MeshPhongMaterial({
    color: new THREE.Color("rgb(255,255,255)"),
    specular: new THREE.Color("rgb(0,80,60)"),
    vertexColors: THREE.VertexColors,
    envMap: textureCube,
    refractionRatio: 0.985,
    reflectivity: 0.99,
    shininess: 30,
    transparent: true,
    opacity: 0.61*/

