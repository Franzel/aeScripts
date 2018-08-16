﻿function copyPasteMultiple(){	var copyPasteMultiple = this;	var project = app.project;	var selectedComp = project.activeItem;	var currSelection;	this.buildUI = function(thisObj){		var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Expression Editor", undefined, {resizeable:true});		//resource specs		var res =		"group { orientation:'column', alignment:['fill', 'top'], alignChildren:['fill', 'top'], \			gr_Actions: Panel { orientation:'column', alignChildren:['fill', 'top'],\				copyBtn: Button { text:'Copy Value', preferredSize:[100,20]}, \				infoField : StaticText {text:'Current Property: ', alignment:['left','top'], characters: 60}, \				applyBtn: Button { text:'Apply Value', preferredSize:[100,20]}, \			},\		}";		pal.grp = pal.add(res);		//help tips		pal.grp.gr_Actions.copyBtn.helpTip = "copy parameter";		//callbacks		pal.grp.gr_Actions.copyBtn.onClick = function(){			app.beginUndoGroup("Copy Parameter");			copyPasteMultiple.getSelectedProperty();			// var val = currSelection.value;			var msg = "Master Property: " + currSelection.parentProperty.name + " > "+ currSelection.name + "= " + currSelection.value.toString();			$.writeln("Current Property: " + currSelection.name + "= " + currSelection.value);			pal.grp.gr_Actions.infoField.text = msg;			app.endUndoGroup();		};		pal.grp.gr_Actions.applyBtn.onClick = function(){			app.beginUndoGroup("Paste Parameter");			copyPasteMultiple.pasteValue();			app.endUndoGroup();		};		//show UI			if (pal instanceof Window){			pal.center();			pal.show();		}else{			pal.layout.layout(true);		}	};//end buildUI	this.getSelectedProperty = function(thisObj){		if(selectedComp instanceof CompItem ){			if(selectedComp.selectedProperties.length>0){				var selLayer = selectedComp.selectedLayers[0];				var selProperty = selLayer.selectedProperties[0];				var selParameter;				if(selProperty instanceof Property){					currSelection = selProperty;					//return selProperty;					} else if (selProperty instanceof PropertyGroup){					for(var i=1; i<selProperty.numProperties + 1;i++){						$.write(selProperty.property(i).name);						if(selProperty.property(i).selected){							$.write(" <<<<<<< MASTER ");							selParameter = selProperty.property(i);						}						$.writeln(" ");					}					//selParameter = selProperty.property(1);					currSelection = selParameter;					//return selParameter;				} else {					alert("No selected Property");				}			} else {				alert("select a Property first");			}		} else {			alert("select a Comp first");		}	}//end get function	this.pasteValue = function(thisObj){		$.writeln("master : " + currSelection.name);		if(selectedComp instanceof CompItem ){			if(selectedComp.selectedLayers.length>0){				$.writeln(selectedComp.selectedLayers.length);				for(var i=0 ; i<selectedComp.selectedLayers.length; i++){					for(var j=1; j<selectedComp.selectedLayers[i].property("Transform").numProperties+1 ;j++){						if(selectedComp.selectedLayers[i].property("Transform").property(j).name == currSelection.name){							selectedComp.selectedLayers[i].property("Transform").property(j).setValue(currSelection.value);						}					}					for(var j=1; j<selectedComp.selectedLayers[i].property("Effects").numProperties+1 ;j++){						$.writeln(selectedComp.selectedLayers[i].property("Effects").property(j).name);						if(selectedComp.selectedLayers[i].property("Effects").property(j).name == currSelection.parentProperty.name){								selectedComp.selectedLayers[i].property("Effects").property(j).property(currSelection.name).setValue(currSelection.value);						}					}				}			}else{				alert("select at least one layer first");			}		}	}//end paste function	this.run = function(thisObj){		this.buildUI(thisObj);	}}; //end main functionnew copyPasteMultiple().run(this);