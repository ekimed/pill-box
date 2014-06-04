var mongoose = require('mongoose');
var model = require('./models/mongooseQuery.js');
var _ = require('underscore');
var async = require('async');

mongoose.connect('mongodb://localhost/RxTerms');
// var getFullName = function(data, cb) {
// 	for(var i = 0; i < data.length; i++) {
// 	for (var j = 0; j < data[i].length; j++){
// 		if (data[i][j].search(/([0-9]+)/) === -1){
// 			(function(i,j){
// 				// change to regex because there might be multiple synonyms
// 				model.find({DISPLAY_NAME_SYNONYM: data[i][j]}, function(err, docs) {
// 				if (docs.length) {
// 					for(var k = 0; k < docs.length; k++) {
// 						var fullName = docs[k]['FULL_NAME'];
// 						var full_list = data[i]
// 						var abbreviation = data[i][j];
// 						var temp_list = _.without(full_list, abbreviation);
// 						var count = 0;
// 						for(var m = 0; m<temp_list.length; m++){
// 							var indexOfElement = fullName.indexOf(temp_list[m]);
// 							if (indexOfElement > -1) {
// 								count +=1;
// 							}

// 						}
// 						if(count === temp_list.length-2){
// 							var doseForm = docs[k]['NEW_DOSE_FORM'].toLowerCase();
// 							var doseFormToCheck = temp_list[temp_list.length-1].toLowerCase();
// 							if (doseForm === doseFormToCheck) {
// 								cb(fullName, abbreviation);
// 							}
// 						}

// 					}
// 				}
// 			});
// 			})(i,j);
// 		}
			

// 		}
// 	}
		
// }

var data = [ 'HCTZ', '25', 'TRIAMTERENE', '37.5', 'TAB' ];

// var getFullName = function(data, original, cb) {
// 	var cbCalled = false;
// 	for (var j = 0; j < data.length; j++){
// 		if (data[j].search(/([0-9]+)/) === -1){
// 			(function(j){
// 				model.find({DISPLAY_NAME_SYNONYM: data[j]}, function(err, docs) {
// 				if (cbCalled) {
// 					return;
// 				}
// 				if (docs.length) {
// 					for(var k = 0; k < docs.length; k++) {
// 						var fullName = docs[k]['FULL_NAME'];

// 						var full_list = data
// 						var abbreviation = data[j];
// 						var temp_list = _.without(full_list, abbreviation);
// 						var count = 0;
// 						for(var m = 0; m<temp_list.length; m++){
// 							var indexOfElement = fullName.indexOf(temp_list[m]);
// 							if (indexOfElement > -1) {
// 								count +=1;
// 							}

// 						}
// 						if(count === temp_list.length-2){
// 							var doseForm = docs[k]['NEW_DOSE_FORM'].toLowerCase();
// 							var doseFormToCheck = temp_list[temp_list.length-1].toLowerCase();
// 							if (doseForm === doseFormToCheck) {
// 								cbCalled = true;
// 								console.log(fullName);
// 								return cb(fullName)
// 							}
// 						}

// 					}
// 				}
	
// 				});
// 			})(j);

// 		}
			

// 		}
// 		return cb(original);
// 	}
// getFullName(data, 'HCTZ 25/Triameterne 37.5',function(d){
// 	console.log(d);
// })
			
var getFullName = function(data, original, cb) {
	var cbCalled = false;
	for (var j = 0; j < data.length; j++){
		if (data[j].search(/([0-9]+)/) === -1){
			(function(j){
				model.find({DISPLAY_NAME_SYNONYM: data[j]}, function(err, docs) {
				if (cbCalled) {
					return;
				}
				if (docs.length) {
					for(var k = 0; k < docs.length; k++) {
						var fullName = docs[k]['FULL_NAME'];

						var full_list = data
						var abbreviation = data[j];
						var temp_list = _.without(full_list, abbreviation);
						var count = 0;
						for(var m = 0; m<temp_list.length; m++){
							var indexOfElement = fullName.indexOf(temp_list[m]);
							if (indexOfElement > -1) {
								count +=1;
							}

						}
						if(count === temp_list.length-2){
							var doseForm = docs[k]['NEW_DOSE_FORM'].toLowerCase();
							var doseFormToCheck = temp_list[temp_list.length-1].toLowerCase();
							if (doseForm === doseFormToCheck) {
								cbCalled = true;
								return cb(fullName);
							}
						}

					}
				}
				else{
					return cb(original)
				}
			});
			})(j);
		}
			

		}
	}
		
getFullName(data, 'HCTZ 25/ TRIAMTERENE 37.5MG TAB', function(d){
	console.log(d);
})


module.exports = getFullName;
	
