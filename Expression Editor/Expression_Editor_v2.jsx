
function expEditor(thisObj){

	var project = app.project;

	var selectedComp = project.activeItem;
	var selectedCompIndex = getIndexfromName(selectedComp.name);	
	var selectedLayers = project.item(selectedCompIndex).selectedLayers;
	var selectedProperties = project.item(selectedCompIndex).selectedProperties;

	function bakeExpression(expression){
		this.selectedProperty = selectedProperties;
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

		var pal =  (thisObj instanceof Panel) ? thisObj: new Window("palette", "Title", undefined, {resizable:true} );

		//resource specs
		var res = 
		"group { orientation:'column', alignment:['left', 'top'], alignChildren:['right', 'top'], \
			gr_Actions: Group { \
				runBtn: Button { text:'run', preferredSize:[25,20]} \
			}, \
			gr_Editor: Group { \
				editField : EditText {text:' 0', properties: {multiline:true}, enterKeySignalsOnChange:true, preferredSize:[100,200], scrollable:true, alignChildren:['top','left']} \
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
			bakeExpression(pal.grp.gr_Editor.text);

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


