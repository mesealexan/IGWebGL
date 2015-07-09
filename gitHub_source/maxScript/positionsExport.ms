fn writeJSON sel =
(	
	--detect if one or more objects have been selected
	if classof(sel) != ObjectSet then 
	(
		obj = sel
		sel = #()
		append sel obj
	)

	output_name = getSaveFileName types: "json(*.JSON)"
	output_file = createfile output_name
	
	format  "{\n\t\"positions\": [\n" to:output_file 
	
	for i = 1 to sel.count do
	(	
		format "\t\t{\n\t\t\"name\": \"%\",\n" sel[i].name to:output_file
		format "\t\t\"position\" : {\"x\":%, \"y\":%, \"z\":%},\n" sel[i].pos.x sel[i].pos.y sel[i].pos.z to:output_file
		format "\t\t\"rotation\" : {\"x\":%, \"y\":%, \"z\":%}\n" (sel[i].rotation as eulerangles).x (sel[i].rotation as eulerangles).y (sel[i].rotation as eulerangles).z  to:output_file 		
		format "\t\t}" to:output_file 
		
		if i < sel.count then format ",\n"  to:output_file 
		else format "\n\t]\n}" to:output_file
	)
	
	Close output_file
)

writeJSON($)