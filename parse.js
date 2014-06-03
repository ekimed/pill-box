// use streams to make sure that only a small buffer is kept in memory at any given time

// Transform stream: streams that read input, process data, output new data
var fs = require('fs');
var _ = require('underscore');
module.exports = {
	splitToSectionTitle: function(d) {
		var indexObj = {};
		var test = d.split(/^[-]+ ([\w ]*) [-]+$/m);
		var test1 = _.without(test, '');
		for (var i = 0; i < test1.length-1; i += 2) {
			indexObj[test1[i]] = test1[i+1];
		}
		return indexObj;
	},

	getMedHistoryData: function(obj){
		var keyValuePattern = /([A-Za-z ])+:([\w \/\.\-\(\)@])+/mg;
		var medHistorySection = obj['VA MEDICATION HISTORY'].match(keyValuePattern);
		return medHistorySection;

	},

	getIndicesOfElements: function(arr) {
		var indices = [];
		for (var i = 0; i < arr.length; i++) {
			var isMedication = arr[i].search(/Medication/);
			if (isMedication != -1) {
				var index = arr.indexOf(arr[i]);
				indices.push(index);
			}
		}

		return indices;
	},

	splitByMed: function(indices, medHistoryData) {
		var sectionsArray = [];
		var start = 0;
		for (var i = 0; i < indices.length; i++) {
			var subArray = medHistoryData.slice(start,indices[i]);
			sectionsArray.push(subArray);

			start = indices[i];
		}
		return sectionsArray;
	},

	toKeyValue: function(arr) {
		var medicationData = [];
		for (var i = 0; i < arr.length; i ++) {
			var temp = [];
			for (var j = 0; j < arr[i].length; j ++) {
				var test = arr[i][j].split(':');
				temp.push(test);
			}
			medicationData.push(temp);
		}

		return medicationData;
	},

	medListToJsonFormat: function(arr) {
		var finalMedListData = [];
		for (var i = 0; i < arr.length; i ++) {
			var tempObject = {};
			for (var j = 0; j < arr[i].length; j ++) {
				tempObject[arr[i][j][0]] = arr[i][j][1];
			}
			finalMedListData.push(tempObject);
		}
		finalMedListData.shift();
		return finalMedListData;
	},

	getFirstName: function(string) {
		var keyPattern = /Name:[A-Z ,-]+,\s([A-Z]+)/
		var match = string.match(keyPattern);
		return match[1]
	}


};
