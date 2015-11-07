var http = require('http')
var express = require('express');
var request = require('request');
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
  console.log(req.body.eventNotification);

  var headers = {
    'User-Agent' : 'request',
    'Authorization' : 'Bearer hiTzTf0ox3Cry8wGKeGOrzschFQl'
  };
  var subscribeForm = {
    "sessionId": req.body.eventNotification.callSessionIdentifier,
    "notifyURL": "http://atthackathon.azurewebsites.net/collectEvent",
    "type": "play"
  };
  var subcribeOptions = {
    url: 'http://api.foundry.att.net:9001/a1/nca/interaction/subscribe',
    method: 'POST',
    headers: headers,
    form: subscribeForm
  };

  request(subcribeOptions, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);

        var headers = {
          'User-Agent' : 'request',
          'Authorization' : 'Bearer hiTzTf0ox3Cry8wGKeGOrzschFQl'
        };

        var playForm = {
          "sessionId": req.body.eventNotification.callSessionIdentifier,
          "callPartyL": ["9175876292"],
          "playURL": "http://www.clayloomis.com/Sounds/simpyoinkhomer3.wav",
          "playFormat": "audio"
        };

        var playOptions = {
          url: 'http://api.foundry.att.net:9001/a1/nca/interaction/play',
          method: 'POST',
          headers: headers,
          form: playForm
        };

    } else {
      console.log(error);
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
