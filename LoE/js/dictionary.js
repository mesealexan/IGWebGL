var camera_frames = {
	//animation_1:{ from: 320, to: 321}
	animation_1:{ from: 0, to: 500}
}

var camNear = 1000, camFar = 16500, fov = 45, fovModifier = 0, aspectRatio;
var cameraDestinationFrame = 499, cameraTweenSpeed = 2;
var tamburRotateTime = 2666;
var coatingStart = 1.501;
var coatingEnd = 1.5;
var coatingTime = 4780; 
var backgroundBlendSpeed = 500;

//var textureFlare1, textureFlare2, textureFlare3, textureFlare4, textureFlare5, textureFlare6;
var _window = {}, text = {}, rotator = {}, rail = {}, plane = {}, tamburHolder = {}, 
	backgroundPlane = {}, tambur_a = {}, tambur_b = {}, fixed_glass = {}, mobile_glass = {}, 
	pouring = {}, bck_1 = {}, bck_2 = {}, bck_3 = {}, window_shadow = {};
var animation_interval, glass_animation_interval, window_animation_interval;
var container, camera, scene, renderer, keyboard, frameID, controls;
var cold_t, hot_t, mixed_t, coat1_t;
var initialMousePos = {};
var textureCube;
var hammer;
var bmap;
