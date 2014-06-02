var express = require('express');
var bodyParser = require('body-parser');
var routes = require('./controllers/routes.js');
var path = require('path');
var multipart = require('connect-multiparty');



var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser());
app.use(multipart());

//RESTful Routes
// app.post('/fileupload', routes.upload)

app.get('/', routes.layout);
app.get('/partials/:name', routes.partials);
app.post('/fileupload', routes.upload);
// app.get('/fileupload', routes.dataPost);
app.get('*', routes.layout);





var server = app.listen(8759, function() {
	console.log('Express server listening on port ' + server.address().port);
});
