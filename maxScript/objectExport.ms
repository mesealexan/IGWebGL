fn FirstAndLastFrame obj =
(	
	results = #()
	--XYZ animated position controller
	if classOf(obj.position.controller) == Position_XYZ then 
	(		
		local count = obj.position.controller.keys.count
		append results obj.position.controller.keys[1].time
		append results obj.position.controller.keys[count].time
		return results
	)
	--has a list of subanims
	else if classOf(obj.position.controller) == Position_List then 
	(
		local subanims = getSubAnimNames(obj.position.controller)
		
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
					if (obj.position.controller[i].percent > 0) and (results[1] == undefined) then 
						append results j
					if (obj.position.controller[i].percent == 100) then
						append results j	
				)
				return results
			)
		)
	)
)

fn writeJSON obj =
(
	local results = FirstAndLastFrame(obj)
	local firstFrame = results[1]
	local lastFrame = results[2]
	local objClass = classOf(obj)
	local camSelected = false
	
	--if a camera is selected
	if objClass == Targetcamera or objClass == Freecamera then
	(
		camSelected = true
		--sets fov type to vertical
		obj.fovType = 2		
	)
	
	output_name = getSaveFileName types: "json(*.JSON)"
	output_file = createfile output_name
	
	format  "{\n" to:output_file 	
	
	if (camSelected == true) then
	(
		format "\t\"type\": \"%\",\n" objClass to:output_file 
	)	
	
	format  "\t\"fps\": 30,\n" to:output_file 	
	format  "\t\"frames\": [\n" to:output_file 
	
	for i = firstFrame to lastFrame do
	(	
		sliderTime = i
		format "\t\t{\n\t\t\"position\" : {\"x\":%, \"y\":%, \"z\":%},\n" obj.pos.x obj.pos.y obj.pos.z to:output_file
		
		if objClass == Targetcamera then
		(
			format "\t\t\"target\" : {\"x\":%, \"y\":%, \"z\":%},\n" obj.Target.pos.x obj.Target.pos.y obj.Target.pos.z to:output_file 
			format "\t\t\"fov\" : %,\n" cam.curFOV to:output_file 
			format "\t\t\"rollAngle\" : %\n" obj.controller.roll_angle to:output_file 
		)
		else format "\t\t\"quaternion\" : {\"x\":%, \"y\":%, \"z\":%}\n" (obj.rotation as eulerangles).x (obj.rotation as eulerangles).y (obj.rotation as eulerangles).z  to:output_file 
		
		format "\t\t}" to:output_file 
		
		if i < lastFrame then format ",\n"  to:output_file 
		else format "\n\t]\n}" to:output_file
	)
	
	Close output_file
)

obj = selection[1]
writeJSON(obj)