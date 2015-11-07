var http = require('http')
var express = require('express');

var app = express();
var port = process.env.PORT || 1337;
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var events = [];
var calls = [];

app.get('/events',function(req, res) {
  res.json(events);
});

app.get('/calls',function(req, res) {
  res.json(events);
});

app.post('/notifyEvent', function(req, res) {
  events.push(req.body.eventNotification);
  res.send(events);
});

app.post('/collectEvent', function(req,res) {
/*
​{"eventNotification": {
     "callSessionIdentifier": "",
     "calledParticipant": "",
     "callingParticipant": "",
     "callingParticipantName": "",
     "eventDescription": {"mediaResponse": "1"},
     "rel": "PlayAndCollectInteractionSubscription",
     "notificationType": "PlayAndCollect",
     "reference": "1234-abcd_CS1",
     "responseFrom": "sip:+15552226806@foundry.att.com"
}}
*/
  var selectedOption = req.body.eventNotification.eventDescription.mediaResponse;
  var phone = req.body.eventNotification.responseFrom;

  calls.push({
    selectedOption: selectedOption,
    phone: phone
  });

});



var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
