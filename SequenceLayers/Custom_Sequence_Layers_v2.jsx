{
	/*
	This script sequences layers in a specified Comp
	Total sequence time, random amount, stack order are parameters
	It also provides a GUI for direct use through AE menu

	Francisco Zamorano
	June 2015
	*/

	function compareLayers( a, b ) {
		return a.index > b.index;
	}

	function myScript(thisObj){

		// SETUP  ---------------------------------------------------------------------------------------------------------------------
		var project = app.project;

		// GLOBAL PROPERTIES ----------------------------------------------------------------------------------------------------------
		this.randomMax = 0.0; //set to Zero if no random is desired
		this.timeSpan = 5.0;  //time from beginning to end to sequence
		this.ascending = true; //determines if we order layers top-bottom or vice-versa
		this.compName = null;
		this.bStartFromZero = false;

		/*----------------------------------------------------------------*/
		function getRandom(min, max) {
		  return Math.random() * (max - min) + min;
		}
		
		/*----------------------------------------------------------------*/
		function onRunButtonClick(){

			var myComp = project.activeItem;

			if((myComp == null) || !(myComp instanceof CompItem) || myComp.selectedLayers.length==0){
				myComp = null;
				alert("Please select Layers first");
			}else{

				app.beginUndoGroup("Sequence Layers");
				var selLayers = myComp.selectedLayers.slice(0);
				var nLayers = selLayers.length;

				selLayers.sort(compareLayers);

				for(var i = 0; i<nLayers+1; i++){

					var t = null;
				    var randomAmt = getRandom(0,randomMax); 

				    if(bStartFromZero){
				    	t = 0;
				    }else{
				    	t = parseFloat(myComp.time);
				    }

				    timeSpan = parseFloat(timeSpan); // just for extra security since sometimes it assumes it's a string. Kind of a hack but helps

					if(!myComp.selectedLayers[i].locked){						
				        if(ascending){
				            selLayers[i].startTime = t + timeSpan - (timeSpan/(nLayers-1))*(i) +randomAmt; //interval is equally distributed depending on the nLayers and timeSpan            
				        }else{
				            selLayers[i].startTime = t + (timeSpan/(nLayers-1))*(i) +randomAmt; //interval is equally distributed depending on the nLayers and timeSpan
				        }
				    }
				}
			}

			app.endUndoGroup();

		}

		/*----------------------------------------------------------------*/
		function expandOutPoint(){

			var myComp = project.activeItem;

			if((myComp == null) || !(myComp instanceof CompItem) || myComp.selectedLayers.length==0){
				myComp = null;
				alert("Please select Layers first");
			}else{

				app.beginUndoGroup("Extend to End of Comp");
				// var myComp = project.item(getIndexfromName(compName)); //change Comp's name here
				var selLayers = myComp.selectedLayers;
				var nLayers = selLayers.length;
				for(var i = 0; i < nLayers; i++){
				    var thisLayer = myComp.layer(myComp.selectedLayers[i].index);
				    thisLayer.outPoint = myComp.duration;
				}
			}
			app.endUndoGroup();
		}

		/*----------------------------------------------------------------*/
		function resetLayers(){

			var myComp = project.activeItem;

			if((myComp == null) || !(myComp instanceof CompItem) || myComp.selectedLayers.length==0){
				myComp = null;
				alert("Please select Layers first");
			}else{

				app.beginUndoGroup("Reset Layers");
				// var myComp = project.item(getIndexfromName(compName)); //change Comp's name here
				var selLayers = myComp.selectedLayers;
				var nLayers = selLayers.length;
				for(var i = 0; i < nLayers; i++){
				    var thisLayer = myComp.layer(myComp.selectedLayers[i].index);
					if(!thisLayer.locked){
				        thisLayer.startTime = 0; 
				    }
				}
			}
			app.endUndoGroup();
		}

		/*----------------------------------------------------------------*/
		function myScript_buildUI(thisObj){
			var myPanel = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Sequence Layers", undefined, {resizeable: true});

			if(myPanel != null)
			{
			
			//resource string
			res = "group{orientation:'column', alignment:['left','top'], alignChildren:['center','fill'],\
				myButtonPanel: Panel{orientation:'row', text:'controls', alignment:['fill','fill'],\
                    myRunButton: Button{text:'Run', preferredSize:[80,25]},\
					myResetButton: Button{text:'Reset', preferredSize:[80,25]},\
	            },\
	            myStackOrderPanel: Panel{orientation:'row', text:'Stack Order', alignment:['fill','fill'], alignChildren:['fill','center'],\
					myRadioButtonAsc: RadioButton{text:'Ascending', value:true},\
					myRadioButtonDes: RadioButton{text:'Descending', value:false},\
	            },\
	           	timeControlPanel: Panel{orientation:'column', text:'Time Controls', alignment:['fill','center'], alignChildren:['right','top'],\
					myTimeSpanGroup: Group{orientation: 'row', alignChildren:['right','center'],\
						myTimeSpanTextTitle: StaticText{text:'Time Span(sec)'},\
						myEditText1: EditText{text: '5.0',preferredSize:[40,20], alignment:['center','right']},\
					},\
					myRandomGroup: Group{orientation: 'row', alignChildren:['right','center'],\
						myRandomTextTitle: StaticText{text:'Random Amount (sec)'},\
						myEditText2: EditText{text:'0.0',preferredSize:[40,20]},\
					},\
					myStartTimeGroup: Group{orientation: 'row', alignChildren: ['right','center'], \
						myStartTimeTextTitle: StaticText{text:'Start From time 00:00'},\
						myStartTimeTextCheckBox: Checkbox{value: false},\
					},\
	            },\
				myExpandPanel: Panel{orientation:'row', alignment:['fill','fill'],\
					myTimeSpanTextTitle: StaticText{text:'Extend to End of Comp'},\
					myExpandButton: Button{text:'Extend', preferredSize:[60,23]},\
	            },\
	        }"; 

			myPanel.grp = myPanel.add(res); //add resource string to our panel

        	//help Tips
	      	myPanel.grp.myButtonPanel.myRunButton.helpTip = "Sequence Layers";
	      	myPanel.grp.myButtonPanel.myResetButton.helpTip = "Resets inPoints of Layers to time=0";
	      	myPanel.grp.timeControlPanel.myTimeSpanGroup.myEditText1.helpTip = "Sets time between first and last layer, in seconds";
	      	myPanel.grp.timeControlPanel.myRandomGroup.myEditText2.helpTip = "Sets the maximum time random offset, in seconds";
	      	myPanel.grp.myStackOrderPanel.myRadioButtonAsc.helpTip = "Layers will be sequenced in ascending order";
	      	myPanel.grp.myStackOrderPanel.myRadioButtonDes.helpTip = "Layers will be sequenced in descending order";
	      	myPanel.grp.myExpandPanel.myExpandButton.helpTip = "Extends outPoints of layers to the end of the Composition";
	
			//Panel Sizing
			myPanel.layout.layout(true);
			myPanel.grp.minimumSize = myPanel.grp.size;


			
			/// CALLBACKS
			// Run the Script
			myPanel.grp.myButtonPanel.myRunButton.onClick = onRunButtonClick;
			myPanel.grp.myButtonPanel.myResetButton.onClick = resetLayers;

			// Stack order
			myPanel.grp.myStackOrderPanel.myRadioButtonAsc.onClick = function(){
				if (!(this.value)){
					ascending = false;
				}else{
					ascending = true;
				}
			}

			myPanel.grp.myStackOrderPanel.myRadioButtonDes.onClick = function(){
				if (!(this.value)){
					ascending = true;
				}else{
					ascending = false;
				}
			}

			// Set time span
			myPanel.grp.timeControlPanel.myTimeSpanGroup.myEditText1.onChange = function(){
				timeSpan = this.text;
			}

			// Set Random amount
			myPanel.grp.timeControlPanel.myRandomGroup.myEditText2.onChange = function(){
				randomMax = this.text;
			}

			myPanel.grp.timeControlPanel.myStartTimeGroup.myStartTimeTextCheckBox.onClick = function(){

				if (this.value){
					bStartFromZero = true;
				}else{
					bStartFromZero = false;
				}
			}

			// Extend Layers
			myPanel.grp.myExpandPanel.myExpandButton.onClick = expandOutPoint;

			// Panel
			myPanel.layout.resize();
			myPanel.onResizing = myPanel.onResize = function(){this.layout.resize()};

			}

			return myPanel;
		}

		var myScriptPal = myScript_buildUI(thisObj);
		if( (myScriptPal != null) && (myScriptPal instanceof Window) ){
			myScriptPal.center();
			myScriptPal.show();
		}

	}//end Script function
	myScript(this);
}//end main

