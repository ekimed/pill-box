var fs = require('fs');

var removeCharFromLastElement = function(char, array) {
	var lastElement = array[array.length-1].replace('\r', '');

	array[array.length-1] = lastElement;

	return array;
};

function text2json (input, output) {
	var reader = fs.readFile(input, 'utf-8', function(err, data) {
		if (err) throw err;

		// split data by newline
		data = data.split('\n');


		//get headers
		var headers = data[0].split('|');

		//remove '/r'
		var lastElement = headers[headers.length-1].replace('\r', '');

		//replace last element with cleaned up version
		headers = removeCharFromLastElement('\r', headers);

		//temp array to hold objects
		var tempArray = [];

		for (var i = 1; i < data.length; i ++) {
			var tempObj = {};
			var items = data[i].split('|');
			items = removeCharFromLastElement('\r', items);
			for (var j = 0; j <headers.length; j ++) {
				tempObj[headers[j]] = items[j];
			}

			tempArray.push(tempObj);
		}

		// pretty json with insertion of 4 white spaces
		var jsonData = JSON.stringify(tempArray, null, 4);
		var write = fs.writeFile(output, jsonData, function(err){
			if (err) throw err;
			console.log('RxTerms JSON data has been written to a file!');
		})


	});

}

text2json('./test_data/RxTerms201405.txt', 'RxTerms.json');