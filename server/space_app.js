var express = require('express');
var gcm = require('node-gcm');

var app = express();

var server = app.listen(3000, function(){
 console.log('The server is running');
});

app.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var device_token;

app.post('/register', function(req, res){
    device_token = req.body.device_token;
    console.log('Device token received');
    console.log(device_token);
    /* TODO: save the device_token into DB */
    res.send('ok');
});

app.get('/push', function(req, res){

    var device_tokens = []; 
    var retry_times = 4; 		

    var sender = new gcm.Sender('AIzaSyB9RClg3QLG3EpWraIZKrnBdXGt420rapU'); 
    var message = new gcm.Message(); 

    message.addData('title', 'Message from Park More');
    message.addData('message', 'TEST: Push Notification from Park More');
    message.addData('sound', 'notification');

    message.collapseKey = 'testing'; 	
    message.delayWhileIdle = true; 		// delay sending while receiving device is offline
    message.timeToLive = 3; 					// number of seconds to keep the message on the server if the device is offline

    /* TODO: add code for fetching device_token from DB */

    device_tokens.push(device_token);

    sender.send(message, device_tokens, retry_times, function(result){
        console.log(result);
        console.log('Push sent to: ' + device_token);
    });

    res.send('ok');
});