/*
This script provides an window to copy, edit and apply expressions to the selected Property
Francisco Zamorano
July 2015
*/

function sequenceLayers()
{
	this.ascending = true;
	this.timeSpan = 2.0;  //time from beginning to end to sequence
	this.randomMax = 0.0; //set to Zero if no random is desired
	this.bStartFromZero = false;
	this.randomAmt = 0.0;


	var sequenceLayers = this;

	this.buildUI = function (thisObj){

		var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Expression Editor", undefined, {resizeable:true});

		//resource specs
		var res = 
		"group { orientation:'column', alignment:['left', 'top'], alignChildren:['left', 'top'], \
			gr_Actions: Panel { orientation:'row', alignChildren:['left', 'top'],\
				runBtn: Button { text:'Run', preferredSize:[50,20]}, \
				resetBtn: Button { text:'Reset', preferredSize:[50,20]} \
			},\
			gr_StackOrder: Panel{orientation:'row', text:'Stack Order', alignment:['fill','fill'], alignChildren:['fill','center'],\
				ascRadioBtn: RadioButton{text:'Ascending', value:true},\
				descRadioBtn: RadioButton{text:'Descending', value:false},\
            },\
        	gr_TimeControl: Panel{orientation:'column', text:'Time Controls', alignment:['fill','center'], alignChildren:['right','top'],\
				gr_TimeSpanGroup: Group{orientation: 'row', alignChildren:['right','center'],\
					myTimeSpanTextTitle: StaticText{text:'TimeSpan (sec)'},\
					timeSpanEditText: EditText{text: '2.0',preferredSize:[40,20], alignment:['center','right']},\
				},\
				gr_RandomGroup: Group{orientation: 'row', alignChildren:['right','center'],\
					myRandomTextTitle: StaticText{text:'Random Amount (sec)'},\
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

		// Set time span
		pal.grp.gr_TimeControl.gr_TimeSpanGroup.timeSpanEditText.onChange = function(){
			timeSpan = parseFloat(this.text);
		}

		// Set random
		pal.grp.gr_TimeControl.gr_RandomGroup.randomEditText.onChange = function(){
			randomMax = parseFloat(this.text);
			$.writeln(randomMax);
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
        $.writeln("good");

    	if(app.project && app.project.activeItem && app.project.activeItem instanceof CompItem){			
			
			var selLayers = myComp.selectedLayers.slice(0);
			var nLayers = selLayers.length;

			selLayers.sort( compareLayers );

			for(var i = 0; i<nLayers+1; i++){
			    // var thisLayer = selLayers[i];
			     // $.writeln(selLayers[i].index);

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
		}else{
			$.writeln("no comp selected");
		}
	};

	resetLayers = function (){
        var myComp = app.project.activeItem;
        if(app.project && app.project.activeItem && app.project.activeItem instanceof CompItem){
			var nLayers = myComp.numLayers;
			for(var i = 1; i<= nLayers; i++){
			    var thisLayer = myComp.layer(i);
				if(!thisLayer.locked && thisLayer.selected==true){
			        thisLayer.startTime = 0; 
			    }
			}
		}else{
			$.writeln("no comp selected");
		}
	};

	extendOutPoint = function(){
        var myComp = app.project.activeItem;

        if(app.project && app.project.activeItem && app.project.activeItem instanceof CompItem){
			var nLayers = myComp.numLayers;
			for(var i = 1; i<= nLayers; i++){
			    var thisLayer = myComp.layer(i);
			    if(thisLayer.selected==true) thisLayer.outPoint = myComp.duration;
			}
		}else{
			$.writeln("no comp selected");
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
