var COUNTDOWN_PRERECORDING_NUMBER = 5;
var COUNTDOWN_RECORDING_NUMBER = 10;
var COUNTDONW_ANIMATION_DURATION_CSS = "0.8"

var STATE_ENUM = ["STOP", "RECORDING"];

var socket = io();


function main(){
	document.addEventListener('DOMContentLoaded', function(){
		init_Countdown();
		setState(0);
	}, false);
	
}

function init_Countdown(){
	var div = document.getElementById("counter-div");
	div.innerHTML = COUNTDOWN_PRERECORDING_NUMBER;
}

socket.on("start_countdown", function (data) {
	startPreRecordingCountdown();
})


function startPreRecordingCountdown(){
	var startingTime = new Date().getTime();
	var x = setInterval(function() {	
		var now = new Date().getTime();
		var count = now - startingTime;
		var div = document.getElementById("counter-div");
		var number = COUNTDOWN_PRERECORDING_NUMBER - Math.floor(count/1000);
		div.innerHTML = number;
		animateDomObjectByID("counter-div", "fadeInDown", COUNTDONW_ANIMATION_DURATION_CSS);
		
		if(number == 0){
			startRecording();
			setState(1);
			startRecordingCountdown();
			clearInterval(x);
		}

	}, 1000);
}

function startRecordingCountdown(){
	var startingTime = new Date().getTime();
	var w = setInterval(function() {	
		var now = new Date().getTime();
		var count = now - startingTime;
		var div = document.getElementById("counter-div");
		var number = COUNTDOWN_RECORDING_NUMBER - Math.floor(count/1000);
		div.innerHTML = number;

		animateDomObjectByID("counter-div", "fadeInDown", COUNTDONW_ANIMATION_DURATION_CSS);
		
		if(number == 0){
			stopRecording();
			setState(0);
			init_Countdown();
			clearInterval(w);
		}

	}, 1000);
}

function startRecording(){
	socket.emit("record_request", "start");
}

function stopRecording(){
	socket.emit("record_request", "stop");
}

function setState(stateEnum){
	var div = document.getElementById("state-div");
	div.innerHTML = STATE_ENUM[stateEnum];
	if(stateEnum==1){
		div.style.color = "red";
	}else{
		div.style.color = "black";
	}
}


main();


function animateDomObjectByID(domObjectID, animateString, animationDuration) {
	var selector = $('#'+domObjectID) 
	selector.addClass('animated '+animateString);
	selector.css("animation-duration", animationDuration+"s");
	selector.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
		selector.removeClass('animated '+animateString);
	});
}