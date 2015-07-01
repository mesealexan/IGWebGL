var camera_frames = {
	animation_1:{ from: 0, to: 352}
}

var camNear = 20, camFar = 16500, fov = 45, fovModifier = 0, aspectRatio;

//color for selected slice pieces
var sliceSelectedC = (0x3498db);

//opacity is modified every x ms
var windowFadeTick = 45;
//opacity is modified by x per tick
var windowFadeStep = 0.08;

//var textureFlare1, textureFlare2, textureFlare3, textureFlare4, textureFlare5, textureFlare6;
var container, camera, scene, renderer, keyboard, frameID, controls;
var _window = {}, text = {}, rotator = {}, rail = {}, plane = {};
var cameraDestinationFrame, cameraTweenSpeed;
var zoomedOnSlice = undefined;
var initialMousePos = {};
var animation_interval;
var textureCube;
var hammer;
var bmap;
