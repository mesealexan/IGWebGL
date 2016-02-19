define([/*"howler",*/ "underscore", "buzz"], function(/*howler,*/ underscore, buzz){
    var audio = {
      loader: undefined,
      audioArrIndex: 0
    };

    audio.sounds = {};
    //Howler.iOSAutoEnable = true;

    function cleanName(name){//removes dashes
        return name.replace(/-/g, "");
    }

    function returnFormatsArray(name, mediaFolderUrl){
        var pre = mediaFolderUrl+"/audio/" + name;
        return [ pre + ".mp3", pre + ".ogg", pre + ".m4a" ];
    }

    function loadSound ( arr, onComp, mediaFolderUrl ) {
      var url;

      if( !arr || !( url = arr [ audio.audioArrIndex ] ) ) {
        audio.loader.OnLoadProgress();
        audio.audioArrIndex = 0;
        if( onComp ) onComp();
        return;
      }

      if( audio.sounds[ cleanName ( url ) ] ) {
          audio.audioArrIndex++;
          loadSound(arr, onComp);
          return;
      }

      var sound = new buzz.sound(mediaFolderUrl+ "/audio/" + url, { formats: [ "mp3", "ogg", "m4a" ] });

      sound.bind("loadeddata", function() {
        audio.sounds[ cleanName(url) ] = sound;
        audio.audioArrIndex++;
        audio.loader.OnLoadProgress();
        loadSound(arr, onComp, mediaFolderUrl);
      });
    }

    audio.CleanHyphens = cleanName;

    audio.LoadAll = function( arr, loader ) {
        audio.loader = loader;
        audio.audioArrIndex = 0;
        loadSound(arr, loader.OnFinishedLoadingAssets, loader.mediaFolderUrl);
    };

    audio.LoadExternal = function (name, mediaFolderUrl, onComp) {
      var sound = new buzz.sound(mediaFolderUrl+ "/audio/" + name, { formats: [ "mp3", "ogg", "m4a" ] });
      sound.bind("loadeddata", function() {
        audio.sounds[ cleanName(name) ] = sound;
        if(onComp) onComp(sound);
        return sound;
      });
    };

    audio.StopAll = function () {
      _.each( audio.sounds, function ( s ) {
          buzz.all().stop();
      });
    };

    audio.ToggleMute = function () {
      buzz.all().toggleMute();
    };

    return audio;
});
