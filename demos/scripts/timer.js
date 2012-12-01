(function(){
	var stage = new Flex.Stage("myCanvas");
	stage.frameRate = 60;
	var bitmapdata = new Flex.BitmapData("http://cdn-img.easyicon.cn/png/5221/522185.png");
	var bitmap = new Flex.Bitmap(bitmapdata);
	stage.addChild(bitmap);
	//现在开始写Timer的用法
	//两个参数 第一个delay 事件间隔
	//第二个 执行多少次 如果不写的话 或者为0 则永久执行
	var timer = new Flex.Timer(1000/stage.frameRate,100);
	//TIMER是每次达到时间间隔 都会执行
	timer.addEventListener(TimerEvent.TIMER,timerHandler);
	//真个timer事件执行完毕后触发该事件
	timer.addEventListener(TimerEvent.TIMER_COMPLETE,timerCompHandler);
	//调用start()方法来启动timer
	timer.start();
	function timerHandler(event){
		bitmap.x+=3;
		bitmap.y++;
		bitmap.width--;
		bitmap.alpha -= 0.005;
	}
	
	function timerCompHandler(event){
		trace("timer complete 事件触发");
	}
	
})();
