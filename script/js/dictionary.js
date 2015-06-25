var camera_frames = {
	animation_1:{ from: 0, to: 158},
	animation_2:{ from: 158, to: 190},
	animation_3:{ frame: 191, speed: 0.1},
	animation_4:{ frame: 192, speed: 0.1},
	animation_5:{ frame: 193, speed: 0.1},
	animation_6:{ frame: 194, speed: 0.1}
}
var windowFadeTime = 70;
var container, camera, scene, renderer, keyboard, frameID, controls;
var camNear = 20, camFar = 6000, fov = 45;

var hammer;
var bmap;
var cameraDestinationFrame, cameraTweenSpeed;
var animation_interval;
var initialMousePos = {};
var zoomedOnSlice = undefined;
var cardinal1materials, cardinal2materials, sliceMaterials;
var windowHorizontal = {}, windowVertical = {}, slice = {};
var textureFlare1, textureFlare2, textureFlare3, textureFlare4, textureFlare5, textureFlare6;
