
function expEditor(thisObj){
	this.buildUI = function(thisObj){

		var pal =  (thisObj instanceof Panel) ? thisObj: new Window("palette", "Title", undefined, {resizable:true} );

		//resource specs
		var res = 
		"group { orientation:'column', alignment:['left', 'top'], alignChildren:['right', 'top'], \
			gr_Actions: Group { \
				runBtn: Button { text:'run', preferredSize:[25,20]} \
			}, \
			gr_Editor: Group { \
				editField : EditText {text:' 0', preferredSize:[100,200], alignment:['top','center']} \
			} \
		}";

		


		pal.grp = pal.add(res); //add res to the panel


		pal.layout.layout(true);
		pal.grp.minimumSize = pal.grp.size;
		

		pal.layout.resize();
		pal.onResizing = pal.onResize = function(){this.layout.resize()};

		return pal;

	} //end buildUI




	var myScriptPal = buildUI(thisObj);
	if((myScriptPal != null) && (myScriptPal instanceof Window)){
		myScriptPal.center();
		myScriptPal.show();
	} 
	
} // end main function

 expEditor(this);


