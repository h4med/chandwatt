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
server.listen(3000, function(){
	if (DEBUG) console.log('[ Welocme :) ]\nlistening on port 3000 ...');
});

app.use(express.static(__dirname + "/public"));

io.on('connection', function(socket){
	console.log('a user conneced!');
	socket.on('disconnect',function(){
		console.log('user disconnected!');
	});
});



function readFromTS() {

	//getJSON('http://api.thingspeak.com/channels/250169/feeds.json?results=5?api_key=0IQ714JPWHFP72FK',function(error, resp){
	getJSON('http://api.thingspeak.com/channels/250169/feed/last.json?api_key=0IQ714JPWHFP72FK',function(error, resp){

		if (resp) {
		    console.log(resp.entry_id);
		    console.log(resp.field1);
		    console.log(resp.field2);
		    
		    io.emit('ts_Watt', resp.field1);
		    io.emit('ts_Temperature', resp.field2);
		    if(resp.field3){
		    	io.emit('ts_WattH', resp.field3);
		    	console.log(resp.field3);
		    }
		}
		else {
		  console.log("getChannelFeeds Error:" +err);
		}	

	});

	setTimeout(function(){readFromTS()}, 2000);
}

readFromTS();
