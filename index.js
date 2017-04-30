var DEBUG = true;

var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var getJSON=require('get-json');

/*
io.set('heartbeat timeout', 3000);
io.set('heartbeat interval', 1000);
*/

server.listen(process.env.PORT || 5000, function(){
	if (DEBUG) console.log('[ Welocme :) ]\nlistening on port ');
});

app.use(express.static(__dirname + "/public"));

io.on('connection', function(socket){
	console.log('a user conneced!');
	socket.on('disconnect',function(){
		console.log('user disconnected!');
	});
});


var Accu=0;
var WattH;

function readFromTS() {

	//getJSON('http://api.thingspeak.com/channels/250169/feeds.json?results=5?api_key=0IQ714JPWHFP72FK',function(error, resp){
	getJSON('http://api.thingspeak.com/channels/250169/feed/last.json?api_key=0IQ714JPWHFP72FK',function(error, resp){

		if (resp) {
		    console.log("Entre ID: ", resp.entry_id);
		    console.log("Field 1: ", resp.field1);
		    console.log("Field 2: ", resp.field2);
		    
		    io.emit('ts_Watt', resp.field1);
		    io.emit('ts_Temperature', resp.field2);
		    if(resp.field3){
		    	io.emit('ts_WattH', resp.field3);
		    	console.log("Field 3:", resp.field3);
			Accu = 0;

		    }
		    else{
			Accu += Number(resp.field1);
			WattH = Accu / 1200;
			WattH = WattH.toFixed(1);

			io.emit('ts_WattH', WattH);
			console.log("Field 3 [cal]: ", WattH);
		    }
		}
		else {
		  console.log("getChannelFeeds Error:" +err);
		}
		
		console.log("-----------------------------\n");	

	});

	setTimeout(function(){readFromTS()}, 2000);
	
}

readFromTS();
