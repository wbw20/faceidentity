var express = require('express');
var request = require('request');

var app = express();
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('pages/index');
});

app.post('/detect', function(req, res) {
  request.post('https://api.projectoxford.ai/face/v1.0/detect?returnFaceId=true', {
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': 'd30a56d36d634581b9ed4b39a9419969'
    },
    json: {
      url: 'https://scontent-sea1-1.xx.fbcdn.net/hphotos-xfa1/v/t1.0-9/391584_4404273781433_1216832326_n.jpg?oh=4e7d0161491434586da2249bf5d5fcb8&oe=5770706B'
    }
  }, function (error, response, body) {
    if (error) { console.log(error); }

    res.send(body);
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


