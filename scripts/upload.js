var async     = require('async');
var request   = require('request');
var Datastore = require('nedb');

var db        = new Datastore({
  filename: 'data/images.db',
  autoload: true
});

var urls = require('./images');

var API_KEY      = 'd30a56d36d634581b9ed4b39a9419969';
var FACE_LIST_ID = 1;

async.each(urls, function(url, cb) {
  request.post('https://api.projectoxford.ai/face/v1.0/facelists/' + FACE_LIST_ID + '/persistedFaces', {
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': API_KEY
    },
    json: {
      url: url,
      userData: url
    }
  }, function (error, response, body) {
    if (error) { console.log(error); }

    db.insert({
      id: body.persistedFaceId,
      url: url
    }, cb);
  });
}, function(err) {
  console.log(err);
});
