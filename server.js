var http = require('http')
var express = require('express');

var app = express();
var port = process.env.PORT || 1337;
var bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/',function(req, res) {
  res.send('events');
});

app.get('/count',function(req, res) {
  res.send('12345');
});

app.post('/notifyEvent', function(req, res) {
  console.log(req.body);
  res.json(req.body);
});



var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
