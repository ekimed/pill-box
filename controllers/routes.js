var fs = require('fs');
var parse = require('../process/parse.js');
var _ = require('underscore');
var mongoose = require('mongoose');
var model = require('../models/mongooseQuery.js');
var async = require('async');
var searchFullName = require('../fullNameSearch.js');


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
			var personalInfoSection = data['MY HEALTHEVET PERSONAL INFORMATION REPORT'];

			var firstName = parse.getFirstName(personalInfoSection);

			var medHistoryData = parse.getMedHistoryData(data);

			var indices = parse.getIndicesOfElements(medHistoryData);

			var medications = parse.splitByMed(indices, medHistoryData);

			var medicationsArrObj = parse.toKeyValue(medications);

			var medicationsObj = parse.medListToJsonFormat(medicationsArrObj);

			// split on spaces and '/'
			// each medication is split into an array
			var data = [];
			// only show active medications
			medicationsObj = medicationsObj.filter(function(d){
				return d['Status'] === ' Active';
			})

			// medicationsObj.forEach(function(d){
			// 	var test = d['Medication'].split(/[\s\/]+/);
			// 	test = _.without(test, '');
			// 	for(var i = 0; i<test.length; i++){
			// 		var isMgTrue = test[i].indexOf('MG');
			// 		if ( isMgTrue > -1) {
			// 			test[i] = test[i].slice(0,isMgTrue);
			// 		}

			// 		// searchFullName(test, d['Medication'], function(data){
			// 		// 	console.log('searchFullName',data);
			// 		// })
			// 	}
			// 	searchFullName(test, d['Medication'], function(data){
			// 		console.log('searchFullName',data);
			// 	})
			// 	// data.push(test);

			// })

			for(var i = 0; i < medicationsObj.length; i ++) {
				var test = medicationsObj[i]['Medication'].split(/[\s\/]+/);
				test = _.without(test, '');
				for(var j = 0; j<test.length; j++){
					var isMgTrue = test[j].indexOf('MG');
					if ( isMgTrue > -1) {
						test[j] = test[j].slice(0,isMgTrue);
					}
				}
				searchFullName(test, medicationsObj[i]['Medication'], function(data){
					console.log('data',data)
				})
			}

			


			// searchFullName(data, function(fullname, abbreviation){
			// 	console.log(fullname, abbreviation);
			// })

			res.send({data:medicationsObj, firstName: firstName});			
		});
	}
}
