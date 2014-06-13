var fs = require('fs');
var parse = require('../process/parse.js');
var _ = require('underscore');
var mongoose = require('mongoose');
var model = require('../models/mongooseQuery.js');
var async = require('async');
var ScheduleModel = require('../models/scheduleModel.js');


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
			function generateUIDNotMoreThan1million() {
    			return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4);
    		}

    		var uid = generateUIDNotMoreThan1million();
    		var schedule = new ScheduleModel({UID: uid});

			var d = data.toString();

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
			// an array of arrays that hold words
			var lines = [];
			for(var i = 0; i < medicationsObj.length; i ++) {
				var test = medicationsObj[i]['Medication'].split(/[\s\/]+/);
				test = _.without(test, '');
				for(var j = 0; j<test.length; j++){
					var isMgTrue = test[j].indexOf('MG');
					if ( isMgTrue > -1) {
						test[j] = test[j].slice(0,isMgTrue);
					}
				}
				lines.push(test);
			};

			function getFullName (arrayOfObjects, line, word){
				for(var i = 0; i < arrayOfObjects.length; i++){
					var fullName = JSON.stringify(arrayOfObjects[i]);
					var wordsToCheck = _.without(line, word);
					var re = wordsToCheck.join('[\\/\\sa-z\\.]+');
					re = new RegExp('('+re+')', 'img');

					if(fullName.search(re) != -1){
						return fullName;
					}
					else{
						continue;
					}
				}
					
			};

			var lineFns = lines.map(function(line){
				return function(cbLines){
					var wordFns = line.map(function(word){
						return function(cbWords){
							model.find({DISPLAY_NAME_SYNONYM: word}, function(err, docs){
								if(docs.length === 0){
									// null for error and null for value because no match found
									cbWords(null, null);
								}
								else{
									var match = getFullName(docs, line, word);
									// return all the documents with synonym
									cbWords(null, match);
								}
							});
						};
					});
					// run the word functions and pass it to cbLines
					async.parallel(wordFns, cbLines);
				};
			});

			async.parallel(lineFns, function(err, results){
				for(var i = 0; i < results.length; i++){
					var result = _.without(results[i], null);
					// There should only be one match
					// Index of match should therefore be 0
					if (result.length){
						var match = JSON.parse(result[0]);

						medicationsObj[i]['Medication'] = match['FULL_NAME'].toUpperCase();
						medicationsObj[i]['Instructions'] = medicationsObj[i]['Instructions'].toLowerCase();

					}
					else{
						// check to see if CAP is abbreviated and if found change to capsule
						if(medicationsObj[i]['Medication'].search(/CAP/m) != -1){

							medicationsObj[i]['Medication'] = medicationsObj[i]['Medication'].replace(/CAP/, 'CAPSULE');
						}
						// check to see if TAB is abbreviated and if found change to tablet
						else if(medicationsObj[i]['Medication'].search(/TAB/m) != -1){
							medicationsObj[i]['Medication'] = medicationsObj[i]['Medication'].replace(/TAB/, 'TABLET');
						}
						medicationsObj[i]['Instructions'] = medicationsObj[i]['Instructions'].toLowerCase();
					}

				}

				res.send({data:medicationsObj, firstName: firstName, schedule: schedule});
			});

						
		});
	}
}
