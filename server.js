var http = require('http')
var express = require('express');
var app = express();
var port = process.env.PORT || 1337;

var events = [];
var count = 0;

app.get('/',function(req, res) {
  res.send(events);
});

app.get('/count',function(req, res) {
  count = count + 1;
  res.send(count);
});

app.post('/notifyEvent', function(req, res) {
  events.push(req);
  res.send('OK');
});


var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
