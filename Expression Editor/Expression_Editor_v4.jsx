
function expEditor()
{
	var expEditor = this;

	this.buildUI = function (thisObj)
	{
		// dockable panel or palette
		var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", this.scriptTitle, undefined, {resizeable:false});

		//resource specs
		var res = 
		"group { orientation:'column', alignment:['left', 'top'], alignChildren:['right', 'top'], \
			gr_Actions: Group { orientation:'row', \
				getBtn: Button { text:'Get', preferredSize:[50,20]}, \
				clearBtn: Button { text:'Clear', preferredSize:[50,20]}, \
				runBtn: Button { text:'Apply', preferredSize:[50,20]} \
			}, \
			gr_Editor: Group { orientation:'column', \
				infoField : StaticText {text:'Current Property: ', alignment:['left','top'], characters: 30}, \
				editField : EditText {text:' ', properties: {multiline:true}, enterKeySignalsOnChange:true, preferredSize:[300,500], scrollable:true, alignChildren:['top','left']} \
			} \
		}";
		pal.grp = pal.add(res);

		// Callbacks
		pal.grp.gr_Actions.getBtn.onClick = function ()
		{
			expEditor.getSelectedProperty();
			pal.grp.gr_Editor.infoField.text = "Current Property: " + expEditor.getSelectedProperty().name;
			pal.grp.gr_Editor.editField.text = expEditor.getExpression();
		};

		pal.grp.gr_Actions.runBtn.onClick = function ()
		{
			pal.grp.gr_Editor.infoField.text = "Current Property: " + expEditor.getSelectedProperty().name;
			expEditor.bakeExpression(pal.grp.gr_Editor.editField.text);
		};

		// pal.grp.gr_Actions.clearBtn.onClick = function(){
		// 	var selectedProperty = getSelectedProperty(pal);
		// 	app.beginUndoGroup("Clear Expression");
		// 	selectedProperty.expression = "";
		// 	pal.grp.gr_Editor.infoField.text = "Current Property: " + getSelectedProperty(pal).name;
		// 	pal.grp.gr_Editor.editField.text = "";
		// 	app.endUndoGroup();
		// }

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
	 				$.writeln(app.project.activeItem.selectedProperties.length);
	 				$.writeln(app.project.activeItem.selectedLayers[0].selectedProperties[0].name);
	 				$.writeln(app.project.activeItem.selectedLayers[0].selectedProperties[0].expression);
	 				return app.project.activeItem.selectedLayers[0].selectedProperties[0];
	 			}else{
	 				$.writeln("This is not a valid property");
	 			}
			}else{
				$.writeln("Select a Property first");
			}
		}else{
			$.writeln("No Composition is selected");
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
