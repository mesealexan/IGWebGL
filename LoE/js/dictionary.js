var camera_frames = {
	animation_1:{ from: 0, to: 500}
}

var camNear = 1000, camFar = 16500, fov = 45, fovModifier = 0, aspectRatio;
var tamburRotateTime = 2666;
var coatingTime = 5000; 

//var textureFlare1, textureFlare2, textureFlare3, textureFlare4, textureFlare5, textureFlare6;
var _window = {}, text = {}, rotator = {}, rail = {}, plane = {}, tamburHolder = {}, 
	tambur_a = {}, tambur_b = {}, fixed_glass = {}, mobile_glass = {},pouring = {};
var container, camera, scene, renderer, keyboard, frameID, controls;
var cameraDestinationFrame = 499, cameraTweenSpeed = 10;
var zoomedOnSlice = undefined;
var initialMousePos = {};
var animation_interval, glass_animation_interval;
var textureCube;
var hammer;
var bmap;
