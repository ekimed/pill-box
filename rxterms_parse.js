var fs = require('fs');

var Rxterm = function(rxcui, generic_rxcui, tty, full_name, rxn_dose_form, full_generic_name, brand_name, display_name, route, new_dose_form, strength, suppress_for, display_name_synonym, is_retired, sxdg_rxcui, sxdg_tty, sxdg_name){
	this.rxcui = rxcui;
	this.generic_rxcui = generic_rxcui;
	this.tty = tty;
	this.full_name = full_name;
	this.rxn_dose_form = rxn_dose_form;
	this.full_generic_name = full_generic_name;
	this.brand_name = brand_name;
	this.display_name = display_name;
	this.route = route;
	this.new_dose_form = new_dose_form;
	this.strength = strength;
	this.suppress_for = suppress_for;
	this.display_name_synonym =display_name_synonym;
	this.is_retired = is_retired;
	this.sxdg_rxcui = sxdg_rxcui;
	this.sxdg_tty = sxdg_tty;
	this.sxdg_name = sxdg_name;
}

// Handle data line by line
var liner = require('stream').Transform({objectMode: true});
liner._transform = function(data, enc, done){
	data = data.toString();
	var lines = data.split('\r');
	// Prevent chunk of data being cut off in the middle
	this._lastLineData = lines.splice(lines.length-1,1)[0] 
	lines.forEach(this.push.bind(this));
	done();
}

liner._flush = function (done) {
     if (this._lastLineData) {
     	this.push(this._lastLineData)
     }
     	this._lastLineData = null
     	done()
}


module.exports = liner;
