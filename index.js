var express   = require('express');
var parser    = require('body-parser')
var request   = require('request');
var _         = require('underscore');
var Datastore = require('nedb');

var db        = new Datastore({
  filename: 'data/images.db',
  autoload: true
});

var app = express();
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

var FACE_LIST_ID    = 1;
var PERSON_GROUP_ID = 1;
var API_KEY         = 'd30a56d36d634581b9ed4b39a9419969';

var TEMP_PERSON_ID  = 'dae198aa-1c39-4e5b-a4a7-508b898a0539';

var FAKE_URL = 'https://scontent-sea1-1.xx.fbcdn.net/hphotos-xlp1/v/t1.0-9/64478_10153868872152238_4474973203269182590_n.jpg?oh=181f4706e6ff6868def35fb16df29a06&oe=575E1BFB';

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

    if (body[0]) {
      db.find({ id: body[0].persistedFaceId }, function (err, docs) {
        console.log(docs);
        res.send(docs);
      });
    } else {
      res.send([]);
    }
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
