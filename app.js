var express = require('express');
var bodyParser = require('body-parser');
var routes = require('src/server/routes/routes.js');
var mongoose = require('mongoose');
var multipart = require('connect-multiparty');


var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static('../public'));
app.use(bodyParser());
app.use(multipart());

// Connect to database
//mongoose.connect(process.env.MONGOHQ_URL||'mongodb://localhost/RxTerms');
mongoose.connect('mongodb://localhost/medications');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback (){
	console.log('mongodb was successfully connected');
});
app.get('/', routes.layout);
app.get('/partials/:name', routes.partials);
app.post('/fileupload', routes.upload);
app.get('/rxterms', routes.rxterms);
app.get('*', routes.layout);




var port = Number(process.env.PORT || 8759)
var server = app.listen(port, function() {
	console.log('Express server listening on port ' + server.address().port);
});
