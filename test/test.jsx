function copyParameter(){

	var copyParameter = this;
	var useWidth = true;

	this.buildUI = function(thisObj){

		var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Expression Editor", undefined, {resizeable:true});

		//resource specs
		var res =
		"group { orientation:'column', alignment:['fill', 'top'], alignChildren:['fill', 'top'], \
			gr_Actions: Panel { orientation:'column', alignChildren:['fill', 'top'],\
				fitText: StaticText{text:'Fit to current:'},\
				fitW: RadioButton { text:'Width', value:true}, \
				fitH: RadioButton { text:'Height', value:false}, \
				findBtn: Button { text:'Replace Source', preferredSize:[100,20]}, \
			},\
		}";

		pal.grp = pal.add(res);

		//help tips
		pal.grp.gr_Actions.findBtn.helpTip = "replace layer source maintaining current scale";
		//callbacks
		pal.grp.gr_Actions.findBtn.onClick = function(){
			app.beginUndoGroup("Replace Source and Scale");
			runSelectSource();
			app.endUndoGroup();
		};
		pal.grp.gr_Actions.fitW.onClick = function(){
			if (!(this.value)){
				useWidth = false;
			}else{
				useWidth = true;
			}
		};
		pal.grp.gr_Actions.fitH.onClick = function(){
			if (!(this.value)){
				useWidth = true;
			}else{
				useWidth = false;
			}
		};

		//show UI	
		if (pal instanceof Window){
			pal.center();
			pal.show();
		}else{
			pal.layout.layout(true);
		}
	};//end buildUI


	runCopyParameter =	function(){

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


  //Get the selected property and parameter
  //for each selected property, check if any of its parameters is selected =true
  //if so, copy name of Effect, name of Parameter and its value and save them for later
  for (var i = 1; i < numParameters +1; i++) {
    if(selComp.selectedLayers[0].selectedProperties[0].property(i).selected == true){
      selEffectName = selEffect.name;
      selEffectValue = selEffect.property(i).value;
      selParameterName = selEffect.property(i).name;
    }
  }

  alert ("You selected layer " + selEffectName + ", " + selParameterName + "\n" + "Value of: " + selEffectValue + "\n" + "Will be copied to " + app.project.activeItem.selectedLayers.length + " layers");

		}else{
			alert("Please select some layers first");
		}

	}




	this.run = function(thisObj){
		this.buildUI(thisObj);
	};

}//end selectSource (main)

new copyParameter().run(this);