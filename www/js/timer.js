var timerCurrent;
var timerSeconds;
var timerFinish;
var timer;

function drawTimer(percent){
    jQuery('#timer').html('<div class="percent"></div><div id="slice"'+(percent > 50?' class="gt50"':'')+'><div class="pie"></div>'+(percent > 50?'<div class="pie fill"></div>':'')+'</div>');
    var deg = 360/100*percent;
    jQuery('#slice .pie').css({
        '-moz-transform':'rotate('+deg+'deg)',
        '-webkit-transform':'rotate('+deg+'deg)',
        '-o-transform':'rotate('+deg+'deg)',
        'transform':'rotate('+deg+'deg)'
    });
    jQuery('.percent').html(Math.round(percent)+'%');
}

function stopWatch(){
    var seconds = (timerFinish-(new Date().getTime()))/1000;
    if(seconds <= 0){
        drawTimer(100);
        clearInterval(timer);
    }else{
        var percent = 100-((seconds/timerSeconds)*100);
        drawTimer(percent);
    }
}

function startTimer(){
	timerCurrent = 0;
	timerSeconds = 30;
	timerFinish = new Date().getTime()+(timerSeconds*1000);
	drawTimer(100);
	timer = setInterval('stopWatch()',50);
}

function stopTimer(){
	clearInterval(timer);
}