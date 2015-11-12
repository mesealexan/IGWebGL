define(["howler", "underscore"], function(howler, underscore){
    var audio = {};
    audio.sounds = {};

    var audioArrIndex = 0;
    Howler.iOSAutoEnable = true;

    function cleanName(name){//removes dashes
        return name.replace(/-/g, "");
    }

    function returnFormatsArray(name, mediaFolderUrl){
        var pre = mediaFolderUrl+"/audio/" + name;
        return [pre + ".mp3", pre + ".ogg", pre + ".m4a"];
    }

    function loadSound(arr, onComp, mediaFolderUrl){
        var url = undefined;

        if(!arr || !(url = arr[audioArrIndex])){
            audioArrIndex = 0;
            onComp();
            return;
        }

        if(audio.sounds[cleanName(url)]){
            audioArrIndex++;
            loadSound(arr, onComp);
            return;
        }

        var src = returnFormatsArray(url, mediaFolderUrl);
        var sound = new Howl({
            src: src,
            onload: onLoad,
            onstop: onStop
        });

        function onLoad(){
            audio.sounds[cleanName(url)] = sound;
            audioArrIndex++;
            loadSound(arr, onComp, mediaFolderUrl);
        }

        function onStop(){
        }
    }

    audio.LoadAll = function(arr, onComp, mediaFolderUrl){
        audioArrIndex = 0;
        loadSound(arr, onComp, mediaFolderUrl);
    };

    audio.StopAll = function(){_.each(audio.sounds, function(s){
        if(s.playing()){
            var id = s._sounds[0]._id;
            s.stop(id);
        }
    })};

    GlobalFunctions.audio = audio;

    return audio;
});
