/*
This script provides advanced controls for sequencing layers

Francisco Zamorano
July 2015
*/

function sequenceLayers()
{
	var ascending = true;
	var bUseFrames = true;
	var timeSpan = 2.0;  //time from beginning to end to sequence
	var randomMax = 0.0; //set to Zero if no random is desired
	var bStartFromZero = false;
	var randomAmt = 0.0;


	var sequenceLayers = this;

	this.buildUI = function (thisObj){

		var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Expression Editor", undefined, {resizeable:true});

		//resource specs
		var res = 
		"group { orientation:'column', alignment:['fill', 'top'], alignChildren:['fill', 'top'], \
			gr_Actions: Panel { orientation:'row', alignChildren:['fill', 'top'],\
				runBtn: Button { text:'Run', preferredSize:[50,20]}, \
				resetBtn: Button { text:'Reset', preferredSize:[50,20]} \
			},\
			gr_StackOrder: Panel{orientation:'row', text:'Stack Order', alignment:['fill','fill'], alignChildren:['fill','center'],\
				ascRadioBtn: RadioButton{text:'Ascending', value:true},\
				descRadioBtn: RadioButton{text:'Descending', value:false},\
            },\
            gr_timeUnits: Panel{orientation:'row', text:'TIme Units', alignment:['fill','fill'], alignChildren:['fill','center'],\
				framesRadioBtn: RadioButton{text:'Frames', value:true},\
				secRadioBtn: RadioButton{text:'Seconds', value:false},\
            },\
        	gr_TimeControl: Panel{orientation:'column', text:'Time Controls', alignment:['fill','center'], alignChildren:['right','top'],\
				gr_TimeSpanGroup: Group{orientation: 'row', alignChildren:['right','center'],\
					myTimeSpanTextTitle: StaticText{text:'TimeSpan'},\
					timeSpanEditText: EditText{text: '2.0',preferredSize:[40,20], alignment:['center','right']},\
				},\
				gr_RandomGroup: Group{orientation: 'row', alignChildren:['right','center'],\
					myRandomTextTitle: StaticText{text:'Random Amount'},\
					randomEditText: EditText{text:'0.0',preferredSize:[40,20]},\
				},\
				gr_StartTimeGroup: Group{orientation: 'row', alignChildren: ['right','center'], \
					myStartTimeTextTitle: StaticText{text:'Start From time 00:00'},\
					startTimeTextCheckBox: Checkbox{value: false},\
				},\
            },\
        	gr_Extend: Panel{orientation:'row', alignment:['fill','fill'],\
				myTimeSpanTextTitle: StaticText{text:'Extend to End of Comp'},\
				extendBtn: Button{text:'Extend', preferredSize:[60,23]},\
            }\
		}";
		pal.grp = pal.add(res);

		//help Tips
      	pal.grp.gr_Actions.runBtn.helpTip = "Sequence Layers";
      	pal.grp.gr_Actions.resetBtn.helpTip = "Resets inPoints of Layers to time=0";
      	pal.grp.gr_TimeControl.gr_TimeSpanGroup.timeSpanEditText.helpTip = "Sets time between first and last layer, in seconds";
      	pal.grp.gr_TimeControl.gr_RandomGroup.randomEditText.helpTip = "Sets the maximum time random offset, in seconds";
      	pal.grp.gr_TimeControl.gr_StartTimeGroup.startTimeTextCheckBox.helpTip = "Forces the sequence to start from time=0";
      	pal.grp.gr_StackOrder.ascRadioBtn.helpTip = "Layers will be sequenced in ascending order";
      	pal.grp.gr_StackOrder.descRadioBtn.helpTip = "Layers will be sequenced in descending order";
      	pal.grp.gr_Extend.extendBtn.helpTip = "Extends outPoints of layers to the end of the Composition";
	

		// Callbacks
		pal.grp.gr_Actions.runBtn.onClick = function(){
			app.beginUndoGroup("Sequence Layers");
			runSequenceLayers();
			app.endUndoGroup();
		};

		pal.grp.gr_Actions.resetBtn.onClick = function(){
			app.beginUndoGroup("Reset Layers");
			resetLayers();
			app.endUndoGroup();
		};

		pal.grp.gr_StackOrder.ascRadioBtn.onClick = function(){
			if (!(this.value)){
				ascending = false;
			}else{
				ascending = true;
			}
		}

		pal.grp.gr_StackOrder.descRadioBtn.onClick = function(){
			if (!(this.value)){
				ascending = true;
			}else{
				ascending = false;
			}
		}

		pal.grp.gr_timeUnits.framesRadioBtn.onClick = function(){
			if (!(this.value)){
				bUseFrames = false;
			}else{
				bUseFrames = true;
			}
		}

		pal.grp.gr_timeUnits.secRadioBtn.onClick = function(){
			if (!(this.value)){
				bUseFrames = true;
			}else{
				bUseFrames = false;
			}
		}

		// Set time span
		pal.grp.gr_TimeControl.gr_TimeSpanGroup.timeSpanEditText.onChange = function(){
			timeSpan = parseFloat(this.text);
		}

		// Set random
		pal.grp.gr_TimeControl.gr_RandomGroup.randomEditText.onChange = function(){
			randomMax = parseFloat(this.text);
		}

		// Set startTime
		pal.grp.gr_TimeControl.gr_StartTimeGroup.startTimeTextCheckBox.onClick = function(){
			if (this.value){
				bStartFromZero = true;
			}else{
				bStartFromZero = false;
			}
		}

		// Extend Layers
		pal.grp.gr_Extend.extendBtn.onClick = function(){
			app.beginUndoGroup("Extend Layer Out Point");
			extendOutPoint();
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

	runSequenceLayers = function (){
        var myComp = app.project.activeItem;

    	if(app.project && app.project.activeItem && app.project.activeItem instanceof CompItem){			
			
			var selLayers = myComp.selectedLayers.slice(0);
			var nLayers = selLayers.length;

			selLayers.sort( compareLayers );

			//check for frames vs seconds
			if(bUseFrames){
				timeSpan *= myComp.frameDuration;
				randomAmt *= myComp.frameDuration;
		    }else{
		    	timeSpan *= 1.0;
		    	randomAmt *= 1.0;
		    }

		    //main for loop
			for(var i = 0; i<nLayers+1; i++){

				var t = 0;
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
		}else{
			alert("Please select some Layers First");
		}
	};

	resetLayers = function (){

        var myComp = app.project.activeItem;

        if(app.project && app.project.activeItem && app.project.activeItem instanceof CompItem){

        	var selLayers = myComp.selectedLayers.slice(0);
			var nLayers = selLayers.length;

			for(var i = 0; i<nLayers+1; i++){
			    var thisLayer = myComp.layer(selLayers[i].index);
				// if(thisLayer.selected==true){
			        thisLayer.startTime = 0;
			    // }
			}
		}else{
			alert("Please select some Layers First");
		}
	};

	extendOutPoint = function(){
        var myComp = app.project.activeItem;

        if(app.project && app.project.activeItem && app.project.activeItem instanceof CompItem){
			
        	var selLayers = myComp.selectedLayers.slice(0);
			var nLayers = selLayers.length;

			for(var i = 0; i<nLayers+1; i++){
			    var thisLayer = myComp.layer(selLayers[i].index);
			    if(thisLayer.selected==true){
			    	thisLayer.outPoint = myComp.duration;
			    }
			}
		}else{
			alert("Please select some Layers First");
		}
	};

	getRandom = function(min, max) {
	  return Math.random() * (max - min) + min;
	};

	compareLayers = function(a, b) {
		return a.index > b.index;
	}

	this.run = function (thisObj){
		this.buildUI(thisObj);
	};
}//end main

new sequenceLayers().run(this);
