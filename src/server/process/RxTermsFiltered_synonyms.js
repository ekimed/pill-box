// Filter RxTerm JSON by synonym >> remove all objects with empty string as synonym
var fs = require('fs');

function filterEmpty(input, output, property) {
	var reader = fs.readFile(input, 'utf-8', function(err, data) {
		if(err) throw err;
		data = JSON.parse(data);
		data = data.filter(function(d){
			return d[property] !== '';
		})

		// console.log(data);
		var jsonData = JSON.stringify(data, null, 4);
		var write = fs.writeFile(output, jsonData, function(err){
			if (err) throw err;
			console.log('RxTerms filtered by synonym has been written to a file!');
		})
	})
}

filterEmpty('RxTerms.json','RxTermsSynonyms.json', 'DISPLAY_NAME_SYNONYM');