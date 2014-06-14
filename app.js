var express = require('express');
var bodyParser = require('body-parser');
var routes = require('./controllers/routes.js');
var mongoose = require('mongoose');
var multipart = require('connect-multiparty');


var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser());
app.use(multipart());

// connect to a database with a connection string
var MONGOHQ_URL="mongodb://eunice:pw17@kahana.mongohq.com:10036/app26030681"
mongoose.connect(process.env.MONGOHQ_URL||'mongodb://localhost/RxTerms');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback (){
	console.log('mongodb was successfully connected');
})
app.get('/', routes.layout);
app.get('/partials/:name', routes.partials);
app.post('/fileupload', routes.upload);
app.get('*', routes.layout);



var port = Number(process.env.PORT || 8759)
var server = app.listen(port, function() {
	console.log('Express server listening on port ' + server.address().port);
});
