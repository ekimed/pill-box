var mongoose = require('mongoose');

var medSchema = new mongoose.Schema({
				RXCUI: String, 
				GENERIC_RXCUI: String, 
				TTY: String,
				FULL_NAME: String,
				RXN_DOSE_FORM: String, 
				FULL_GENERIC_NAME: String, 
				BRAND_NAME: String, 
				DISPLAY_NAME: String,
				ROUTE: String, 
				NEW_DOSE_FORM: String, 
				STRENGTH: String, 
				SUPPRESS_FOR: String, 
				DISPLAY_NAME_SYNONYM: String,
				IS_RETIRED: String, 
				SXDG_RXCUI: String, 
				SXDG_TTY: String, 
				SXDG_NAME: String
			});
var medData = module.exports = mongoose.model('medication', medSchema);

