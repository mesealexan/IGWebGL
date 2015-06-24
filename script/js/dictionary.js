var camera_frames = {
	animation_1:{ from: 0, to: 158},
	animation_2:{ from: 158, to: 190},
	animation_3:{ frame: 191, speed: 0.1},
	animation_4:{ frame: 192, speed: 0.1},
	animation_5:{ frame: 193, speed: 0.1},
	animation_6:{ frame: 194, speed: 0.1}
}

var container, camera, scene, renderer, keyboard, frameID;
var camNear = 20, camFar = 6000, fov = 45;

var panSlowDown = 3;
var cameraOutOfBoundsReset = 1;
var maxCameraDeviation = 50;

var bmap;
var initialMousePos = {};
var zoomedOnSlice = undefined;
var cardinal1materials, cardinal2materials, sliceMaterials;
var windowHorizontal = {}, windowVertical = {}, slice = {};

var textureFlare1, textureFlare2, textureFlare3;
