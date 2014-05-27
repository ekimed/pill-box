var express = require('express');
var bodyParser = require('body-parser');
var routes = require('./controllers/routes.js');
var path = require('path')

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(__dirname + '/public'));
app.use(bodyParser());

app.get('/', function(req, res) {
	res.render('layout');
});

app.get('*', function(req, res){
	res.render('layout');
})

app.get('/partials/:name', routes.partials);

var server = app.listen(8759, function() {
	console.log('Express server listening on port ' + server.address().port);
});
