var http = require('http')
var express = require('express');
var request = require('superagent');
var app = express();
var port = process.env.PORT || 1337;
var bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/static', express.static('public'));

var events = [];
var calls = [];

app.get('/events',function(req, res) {
  res.json(events);
});

app.get('/calls',function(req, res) {
  res.json(events);
});

app.post('/notifyEvent', function(req, res) {
  events.push({ from: req.body.eventNotification.callingParticipant, date: new Date() });


  var subscriptionBody =  {
    "sessionId": req.body.eventNotification.callSessionIdentifier,
    "notifyURL": "http://atthackathon.azurewebsites.net/collectEvent",
    "type": "play"
  };

  console.log('Calling subscribe');
  console.log(subscriptionBody);

  request
    .post('http://api.foundry.att.net:9001/a1/nca/interaction/subscribe')
    .send(subscriptionBody)
    .set('Authorization','Bearer hiTzTf0ox3Cry8wGKeGOrzschFQl')
    .end(function(err, res){

      if (err) {
        console.log('Error subscribing');
        console.log(err);
      } else {

        request
          .post('http://api.foundry.att.net:9001/a1/nca/interaction/play')
          .send({
            "sessionId": req.body.eventNotification.callSessionIdentifier,
            "callPartyL": ["4047241365"],
            "playURL": "http://atthackathon.azurewebsites.net/sound.wav",
            "playFormat": "audio"
          })
          .set('Authorization','Bearer hiTzTf0ox3Cry8wGKeGOrzschFQl')
          .set('Content-Type','application/json')
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



  // +14252363148@1a7c784c5

  var deferredBody = {
    action : {
      decisionId : "1234000000000AAAAAA",
      actionToPerform : "Deferred"
    }
  };

  console.log(deferredBody);
  res.json(deferredBody);
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
