animationHandler.prototype = new genericHandler();
var ah1 = new animationHandler();
var ah2 = new animationHandler();
var ah3 = new animationHandler();

function animationHandler(){
	var mesh;
	var loop = false;

	this.setMesh = function(m) {
        if(m.constructor === Array){
            mesh = [];
            for (var x in m) mesh.push(x.mesh);
        }
        else mesh = m.mesh;
    }

	this.play = function(from, to){
		this.basePlay(from, to);
	}

	this.loop = function(from, to){
		loop = true;
		this.basePlay(from, to);
	}

	this.update = function () {
		if(this.checkPlayback(this.from, this.to)){			
			mesh.morphTargetInfluences[ this.frame - 1 ] = 0;
			mesh.morphTargetInfluences[ this.frame ] = 1;
			mesh.morphTargetInfluences[ this.frame + 1 ] = 0;
		}
		else { 			
			if(loop){
				this.stop();
				mesh.morphTargetInfluences[ this.to ] = 0; 
				mesh.morphTargetInfluences[ this.from ] = 1; 
				this.basePlay(this.from, this.to + 1);
			}
			else this.stop();
		} //reached the end
	}
}