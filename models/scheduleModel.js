var mongoose = require('mongoose');

var scheduleSchema = new mongoose.Schema({
		UID: String,
		morningList: Array,
		afternoonList: Array,
		eveningList: Array
	});

var scheduleData = module.exports = mongoose.model('schedList', scheduleSchema);