
function expEditor(thisObj){


	 this.project = app.project;


	 this.compErr = "Please select a Composition first";
	 this.layerErr = "Please select a Layer Property first";
	 this.expErr = "The selected property contains no expression";


	 this.checkActiveItem = function(){
	 	return (this.project.activeItem instanceof CompItem);
	 };


	 this.getSelectedProperty = function(){
	 	var selectedComp = project.activeItem;

	 	if(this.checkActiveItem(selectedComp)){

			 this.mySelectedProperties = selectedComp.selectedProperties;

			 if(selectedComp.selectedProperties.length>0){
			 	this.selectedProperty = mySelectedProperties[0];
			 	this.selectedPropertyName = selectedProperty.name;
			 	return selectedProperty;
			 }else{
			 	alert(layerErr);
			 }
		}else{
			alert(compErr);
			return null;
		}
	 };

	 function getSelectedPropertyName(){
	 	var selectedComp = app.project.activeItem;

	 	if(this.checkActiveItem(selectedComp)){

			this.mySelectedProperties = selectedComp.selectedProperties;

			if(selectedComp.selectedProperties.length>0){
				this.selectedProperty = mySelectedProperties[0];
				this.selectedPropertyName = selectedProperty.name;
				return selectedPropertyName;
			}
		}else{
			return null;
		}
	 };


	 this.getExpression = function(){
	 	var selectedProperty = getSelectedProperty();

		if(selectedProperty==null || selectedProperty.expressionEnabled == false){
			return " ";
			alert(expErr);
		}else{
			return selectedProperty.expression;
		}
	};


	this.bakeExpression = function(expression){
		if(app.project.activeItem !== null){
			var selectedProperty = getSelectedProperty();
		}else{
			alert(layerErr);
		}

		selectedProperty.expression = expression;
	};


	function getIndexfromName(_name){
	    for(var i=1;i<project.items.length+1;i++){
	        var currComp = project.item(i);
	        if (currComp.name == _name){
	            //alert(currComp.name +" " + project.item(i).name + " " + i);
	            return i;
	        }
	    }
	};

	this.buildUI = function(thisObj){

		// alert(selectedProperties[0].expression);
		var pal =  (thisObj instanceof Panel) ? thisObj: new Window("palette", "Expression Editor", undefined, {resizable:true}  );

		//resource specs
		var res = 
		"group { orientation:'column', alignment:['left', 'top'], alignChildren:['right', 'top'], \
			gr_Actions: Group { orientation:'row', \
				getBtn: Button { text:'Get', preferredSize:[50,20]}, \
				clearBtn: Button { text:'Clear', preferredSize:[50,20]}, \
				runBtn: Button { text:'Apply', preferredSize:[50,20]} \
			}, \
			gr_Editor: Group { orientation:'column', \
				infoField : StaticText {text:'current Property: ', alignment:['left','top'], characters: 30}, \
				editField : EditText {text:' ', properties: {multiline:true}, enterKeySignalsOnChange:true, preferredSize:[300,500], scrollable:true, alignChildren:['top','left']} \
			} \
		}";

		pal.grp = pal.add(res); //add res to the panel

		//Panel Layout
		pal.layout.layout(true);
		pal.grp.minimumSize = pal.grp.size;
		pal.layout.resize();
		pal.onResizing = pal.onResize = function(){this.layout.resize()};

		//CALLBACKS
		pal.grp.gr_Actions.runBtn.onClick = function(){
			pal.grp.gr_Editor.infoField.text = "Current Property: " + getSelectedPropertyName();
			bakeExpression(pal.grp.gr_Editor.editField.text);
		}

		pal.grp.gr_Actions.getBtn.onClick = function(){
			pal.grp.gr_Editor.infoField.text = "Current Property: " + getSelectedPropertyName();
			pal.grp.gr_Editor.editField.text = getExpression();
			pal.grp.gr_Actions.getBtn.value = false;
			$. writeln(app.project);
		}

		pal.grp.gr_Actions.clearBtn.onClick = function(){
			var selectedProperty = getSelectedProperty();
			app.beginUndoGroup("Clear Expression");
			selectedProperty.expression = "";
			pal.grp.gr_Editor.infoField.text = "Current Property: " + getSelectedPropertyName();
			pal.grp.gr_Editor.editField.text = "";
			app.endUndoGroup();
		}

		return pal;

	} //end buildUI

	var myScriptPal = buildUI(thisObj);
	if((myScriptPal != null) && (myScriptPal instanceof Window)){
		myScriptPal.center();
		myScriptPal.show();
	} 
	
} // end main function

 expEditor(this);


