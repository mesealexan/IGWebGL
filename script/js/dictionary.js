var camera_frames = {
	animation_1:{ from: 0, to: 158},
	animation_2:{ from: 158, to: 190},
	animation_3:{ frame: 191, speed: 0.05},
	animation_4:{ frame: 192, speed: 0.05},
	animation_5:{ frame: 193, speed: 0.05},
	animation_6:{ frame: 194, speed: 0.05}
}

var camNear = 20, camFar = 6000, fov = 45;

//color for selected slice pieces
var sliceSelectedC = (0x3498db);

//opacity is modified every x ms
var windowFadeTick = 45;
//opacity is modified by x per tick
var windowFadeStep = 0.08;

var textureFlare1, textureFlare2, textureFlare3, textureFlare4, textureFlare5, textureFlare6;
var container, camera, scene, renderer, keyboard, frameID, controls;
var windowHorizontal = {}, windowVertical = {}, slice = {};
var cardinal1materials, cardinal2materials, sliceMaterials;
var cameraDestinationFrame, cameraTweenSpeed;
var zoomedOnSlice = undefined;
var initialMousePos = {};
var animation_interval;
var textureCube;
var hammer;
var bmap;
