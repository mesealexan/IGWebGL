define([], function(){
    var events = {};

    events.AddButton = function(btn){
        var b = $('<input type="button" class="'+btn.class+'" id="'+btn.id+'" value="'+btn.text+'"/>');

        if(btn.once)$("#cameraButtons").append(b).one("click",btn.function);
        else $("#cameraButtons").append(b).on("click",btn.function);
    };

    events.RemoveElementByID = function(id){
        $("#"+id).off("click").remove();
    };

    events.UnbindAll = function(){ $("body >* ").off(); };

    return events;
});