define([], function(){
    var events = {};

    events.AddButton = function(btn){
        var b = $('<input type="button" class="'+btn.class+'" id="'+btn.id+'" value="'+btn.text+'"/>');
        $("#cameraButtons").append(b);
        if(btn.once)$("#"+btn.id).one("click",btn.function);
        else $("#"+btn.id).on("click",btn.function);
    };

    events.RemoveElementByID = function(id){
        $("#"+id).off("click").remove();
    };

    events.EmptyElementByID = function(id){ $("#"+id).empty(); };

    events.UnbindAll = function(){ $("body >* ").off(); };

    return events;
});