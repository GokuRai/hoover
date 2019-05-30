var hoover = (function(){
	"use strict";

	var output = {}; //holds output results
	output.error = [];

	function checkInputs(input){
		var checked_input = {};
		var checked_input_arr = [];
		var isOnlyNumbers, checkSizeofArr;

		try{
			var input_arr = input.trim().split(/\r\n|\n/); // gets each line's data

			checked_input.hooverNavigation = input_arr.pop(); // string
			checked_input.roomDimension = input_arr.shift().split(' ').filter(function(i){return i}).map(Number); //1st line array
			checked_input.initHooverLoc = input_arr.shift().split(' ').filter(function(i){return i}).map(Number); //2nd line array

			// dirt pach location array list
			checked_input.dirtLocation = input_arr.map(function(loc){
				return loc.split(' ').filter(function(i){return i}).map(Number);
			});

			//combines all array for checking
			checked_input_arr = checked_input_arr.concat([checked_input.roomDimension], [checked_input.initHooverLoc], checked_input.dirtLocation);
			// console.log(checked_input_arr);

			isOnlyNumbers = checked_input_arr.filter(function(arr_item){
				return arr_item.some(isNaN);
			});

			checkSizeofArr = checked_input_arr.filter(function(arr){
				return arr.length > 2;
			});

			if( isOnlyNumbers.length > 0 ){ //allows only numbers
				// console.log('isNAN ', isOnlyNumbers);
				output.error.push( 'Only array of numbers are allowed for coordinates: ' + isOnlyNumbers );

			}

			if( checkSizeofArr.length > 0 ){
				output.error.push( 'Invalid location coordinates format- ' );
			}

			// more checks/validation can be added here!

			// console.log(checked_input.hooverNavigation, checked_input.initHooverLoc, checked_input.roomDimension, checked_input.dirtLocation);

			return checked_input;
		}catch(err){
			output.error.push( 'Invalid instruction in input file!' );
			console.log(err);
			return;
		}

		
	}

	function storeHooverPath(arr){
		output.hooverPath = arr;
	}

	// simulates hoover navigating
	function hooverNavigator(hooverLoc, roomDim, direction ){
		var direction_arr = direction.split('');
		var hLoc = JSON.parse(JSON.stringify(hooverLoc)); //copy of initial hoover location
		var tempHooverPath = [];

		/** roomDim[0] // vertical or x
			roomDim[1] // horizontal or y
			hLoc[0] // hoover's x-location
			hLoc[1] // hoover's y-location
		**/
		for(var i=0; i < direction_arr.length; i++){
		  if( direction_arr[i] == 'N' && hLoc[1] < roomDim[1] ) {hLoc[1]++;}
		  if( direction_arr[i] == 'S' && hLoc[1] > 0 ) {hLoc[1]--;}
		  if( direction_arr[i] == 'E' && hLoc[0] < roomDim[0] ) {hLoc[0]++;}
		  if( direction_arr[i] == 'W' && hLoc[0] > 0 ) {hLoc[0]--;}
		  //console.log(hLoc, i);
		  tempHooverPath.push([hLoc[0], hLoc[1]]); //keeps track of hoover's path
		}
		storeHooverPath(tempHooverPath); //stores the hoover path in output object

		return hLoc;
		
	}

	// checks if dirt is at hoover's location
	function checkDirt(hLoc_path, dirtLocation){
		var tempDirtFound = [];
		//loop through first array
		for(var i = 0; i < hLoc_path.length; i++){
		    //loop through second array   
		    for(var j = 0; j < dirtLocation.length; j++){

		      if(hLoc_path[i][0] == dirtLocation[j][0] && hLoc_path[i][1] == dirtLocation[j][1]){
		        // console.log("matched");
		        tempDirtFound.push([hLoc_path[i][0], hLoc_path[i][1]]); //match location array
		      }
		    }
		}

		return multiUniqueArray(tempDirtFound); //returns unique multidimensional array
	}

	// returns unique for multidimensional array 
	function multiUniqueArray(arr) {
	    var uniques = [];
	    var itemsFound = {};
	    for(var i = 0, l = arr.length; i < l; i++) {
	        var stringified = JSON.stringify(arr[i]);
	        if(itemsFound[stringified]) { continue; }
	        uniques.push(arr[i]);
	        itemsFound[stringified] = true;
	    }
	    return uniques;
	}

	function renderOutput(){
		document.querySelector('#output').innerHTML = '<p>' + JSON.stringify(output.results.finalHooverPosition) + '</p>';
		document.querySelector('#output').innerHTML += '<p>' + output.results.numberOfPatchesCleaned + '</p>';
	}

	function clearOutput(){
		document.querySelector('#output').innerHTML = '';
	}

	// initializes hoover
	function startHoover(input){
		//initializing variables

		var checked_input = checkInputs(input);
		var hooverLocation, dirtFound_arr;

		clearOutput();//reset output html

		//check for input errors
		if( Array.isArray(output.error) && output.error.length ){
			console.log('Error: ')
			console.dir(output.error);

			output.error = []; //reset
			return;
		}


		hooverLocation = hooverNavigator(checked_input.initHooverLoc, checked_input.roomDimension, checked_input.hooverNavigation );
		dirtFound_arr = checkDirt(output.hooverPath, checked_input.dirtLocation);

		//populating helpful output object
		output.input = {
			'initHooverLocation': checked_input.initHooverLoc, 
			'roomDimension': checked_input.roomDimension,
			'dirtLocation' : checked_input.dirtLocation,
			'hooverNavigation' : checked_input.hooverNavigation
		};

		output.results = {
				'finalHooverPosition' : hooverLocation,
				'dirtMatchLocation'	: dirtFound_arr,
				'numberOfPatchesCleaned' : dirtFound_arr.length
		};
		
		console.log('hoovering started:');

		console.dir(output);
		console.log(JSON.stringify(output.results.finalHooverPosition));
		console.log(output.results.numberOfPatchesCleaned);

		renderOutput();

	}

	// startHoover(); //vrooommm vrooommm
	return {
		startHoover: startHoover
	};

})();