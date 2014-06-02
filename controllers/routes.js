var fs = require('fs');
var parse = require('../parse.js');
var _ = require('underscore');

module.exports = {
	partials: function (req, res) {
		var name = req.params.name;
		res.render('partials/' + name);
	},


	layout: function(req, res) {
		res.render('layout');
	},

	upload: function(req, res) {
		fs.readFile(req.files.file.path, function(err, data) {
			var d = data.toString();
			// var titlesArray = parse.parseSection(d);

			var data = parse.splitToSectionTitle(d)
			var medHistoryData = parse.getMedHistoryData(data);

			var indices = parse.getIndicesOfElements(medHistoryData);

			var medications = parse.splitByMed(indices, medHistoryData);

			var medicationsArrObj = parse.toKeyValue(medications);

			var medicationsObj = parse.medListToJsonFormat(medicationsArrObj);

			// console.log(medicationsObj);

			res.send({data:medicationsObj});			
		});
	}

	// dataPost: function(req, res) {
	// 	var data = req.query;
	// 	console.log(data);
	// 	res.send(data);
	// }
}