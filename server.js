var http = require('http')
var express = require('express');
var request = require('superagent');
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

  request
    .post('http://api.foundry.att.net:9001/a1/nca/interaction/subscribe')
    .send({
      "sessionId": req.body.eventNotification.callSessionIdentifier,
      "notifyURL": "http://atthackathon.azurewebsites.net/collectEvent",
      "type": "play"
    })
    .set('Authorization','Bearer hiTzTf0ox3Cry8wGKeGOrzschFQl')
    .set('Content-Type','application/json')
    .set('Content-Length','0')
    .end(function(err, res){

      if (err) {
        console.log('Error subscribing');
        console.log(err);
      } else {

        request
          .post('http://api.foundry.att.net:9001/a1/nca/interaction/play')
          .send({
            "sessionId": req.body.eventNotification.callSessionIdentifier,
            "callPartyL": ["9175876292"],
            "playURL": "http://www.clayloomis.com/Sounds/simpyoinkhomer3.wav",
            "playFormat": "audio"
          })
          .set('Authorization','Bearer hiTzTf0ox3Cry8wGKeGOrzschFQl')
          .set('Content-Type','application/json')
          .set('Content-Length','0')
          .end(function(err, res){
            if (err) {
              console.log('Error playing');
              console.log(err);
            } else {
              console.log('MMok');
            }
          });
      }
    });



  res.send('OK');
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

  res.send('OK');
});



var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
