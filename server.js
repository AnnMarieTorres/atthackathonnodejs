var http = require('http')
var express = require('express');

var app = express();
var port = process.env.PORT || 1337;
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var events = [];

app.get('/events',function(req, res) {
  res.json(events);
});

app.post('/notifyEvent', function(req, res) {
  events.push(req.body.eventNotification);
  res.send(events);
});



var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
