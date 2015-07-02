fn FirstAndLastFrame cam =
(	
	results = #()
	--XYZ animated position controller
	if classOf(cam.position.controller) == Position_XYZ then 
	(		
		local count = cam.position.controller.keys.count
		append results cam.position.controller.keys[1].time
		append results cam.position.controller.keys[count].time
		return results
	)
	--has a list of subanims
	else if classOf(cam.position.controller) == Position_List then 
	(
		local subanims = getSubAnimNames(cam.position.controller)
		
		--loop subanims
		for i = 1 to subanims.count do
		(
			--has path constraint
			if (subanims[i] == #Path_Constraint) then
			(
				local results = #()
				for j = animationRange.start to animationRange.end do
				(
					sliderTime = j		
					--found first frame
					if (cam.position.controller[i].percent > 0) and (results[1] == undefined) then 
						append results j
					if (cam.position.controller[i].percent == 100) then
						append results j	
				)
				return results
			)
		)
	)
)

fn getCamera cam =
(
	local results = FirstAndLastFrame(cam)
	local firstFrame = results[1]
	local lastFrame = results[2]
	local cameraType = classOf(cam)
	
	--sets fov type to vertical
	cam.fovType = 2
	
	output_name = getSaveFileName types: "json(*.JSON)"
	output_file = createfile output_name
	
	format  "{\n\t\"type\": \"%\"," cameraType to:output_file 	
	format  "\t\"fps\": %,\n" framerate to:output_file 	
	format  "\n\t\"frames\": [\n" to:output_file 
	
	for i = firstFrame to lastFrame do
	(	
		sliderTime = i
		format "\t\t{\n\t\t\"position\" : {\"x\":%, \"y\":%, \"z\":%},\n" cam.pos.x cam.pos.y cam.pos.z to:output_file
		
		if cameraType == Targetcamera then
		(
			format "\t\t\"target\" : {\"x\":%, \"y\":%, \"z\":%},\n" cam.Target.pos.x cam.Target.pos.y cam.Target.pos.z to:output_file 
			format "\t\t\"rollAngle\" : %,\n" cam.controller.roll_angle to:output_file 
		)
		else format "\t\t\"quaternion\" : {\"x\":%, \"y\":%, \"z\":%},\n" (cam.rotation as eulerangles).x (cam.rotation as eulerangles).y (cam.rotation as eulerangles).z  to:output_file 
		
		format "\t\t\"fov\" : %\n\t\t}" cam.curFOV to:output_file 
		
		if i < lastFrame 
			then format ",\n"  to:output_file 
		else format "\n\t]\n}" to:output_file
	)
	
	Close output_file
)

cam = selection[1]

--check is a camera is selected
if classOf(cam) != Targetcamera and classOf(cam) != Freecamera 
	then messageBox "Error: Please select a camera."
else getCamera(cam)