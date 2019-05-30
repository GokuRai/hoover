var hoverAdditionalFunc = {
	fileInstruction: '',
	uploadInput: function(elem_id, elmen_id_out) {
		/** only plain text file allowed **/
	  var x = document.getElementById(elem_id);
	  var txt = "";
	  var err = []; // holds list of errors
	  var supportedFormats = ['text/plain']; //whitelisting file types

	  if ('files' in x) {
	    if (x.files.length == 0) {
	      txt = "Select one or more files.";
	    } else {
	        txt += "<br><strong>" + (1) + ". file</strong><br>";
	        var file = x.files[0];
	        if ('name' in file) {
	          txt += "name: " + file.name + "<br>";
	        }
	        if ('size' in file) {
	          txt += "size: " + file.size + " bytes <br>";
	          if(file.size > 50000) {
	          	err.push("file size exceeded 50 kb");
	          }else if( file.size <= 0){
	          	err.push("file is empty!");
	          }
	        }

	        if( 'type' in file ){
	        	if( supportedFormats.indexOf(file.type) < 0 ){
	        		err.push(file.type + ' is not supported');
	        	}
	        }

	        if( Array.isArray(err) && err.length ){
	        	document.getElementById(elmen_id_out).innerHTML = 'Error: ' + JSON.stringify(err);
	        	console.log('Error: '); console.dir(err);
	          	return 
	        }
	        this.readInstruction(file); //read input file
	    }
	  } 
	  else {
	    if (x.value == "") {
	      txt += "Select one or more files.";
	    } else {
	      txt += "The files property is not supported by your browser!";
	      txt  += "<br>The path of the selected file: " + x.value; // If the browser does not support the files property, it will return the path of the selected file instead. 
	    }
	  }
	  document.getElementById(elmen_id_out).innerHTML = txt;
	},

	readInstruction: function(file){
		if(window.FileReader) {   //check if FileReader is available
			if (file) {
		    var reader = new FileReader();
		    reader.readAsText(file, "UTF-8");
		    reader.onload = function (evt) {
			        // document.getElementById("fileContents").innerHTML = evt.target.result;
			        this.fileInstruction = evt.target.result;
			        hoover.startHoover(this.fileInstruction); // vroom vrooom
			    }
		    reader.onerror = function (evt) {
			        // document.getElementById("fileContents").innerHTML = "error reading file";
			        console.log(error);
			    }
			}
		} else {
		   //the browser doesn't support the FileReader Object, so do this
		   console.log("browser doesn't support FileReader");
		}
	}


};

//initialize js
var init = (function(){
	// upload event listener callback
	document.querySelector('#instructionFile').onchange = function(){
		hoverAdditionalFunc.uploadInput('instructionFile', 'main');
	};

	console.log('please feed instruction to Start!');
})();
