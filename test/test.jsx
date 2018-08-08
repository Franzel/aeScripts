function parameterValueCloner(){

	var parameterValueCloner = this;

	this.buildUI = function(thisObj){

		var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Expression Editor", undefined, {resizeable:true});

		//resource specs
		var res =
		"group { orientation:'column', alignment:['fill', 'top'], alignChildren:['fill', 'top'], \
		gr_Actions: Panel { orientation:'column', alignChildren:['fill', 'top'],\
			copyBtn: Button { text:'Copy Value', preferredSize:[100,20]}, \
			applyBtn: Button { text:'Apply Value', preferredSize:[100,20]}, \
		},\
		}";

		pal.grp = pal.add(res);

		//help tips
		pal.grp.gr_Actions.copyBtn.helpTip = "copy parameter";
		//callbacks
		pal.grp.gr_Actions.copyBtn.onClick = function(){
			app.beginUndoGroup("Copy Parameter");
			getMasterProperty();
			app.endUndoGroup();
		};

		pal.grp.gr_Actions.applyBtn.onClick = function(){
			app.beginUndoGroup("Paste Parameter");
			copyToSelectedLayers();
			app.endUndoGroup();
		};



		//show UI	
		if (pal instanceof Window){
			pal.center();
			pal.show();
		}else{
			pal.layout.layout(true);
		}
	};//end buildUI


	this.getMasterProperty = function(){
		if(app.project && app.project.activeItem && app.project.activeItem instanceof CompItem && app.project.activeItem.selectedLayers.length>0){
			var project= app.project;
			var selComp = project.activeItem; //get the active comp

			var selLayer = selComp.selectedLayers[0];
			var selEffect = selLayer.selectedProperties[0];
			var numParameters = selEffect.numProperties;

			//make sure we clear variables every time before assigning values
			var selEffectName = null;
			var selEffectValue = null;
			var selEffectIndex = null;
			var targetProp = null;

			//Get the selected property and parameter
			//for each selected property, check if any of its parameters is selected =true
			//if so, copy name of Effect, name of Parameter and its value and save them for later
			for (var i = 1; i < numParameters +1; i++) {
				if(selComp.selectedLayers[0].selectedProperties[0].property(i).selected == true){
					targetProp = selComp.selectedLayers[0].selectedProperties[0].property(i);
					selEffectName = selEffect.name;
					selEffectValue = selEffect.property(i).value;
					selParameterName = selEffect.property(i).name;
			 	}
			}

  			alert ("You selected layer " + selEffectName + ", " + selParameterName + "\n" + "Value of: " + selEffectValue + "\n" + "Will be copied to " + app.project.activeItem.selectedLayers.length + " layers");
			return targetProp;
		}
		else{
			alert("Please select some layers first");
		}
	} //end getMasterProperty

	this.copyToSelectedLayers = function(){
		for(var i=0;i<app.project.activeItem.selectedLayers.length;i++){

			$.writeln(" ----------------------------- ");

			var nProps = selComp.selectedLayers[i].property("Effects").numProperties; //get number of effects for this layer
			$.write("LAYER ");
			$.writeln(selComp.selectedLayers[i].name);

			for (var j=1; j < nProps+1; j++){
	      		$.write("   " + selComp.selectedLayers[i].property("Effects").property(j).name);
	      		var nParameters = selComp.selectedLayers[i].property("Effects").property(j).numProperties; //get number of parameters for each effect
	      		$.writeln(", contains " + nParameters + " parameters");

				//iterate through all the parameters on this effect
		      	for (var k = 1; k < nParameters+1; k++){ 
			      	$.write("       ");
			      	$.write(selComp.selectedLayers[i].property("Effects").property(j).property(k).name);
			      	$.writeln(" : " + selComp.selectedLayers[i].property("Effects").property(j).property(k).value);

			        //if name of the effect matches the original selection 
			        if(selComp.selectedLayers[i].property("Effects").property(j).name == selEffectName){
			          //if name of the parameter matches the original selection 
			          	if(selComp.selectedLayers[i].property("Effects").property(j).property(k).name == selParameterName){
			          		$.writeln(" <-- target"); 
			            	selComp.selectedLayers[i].property("Effects").property(j).property(1).setValue(getMasterProperty.value); // apply the value of original selection
			        	}
			    	}
				}

				$.writeln(" ---- ");
			}

			$.writeln(" ----------------------------- ");
		}//end i for
	}// end copyToSelectedLayers

	this.run = function(thisObj){
		this.buildUI(thisObj);
	};

}//end parameterValueCloner (main)

new parameterValueCloner().run(this);




