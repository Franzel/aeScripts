/*
This scripts selects source items on the project window
from selected layers on any comp.

Finds the active comp, iterates through all selected layers
and turns their source to selected=true

Francisco Zamorano
September 2016
*/

function selectSource(){

	var selectSource = this;

	this.buildUI = function(thisObj){

		var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Expression Editor", undefined, {resizeable:true});

		//resource specs
		var res =
		"group { orientation:'column', alignment:['fill', 'top'], alignChildren:['fill', 'top'], \
			gr_Actions: Panel { orientation:'row', alignChildren:['fill', 'top'],\
				findBtn: Button { text:'Find Source', preferredSize:[100,20]}, \
			},\
		}";

		pal.grp = pal.add(res);

		//help tips
		pal.grp.gr_Actions.findBtn.helpTip = "finds and selects layer source in project";
		//callbacks
		pal.grp.gr_Actions.findBtn.onClick = function(){
			app.beginUndoGroup("Select Source");
			runSelectSource();
			app.enUndoGroup("Select Source");
		};

		//show UI
		if (pal instanceof Window){
			pal.center();
			pal.show();
		}else{
			pal.layout.layout(true);
		}
	};//end buildUI

	runSelectSource =function(){
		if(app.project && app.project.activeItem && app.project.activeItem instanceof CompItem && app.project.activeItem.selectedLayers.length>0){
			var project= app.project;
			var selComp = project.activeItem; //get the active comp
			for(var i=0;i<selComp.selectedLayers.length;i++){
				//for all selected layers, find and select source on project window
				selComp.selectedLayers[i].source.selected=true;
			}
		}else{
			alert("Please select some layers first");
		}
	};

	this.run = function(thisObj){
		this.buildUI(thisObj);
	};
}//end selectSource (main)

new selectSource().run(this);