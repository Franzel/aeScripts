/*
This script provides a window with a text edit field to copy,
edit and apply expressions to a selected Property.

Francisco Zamorano
July 2015
*/

function expEditor()
{
	var expEditor = this;

	//messages
	this.errNoValidProp = "This is not a valid property";
	this.errNoSelectedProp = "Select a Property first";
	this.errNoSelectedComp = "No Composition is selected";
	this.errMultipleSelectedProp = "Please select only one property";

	this.buildUI = function (thisObj){

		var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Expression Editor", undefined, {resizeable:true});

		//resource specs
		var res = 
		"group { orientation:'column', alignment:['left', 'top'], alignChildren:['left', 'top'], \
			gr_Actions: Group { orientation:'row', alignChildren:['left', 'top'],\
				getBtn: Button { text:'Get', preferredSize:[50,20]}, \
				getMultiBtn: Button { text:'Apply Multi', preferredSize:[50,20]}, \
				clearBtn: Button { text:'Clear', preferredSize:[50,20]}, \
				runBtn: Button { text:'Apply', preferredSize:[50,20]} \
			}, \
			gr_Editor: Group { orientation:'column', \
				infoField : StaticText {text:'Current Property: ', alignment:['left','top'], characters: 30}, \
				editField : EditText {text:' ', properties: {multiline:true}, enterKeySignalsOnChange:true, preferredSize:[600,500], scrollable:true, alignChildren:['top','left']} \
			} \
		}";
		pal.grp = pal.add(res);

		// Callbacks
		pal.grp.gr_Actions.getBtn.onClick = function ()
		{
			pal.grp.gr_Editor.infoField.text = "Current Property: " + expEditor.getSelectedProperty().name;
			pal.grp.gr_Editor.editField.text = expEditor.getExpression();
		};

		pal.grp.gr_Actions.runBtn.onClick = function ()
		{
			pal.grp.gr_Editor.infoField.text = "Current Property: " + expEditor.getSelectedProperty().name;
			expEditor.bakeExpression(pal.grp.gr_Editor.editField.text);
		};

		pal.grp.gr_Actions.clearBtn.onClick = function(){
			app.beginUndoGroup("Clear Expression");
			pal.grp.gr_Editor.infoField.text = "Current Property: " + expEditor.getSelectedProperty().name;
			expEditor.getSelectedProperty().expression = "";
			app.endUndoGroup();
		}

		pal.grp.gr_Actions.getMultiBtn.onClick = function ()
		{
			//pal.grp.gr_Editor.infoField.text = "Current Property: " + expEditor.getSelectedProperty().name;
			expEditor.bakeMultiple(pal.grp.gr_Editor.editField.text);
		};

		// show UI
		if (pal instanceof Window){
			pal.center();
			pal.show();
		}else{
			pal.layout.layout(true);
		}
	};

	this.getSelectedProperty = function (){
	 	if(app.project && app.project.activeItem && app.project.activeItem instanceof CompItem){
	 		if(app.project.activeItem.selectedProperties.length>0){
	 			if(app.project.activeItem.selectedLayers[0].selectedProperties[0] instanceof Property){
	 				return app.project.activeItem.selectedLayers[0].selectedProperties[0];
	 			}
	 			else if(app.project.activeItem.selectedLayers[0].selectedProperties[0] instanceof PropertyGroup){
	 				var parentProp = app.project.activeItem.selectedLayers[0].selectedProperties[0];
	 				var nProps = parentProp.numProperties;
	 				var targetProp;

	 				for (var i=1; i < nProps+1; i++){
	 					if(parentProp.property(i).selected){
	 						targetProp = parentProp.property(i);
	 					}
	 				}
	 				return targetProp;
	 			}
			}else{
				alert(this.errNoSelectedProp);
			}
		}else{
			alert(this.errNoSelectedComp);
		}
	};

	this.getSelectedPropertyMulti = function (){
	 	if(app.project && app.project.activeItem && app.project.activeItem instanceof CompItem){
	 		if(app.project.activeItem.selectedProperties.length>0){
	 			if(app.project.activeItem.selectedLayers[0].selectedProperties[0] instanceof Property){
	 				return app.project.activeItem.selectedLayers[0].selectedProperties[0];
	 			}
	 			else if(app.project.activeItem.selectedLayers[0].selectedProperties[0] instanceof PropertyGroup){
	 				var parentProp = app.project.activeItem.selectedLayers[0].selectedProperties[0];
	 				var nProps = parentProp.numProperties;
	 				var targetProp;

	 				for (var i=1; i < nProps+1; i++){
	 					if(parentProp.property(i).selected){
	 						targetProp = parentProp.property(i);
	 					}
	 				}
	 				return targetProp;
	 			}
			}else{
				alert(this.errNoSelectedProp);
			}
		}else{
			alert(this.errNoSelectedComp);
		}
	};

	this.getExpression = function(){
		return expEditor.getSelectedProperty().expression;
	}

	this.bakeExpression = function(_expression){
		expEditor.getSelectedProperty().expression = _expression;

	}

	this.bakeMultiple = function(_expression){
		var selLayers = app.project.activeItem.selectedLayers
		
		for(var i=0;i<selLayers.length;i++){
			//$.writeln(selLayers[i].masterPropname);
			var masterProp = expEditor.getSelectedProperty().name.toString();
			$.writeln(masterProp);
			selLayers[i].property(masterProp).expression = _expression;
		}
		// expEditor.getSelectedProperty().expression = _expression;
	}

	this.run = function (thisObj){
		this.buildUI(thisObj);
	};
}//end main

new expEditor().run(this);
