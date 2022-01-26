
let trackTypes = [
    "TrackType1",
    "TrackType2",
    "TrackType3",
    "TrackCrossType1",
    "TrackJunctionType1",
    "TrackJunctionType2"
];

TStage.loadTrackData(trackData);


(function() {

    function rotate(dir, button){
        let rot = !!dir ? 45 : -45;
        let selectedTrack = TStage.getSelectedTrack();
        let logdata = {
            id: selectedTrack.id,
            type: "rotate",
            rotation: rot
        }
        if(!!selectedTrack){
            TStage.hookBeforeMod(logdata);
            let _rotation = selectedTrack.shape.getAbsoluteRotation() + rot;
            button.setAttribute("disabled", 1);
            var tween = new Konva.Tween({
                node: selectedTrack.shape,
                duration: .5,
                rotation: _rotation,
                onFinish: () => { 
                    button.removeAttribute("disabled");
                    selectedTrack.rotation = _rotation;
                    TStage.updateInfo(selectedTrack);
                    TStage.hookAfterMod(logdata);
               }
            });
            tween.play();            
            // selectedTrack.shape.rotate(45);
        }
    }

    document.getElementById("bRotateRight").onclick = function(e) {rotate(1,this);}
    document.getElementById("bRotateLeft").onclick = function(e) {rotate(0,this);}
    if(!!document.getElementById("bDelete")){
		document.getElementById("bDelete").onclick = function(e) {if(!!TStage.getSelectedTrack()) TStage.removeTrack(TStage.getSelectedTrack());}
	}
	
	if(!!document.getElementById("bSaveStage")){
		document.getElementById("bSaveStage").onclick = function(e) {
			TStage.saveCurrentStage();
			document.getElementById("bRestoreStage").removeAttribute("disabled");
			console.log(TStage.getSavedTrackData());
		}
	}

	if(!!document.getElementById("bRestoreStage")){
		document.getElementById("bRestoreStage").onclick = function(e) {
			TStage.restoreTrackData();
			document.getElementById("bForward").setAttribute("disabled", 1);
			document.getElementById("bBack").setAttribute("disabled", 1);
		}
	}

	
	if(!!document.getElementById("bBack")){
		document.getElementById("bBack").onclick = function(e) {        
			if(TStage.undo())
				document.getElementById("bForward").removeAttribute("disabled");
			if(TStage.getCurrentIndex() == 0)
				document.getElementById("bBack").setAttribute("disabled", 1);        
		};
	}

	if(!!document.getElementById("bForward")){
		document.getElementById("bForward").onclick = function(e) {
			if(TStage.redo()){
				document.getElementById("bBack").removeAttribute("disabled");
			}
			if(TStage.getCurrentIndex() == TStage.getStageDataHistory().length-1 )
				document.getElementById("bForward").setAttribute("disabled", 1);
		};
	}


	if(!!document.getElementById("addTrackType")){
		let trackSel = document.getElementById("addTrackType");
		trackTypes.forEach(t => {
			var option = document.createElement("option");
			option.value = t;
			option.text = t;
			trackSel.appendChild(option);
		});
	}

	if(!!document.getElementById("bAddTrack")){
		document.getElementById("bAddTrack").onclick = function(e) {
			var button = this;
			button.setAttribute("disabled", 1);
			TStage.addTrack(
				{           
					type: document.getElementById("addTrackType").value || "TrackType1",
					pos: {x:50, y:50},
					width: parseInt(document.getElementById("addTrackWidth").value) || 2,
					height: parseInt(document.getElementById("addTrackHeight").value) || 6  
				}         
			);
			window.setTimeout(e => {
				button.removeAttribute("disabled");
			}, 1000);
		};
	}

 })();