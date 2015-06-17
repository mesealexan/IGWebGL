fn getCamera cam =
(
	local count = cam.position.controller.keys.count
	local lastFrame = cam.position.controller.keys[count].time
	local cameraType = classOf(cam)
	
	output_name = getSaveFileName types: "json(*.JSON)"
	output_file = createfile output_name	
	
	format  "{\n\t\"type\": \"%\"," cameraType to:output_file 	
	format  "\n\t\"fps\": 30," to:output_file 
	format  "\n\t\"frames\": [\n" to:output_file 
	
	for i = 0 to lastFrame do(	
		sliderTime = i
		format "\t\t{\n\t\t\"camera\" : {\"x\":%, \"y\":%, \"z\":%},\n" cam.pos.x cam.pos.y cam.pos.z to:output_file
		
		if cameraType == Targetcamera then
		(
		format "\t\t\"target\" : {\"x\":%, \"y\":%, \"z\":%},\n" cam.Target.pos.x cam.Target.pos.y cam.Target.pos.z to:output_file 
		format "\t\t\"rollAngle\" : %,\n" cam.controller.roll_angle to:output_file 
		)
		else format "\t\t\"quaternion\" : {\"x\":%, \"y\":%, \"z\":%, \"w\":%},\n" cam.rotation.x cam.rotation.y cam.rotation.z cam.rotation.w to:output_file 
		
		format "\t\t\"fov\" : %\n\t\t}" cam.fov to:output_file 
		if i < lastFrame then format ",\n"  to:output_file else format "\n\t]\n}" to:output_file
	)
	
	Close output_file
)

cam = selection[1]

--check is a camera is selected
if classOf(cam) != Targetcamera and classOf(cam) != Freecamera then 
	messageBox "Error: Please select a camera."
else getCamera(cam)