
function expEditor(thisObj){

	 this.project = app.project;


	if(app.project.activeItem !== null){
		this.selectedComp = project.activeItem;
		this.selectedCompIndex = getIndexfromName(selectedComp.name);	
		this.selectedLayers = project.item(selectedCompIndex).selectedLayers;
		this.selectedProperties = project.item(selectedCompIndex).selectedProperties;
		this.currentExpression = this.selectedProperties[0].expression;
	}else{
		alert("Please select a Layer Property first");
	}

	


	function bakeExpression(expression){
		this.selectedProperty = selectedProperties[0];
		alert(this.selectedProperty.name);
		this.selectedProperty.expression = expression;

	}

	function getIndexfromName(_name){
	    for(var i=1;i<project.items.length+1;i++){
	        var currComp = project.item(i);
	        if (currComp.name == _name){
	            //alert(currComp.name +" " + project.item(i).name + " " + i);
	            return i;
	        }
	    }
	}

	this.buildUI = function(thisObj){

		alert(selectedProperties[0].expression);
		var pal =  (thisObj instanceof Panel) ? thisObj: new Window("palette", "Expression Editor", undefined, {resizable:true} );

		//resource specs
		var res = 
		"group { orientation:'column', alignment:['left', 'top'], alignChildren:['right', 'top'], \
			gr_Actions: Group { \
				runBtn: Button { text:'Apply', preferredSize:[50,20]} \
			}, \
			gr_Editor: Group { \
				editField : EditText {text:'" + this.currentExpression.toString() + "', properties: {multiline:true}, enterKeySignalsOnChange:true, preferredSize:[250,500], scrollable:true, alignChildren:['top','left']} \
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
			alert("hola");
			bakeExpression(pal.grp.gr_Editor.editField.text);

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


