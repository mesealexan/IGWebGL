animationHandler.prototype = new genericHandler();
var ah1 = new animationHandler();
var ah2 = new animationHandler();
var ah3 = new animationHandler();

function animationHandler(){
	var meshes = [];
	var loop = false;

	this.setMesh = function(m) {
        if(m.constructor === Array)
            for(var i = 0; i < m.length; i++)
                meshes.push(m[i].mesh);
        else meshes.push(m.mesh);
    };

	this.play = function(from, to){
		this.basePlay(from, to);
	};

	this.loop = function(from, to){
		loop = true;
		this.basePlay(from, to);
	};

	this.update = function () {
		if(this.checkPlayback(this.from, this.to)){
            for(var i = 0; i < meshes.length; i++){
                meshes[i].morphTargetInfluences[ this.frame - 1 ] = 0;
                meshes[i].morphTargetInfluences[ this.frame ] = 1;
                meshes[i].morphTargetInfluences[ this.frame + 1 ] = 0;
            }
		}
		else { 			
			if(loop){
				this.stop();
                for(var i = 0; i < meshes.length; i++){
                    meshes[i].morphTargetInfluences[ this.to ] = 0;
                    meshes[i].morphTargetInfluences[ this.from ] = 1;
                }
				this.basePlay(this.from, this.to + 1);
			}
			else this.stop();
		} //reached the end
	}
}