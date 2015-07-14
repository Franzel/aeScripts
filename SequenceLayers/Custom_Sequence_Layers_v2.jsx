﻿/*This script sequences layers in a specified CompTotal sequence time, random amount, stack order are parametersIt also provides a GUI for direct use through AE menuFrancisco ZamoranoJune 2015*/{//PALETTE --------------------------------------------------------------------------------------------------------------------------	function myScript(thisObj){		// SETUP  ---------------------------------------------------------------------------------------------------------------------		var project = app.project;		// GLOBAL PARAMETERS ----------------------------------------------------------------------------------------------------------		var randomMax = 0.0; //set to Zero if no random is desired		var timeSpan = 5.0;  //time from beginning to end to sequence		var ascending = true; //determines if we order layers top-bottom or vice-versa		var compName = null;		/*----------------------------------------------------------------*/		function getRandom(min, max) {		  return Math.random() * (max - min) + min;		}		/*----------------------------------------------------------------*/		function getIndexfromName(_name){		    for(var i=1;i<project.items.length+1;i++){		        var currComp = project.item(i);		        if (currComp.name == _name){		            return i;		        }		    } 		}				/*----------------------------------------------------------------*/		function onRunButtonClick(){						if(project.selection.length==0){				compName = null;				alert("Please select a Composition first");			}else{				compName = project.activeItem.name;			}			app.beginUndoGroup("Sequence Layers");			var myComp = project.item(getIndexfromName(compName)); //change Comp's name here			var nLayers = myComp.numLayers;			for(var i = 1; i<= nLayers; i++){			    var thisLayer = myComp.layer(i);				var t = thisLayer.startTime;			    var randomAmt = getRandom(0,randomMax); 				if(!thisLayer.locked){			        if(ascending){			            thisLayer.startTime = timeSpan - (timeSpan/(nLayers-1))*(i-1) +randomAmt; //interval is equally distributed depending on the nLayers and timeSpan            			        }else{			            thisLayer.startTime = (timeSpan/(nLayers-1))*(i-1) +randomAmt; //interval is equally distributed depending on the nLayers and timeSpan			        }			    }			}			app.endUndoGroup();		}		/*----------------------------------------------------------------*/		function expandOutPoint(){			if(project.selection.length==0){				compName = null;				alert("Please select a Composition first");			}else{				compName = project.activeItem.name;			}			app.beginUndoGroup("Extend to End of Comp");			var myComp = project.item(getIndexfromName(compName)); //change Comp's name here			var nLayers = myComp.numLayers;			for(var i = 1; i<= nLayers; i++){			    var thisLayer = myComp.layer(i);			    thisLayer.outPoint = myComp.duration;			}			app.endUndoGroup();		}		/*----------------------------------------------------------------*/		function resetLayers(){			if(project.selection.length==0){				compName = null;				alert("Please select a Composition first");			}else{				compName = project.activeItem.name;			}			app.beginUndoGroup("Reset Layers");			var myComp = project.item(getIndexfromName(compName)); //change Comp's name here			var nLayers = myComp.numLayers;			for(var i = 1; i<= nLayers; i++){			    var thisLayer = myComp.layer(i);				if(!thisLayer.locked){			        thisLayer.startTime = 0; 			    }			}			app.endUndoGroup();		}		/*----------------------------------------------------------------*/		function setAscending(){			ascending= !ascending;		}		/*----------------------------------------------------------------*/		function printCurrentTargetComp(){			alert("stored: "+compName+"         items selected: "+project.selection.length + "    ascending: " + ascending );		}		/*----------------------------------------------------------------*/		function myScript_buildUI(thisObj){			var myPanel = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Sequence Layers", undefined, {resizeable: true});			//resource string			res = "group{orientation:'column', alignment:['left','top'], alignChildren:['center','fill'],\				myButtonPanel: Panel{orientation:'row', text:'controls', alignment:['fill','fill'],\                    myRunButton: Button{text:'Run', preferredSize:[80,25]},\					myResetButton: Button{text:'Reset', preferredSize:[80,25]},\	            },\	            myStackOrderPanel: Panel{orientation:'row', text:'Stack Order', alignment:['fill','fill'], alignChildren:['fill','center'],\					myRadioButtonAsc: RadioButton{text:'Ascending', value:true},\					myRadioButtonDes: RadioButton{text:'Descending', value:false},\	            },\	           	timeControlPanel: Panel{orientation:'column', text:'Time Controls', alignment:['fill','center'], alignChildren:['right','top'],\					myTimeSpanGroup: Group{orientation: 'row', alignChildren:['right','center'],\						myTimeSpanTextTitle: StaticText{text:'TimeSpan (sec)'},\						myEditText1: EditText{text: '5.0',preferredSize:[40,20], alignment:['center','right']},\					},\					myRandomGroup: Group{orientation: 'row', alignChildren:['right','center'],\						myRandomTextTitle: StaticText{text:'Random Amount (sec)'},\						myEditText2: EditText{text:'0.0',preferredSize:[40,20]},\					},\	            },\				myExpandPanel: Panel{orientation:'row', alignment:['fill','fill'],\					myTimeSpanTextTitle: StaticText{text:'Trim to End of Comp'},\					myExpandButton: Button{text:'Expand', preferredSize:[60,23]},\	            },\	        }"; 			myPanel.grp = myPanel.add(res); //add resource string to our panel        	//help Tips	      	myPanel.grp.myButtonPanel.myRunButton.helpTip = "Sequence Layers";	      	myPanel.grp.myButtonPanel.myResetButton.helpTip = "Resets inPoints of Layers to time=0";	      	myPanel.grp.timeControlPanel.myTimeSpanGroup.myEditText1.helpTip = "Sets time between first and last layer, in seconds";	      	myPanel.grp.timeControlPanel.myRandomGroup.myEditText2.helpTip = "Sets the maximum time random offset, in seconds";	      	myPanel.grp.myStackOrderPanel.myRadioButtonAsc.helpTip = "Layers will be sequenced in ascending order";	      	myPanel.grp.myStackOrderPanel.myRadioButtonDes.helpTip = "Layers will be sequenced in descending order";	      	myPanel.grp.myExpandPanel.myExpandButton.helpTip = "Sets outPoints of layers to the end of the Composition";				//Panel Sizing			myPanel.layout.layout(true);			myPanel.grp.minimumSize = myPanel.grp.size;			// EVENTS			// Run the Script			myPanel.grp.myButtonPanel.myRunButton.onClick = onRunButtonClick;			myPanel.grp.myButtonPanel.myResetButton.onClick = resetLayers;			// myPanel.grp.myButtonPanel.myCompButton.onClick = printCurrentTargetComp; //debugger			//Stack order			myPanel.grp.myStackOrderPanel.myRadioButtonAsc.onClick = function(){				if(myPanel.grp.myStackOrderPanel.myRadioButtonAsc.value == false ){					ascending = false;				}else{					ascending = true;				}			}			myPanel.grp.myStackOrderPanel.myRadioButtonDes.onClick = function(){				if(myPanel.grp.myStackOrderPanel.myRadioButtonDes.value == false ){					ascending = true;				}else{					ascending = false;				}			}			//Time span			myPanel.grp.timeControlPanel.myTimeSpanGroup.myEditText1.onChange = function(){				timeSpan = myPanel.grp.timeControlPanel.myTimeSpanGroup.myEditText1.text;			}			//Random amount			myPanel.grp.timeControlPanel.myRandomGroup.myEditText2.onChange = function(){				randomMax = myPanel.grp.timeControlPanel.myRandomGroup.myEditText2.text;			}			//Expand			myPanel.grp.myExpandPanel.myExpandButton.onClick = expandOutPoint;			myPanel.layout.resize();			myPanel.onResizing = myPanel.onResize = function(){this.layout.resize()};			return myPanel;		}		var myScriptPal = myScript_buildUI(thisObj);		if( (myScriptPal != null) && (myScriptPal instanceof Window) ){			myScriptPal.center();			myScriptPal.show();		}	}//end Script function	myScript(this);}//end main