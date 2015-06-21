/**
 * Created by eunicekim on 6/20/15.
 */
var fs = require('fs');
var es = require('elasticsearch');
var _ = require('underscore');
var client = new es.Client({
    host: 'localhost:9200',
    log: 'trace'
});
var body = [];

// read the data file and create the bulk request
function createDoc (callback) {
    fs.readFile('../test_data/RxTerms.json','utf-8', function (err, data) {
        if (err) return callback(err);

        var header = {
            'create' : {
                _index: 'rxterms',
                _type: 'Drug'
            }
        };

        data = JSON.parse(data);

        _.each(data, function (i) {
            body.push(header);
            body.push(i);
        });

        callback(null, body);
    });
}

function makeRequest (bulkRequest, cb) {
    client.bulk({
        body: bulkRequest
    }, function (err, res) {
        if (err) cb(err);

        cb(null, res);
    });
}

createDoc(function (err, doc) {
    if (err) console.error(err);

    makeRequest(doc.slice(0,1000), function (err, res) {
        if (err) throw err;

        doc = doc.slice(1000);

        if (doc.length > 0) {
            setTimeout(createDoc, 10);
        } else {
            console.log('Inserted all records.');
        }
    });
});


