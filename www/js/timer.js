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
	timerSeconds = 18;
	timerFinish = new Date().getTime()+(timerSeconds*1000);
	drawTimer(100);
	timer = setInterval('stopWatch()',50);
}

function stopTimer(){
	clearInterval(timer);
}


var colorsWrong = ['#FF9800','#FFF','#FF9800','#FFF','#FF0000'];
var colorCorrect = ['#FF9800','#FFF','#FF9800','#FFF','#60FF00'];

function efectAnsweredQuestion(correct, id){
    var colors = colorCorrect;
    if(correct === false){
        colors = colorsWrong;
    }
    jQuery('#'+id).css('background',colors[0]);
    var cont = 1;
    var a = setInterval(function(){
        jQuery('#'+id).css('background',colors[cont]);
        cont++;
        if(cont === 6){
            clearInterval();
            setTimeout(function() {
                jQuery('#'+id).css('background','#EDEEF0');
                jQuery('#blockScreen').css('height', 0);
            }, 1500);
        }
    }, 500)
}