var mongoose = require('mongoose');

var scheduleSchema = new mongoose.Schema({
		UID: String,
		morningList: Array,
		afternoonList: Array,
		eveningList: Array,
		trashList: Array
	});

// Schedule model --
var Schedule = mongoose.model('schedule', scheduleSchema, 'schedules');

// Create new schedule object in database
var create = function(model, uid, cb) {
	// Set schedule with new data
	model.UID = uid;
	model.morningList = [];
	model.afternoonList = [];
	model.eveningList = [];
	model.trashList = [];

	// Save new schedule
	model.save(function(err, schedule){
		if (err) {
			console.log('error saving new schedule', err);
		}
		else {
			cb(err, schedule);
		}
	})
}

// Update schedule object
var update = function(schedule, cb){

	// Find schedule by id
	Schedule.findOne({
		UID: schedule.id
	}, function(err, sched){
		if (err) console.log('error: ', err);
		
		// Update schedule
		sched.morningList = schedule.morningList;
		sched.afternoonList = schedule.afternoonList;
		sched.eveningList = schedule.eveningList;
		sched.trashList = schedule.trashList;

		// Save updated schedule
		sched.save(function(err, schedule){
			if (err) console.log('error when saving schedule', err);
			cb(err, schedule);

		})
	})
};

module.exports = {
	Schedule: Schedule,
	create: create,
	update: update
};