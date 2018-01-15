var keyhook = require('node-win32-keyhook');
var app = require('express')();
var WebSocket = require('ws'), ws = new WebSocket('ws://localhost:4444');

//--------------- Express + SocketIO for webpage ------------------- // 
 var __dirname = "./public/"
 
 /* serves main page */
 app.get("/", function(req, res) {
    res.sendfile( __dirname +'index.html');
 });
 
  app.post("/user/add", function(req, res) { 
	/* some server side logic */
	res.send("OK");
  });
 
 /* serves all the static files */
 app.get(/^(.+)$/, function(req, res){ 
     console.log('static file request : ' + req.params);
     res.sendfile( __dirname + req.params[0]); 
 });
 
 var port = process.env.PORT || 5000;
 var server = app.listen(port, function() {
   console.log("Listening on " + port);
 });
 

 var io = require('socket.io').listen(server);
 io.on('connection', function(socket){
    console.log('New Socket Client !'); 

    socket.on('record_request', function(data){
    	console.log('record_request');
    	if(data == "start"){
    		startRecording();
    	}
    	if(data == "stop"){
    		startRecording();
    	}
    })
 });


//----------------------- Keyhook ------------------------- //
 
function key_down(keycode) { // A function that converts the keycode to hexadecimal notation 
    console.log('Key Down: 0x'+parseInt(keycode).toString(16))
    if(parseInt(keycode).toString(16) === '76'){ //F7
    	StartCountdown();
    }
}
 
function key_up(keycode) { // A function that converts the keycode to hexadecimal notation 
    console.log('Key Up: 0x'+parseInt(keycode).toString(16))
}
 
keyhook.create(key_down, key_up); // Create the hook, and set the key_down and key_up callback 

function startRecording() {
	var json = {"request-type": "StartStopRecording", "message-id": "abcd"}
    ws.send(JSON.stringify(json));
}

//--------------- Websocket to control Open Brodcaster Software ------------------- //
ws.on('open', function() {
	console.log('Connected !');
	// var json = {"request-type": "StartStopRecording", "message-id": "abcd"}
 //    ws.send(JSON.stringify(json));
});
ws.on('message', function(message) {
    console.log('received: %s', message);
});

 
//keyhook.destroy(); // Remove the hook 

//----------------------- Fonction Logic ------------------------- //
function StartCountdown(){
	io.sockets.emit('start_countdown');
}