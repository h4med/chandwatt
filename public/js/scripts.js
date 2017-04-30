$(document).ready(function() {
    
  $('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
  });
  
});

var socket = io.connect();   

socket.on('connect', function() {
console.log('connected!', socket.connected);
});

socket.on('disconnect',function(){
console.log('disconnected!', socket.disconnect);
});

socket.on('ts_Watt', function(data){
$('#Watt').text(data);
});

socket.on('ts_Temperature', function(data){
$('#Temperature').text(data);
});

socket.on('ts_WattH', function(data){
$('#WattH').text(data);
});	  
	  