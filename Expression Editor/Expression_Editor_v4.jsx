
function expEditor()
{
	var expEditor = this;

	//messages
	this.errNoValidProp = "This is not a valid property";
	this.errNoSelectedProp = "Select a Property first";
	this.errNoSelectedComp = "No Composition is selected"

	this.buildUI = function (thisObj)
	{
		// dockable panel or palette
		var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", this.scriptTitle, undefined, {resizeable:false});

		//resource specs
		var res = 
		"group { orientation:'column', alignment:['left', 'top'], alignChildren:['left', 'top'], \
			gr_Actions: Group { orientation:'row', alignChildren:['left', 'top'],\
				getBtn: Button { text:'Get', preferredSize:[50,20]}, \
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

		// show UI
		if (pal instanceof Window){
			pal.center();
			pal.show();
		}else{
			pal.layout.layout(true);
		}
	};

	this.getSelectedProperty = function (){
		// $.writeln(app.project.activeItem.selectedLayers[0].selectedProperties[0].name)

	 	if(app.project && app.project.activeItem && app.project.activeItem instanceof CompItem){

	 		if(app.project.activeItem.selectedProperties.length>0){
	 			if(app.project.activeItem.selectedLayers[0].selectedProperties[0] instanceof Property){
	 				$.writeln("nProps:  " + app.project.activeItem.selectedProperties.length);
	 				// $.writeln("PropertyType:  " + app.project.activeItem.selectedLayers[0].selectedProperties[0]);
	 				$.writeln("PropertyName:  " + app.project.activeItem.selectedLayers[0].selectedProperties[0].name);
	 				$.writeln("PropertyExp:  " + app.project.activeItem.selectedLayers[0].selectedProperties[0].expression);
	 				return app.project.activeItem.selectedLayers[0].selectedProperties[0];
	 			}
	 			else if(app.project.activeItem.selectedLayers[0].selectedProperties[0] instanceof PropertyGroup){
	 				// $.writeln( "PGROUP SELECTED");
	 				// // $.writeln("Property:  " + app.project.activeItem.selectedLayers[0].propertyGroup.name);
	 				// $.writeln("PropertyName:  " + app.project.activeItem.selectedLayers[0].selectedProperties[0].name);
	 				// $.writeln("numProps: " + app.project.activeItem.selectedLayers[0].selectedProperties[0].numProperties);
	 				// $.writeln("isSelected: " + app.project.activeItem.selectedLayers[0].selectedProperties[0].property(1).selected);
	 				// var selProp = app.project.activeItem.selectedLayers[0].selectedProperties[0].property(1).name; // THIS IS CRASHING AE !!!!!!!

	 				var parentProp = app.project.activeItem.selectedLayers[0].selectedProperties[0];
	 				var nProps = parentProp.numProperties;
	 				var targetProp;

	 				for (var i=1; i < nProps+1; i++){
	 					if(parentProp.property(i).selected){
	 						// $.writeln ("GOTCHA!   " + parentProp.property(i).name);
	 						targetProp = parentProp.property(i);
	 					}
	 				}

	 				return targetProp;
	 			}
			}else{
				// $.writeln("Select a Property first");
				alert(this.errNoSelectedProp);
			}
		}else{
			// $.writeln("No Composition is selected");
			alert(this.errNoSelectedComp);
		}
	};

	this.getExpression = function(){
		return expEditor.getSelectedProperty().expression;
	}

	this.bakeExpression = function(_expression){
		expEditor.getSelectedProperty().expression = _expression;
	}

	this.run = function (thisObj){
		this.buildUI(thisObj);
	};

}

// Creates an instance of the main class and run it
new expEditor().run(this);
