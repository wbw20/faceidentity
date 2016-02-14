var express = require('express');
var parser  = require('body-parser')
var request = require('request');
var _       = require('underscore');

var app = express();
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

var FACE_LIST_ID    = 1;
var PERSON_GROUP_ID = 1;
var API_KEY         = 'd30a56d36d634581b9ed4b39a9419969';

var TEMP_PERSON_ID  = 'dae198aa-1c39-4e5b-a4a7-508b898a0539';

var FAKE_URL = 'https://scontent-sea1-1.xx.fbcdn.net/hphotos-xlp1/v/t1.0-9/64478_10153868872152238_4474973203269182590_n.jpg?oh=181f4706e6ff6868def35fb16df29a06&oe=575E1BFB';

var faces = {
  '590fb34c-fe32-4b33-b3c1-bd35c1141e9b': 'https://scontent-sea1-1.xx.fbcdn.net/hphotos-xfa1/v/t1.0-9/391584_4404273781433_1216832326_n.jpg?oh=4e7d0161491434586da2249bf5d5fcb8&oe=5770706B',
  '2e9a219b-090e-42b7-af28-7d4c42333ffc': 'https://scontent-sea1-1.xx.fbcdn.net/hphotos-xlp1/v/t1.0-9/64478_10153868872152238_4474973203269182590_n.jpg?oh=181f4706e6ff6868def35fb16df29a06&oe=575E1BFB',
  '97b968c0-067a-40de-b379-1b6d50b1a546': 'https://scontent-sea1-1.xx.fbcdn.net/hphotos-xfp1/t31.0-8/664754_10151221002066716_1411602027_o.jpg',
  'bde43d80-010e-40dd-a740-bc10124cd19c': 'https://scontent-sea1-1.xx.fbcdn.net/hphotos-xlp1/t31.0-8/10518353_10203445002662182_8170342248603886424_o.jpg'
};

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());

app.get('/', function(req, res) {
  res.render('pages/index');
});

app.post('/detect', function(req, res) {
  request.post('https://api.projectoxford.ai/face/v1.0/detect?returnFaceId=true', {
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': API_KEY
    },
    json: {
      url: req.body.url
    }
  }, function (error, response, body) {
    if (error) { console.log(error); }

    res.send(body);
  });
});

app.get('/similar/:id', function(req, res) {
  request.post('https://api.projectoxford.ai/face/v1.0/findsimilars', {
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': API_KEY
    },
    json: {
      faceListId: FACE_LIST_ID,
      faceId: req.params.id
    }
  }, function (error, response, body) {
    if (error) { console.log(error); }

    res.send(_.map(body, function(item) {
      return _.extend({}, item, {
        url: faces[item.persistedFaceId]
      });
    }));
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
