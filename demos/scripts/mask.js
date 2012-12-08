var stage = new Flex.Stage();
stage.frameRate = 60;
var bgBitmap = new Flex.Bitmap(new Flex.BitmapData("http://m3.app111.com/bizhi/big/10/235/777/10235777.jpg"));
stage.addChild(bgBitmap);
var bmd = new Flex.BitmapData("http://www.easyicon.cn/download/png/1093891/96/");
var group = new Flex.Group({
	direction : 'horizontal'
});
group.addEventListener("click",function(){
	alert("ok");
});
for(var i = 0; i < 5; i++) {
	var bm = new Flex.Bitmap(bmd, {
		width : 96,
		height : 96
	});
	group.addChild(bm);
}

stage.addChild(group);

var mask = new Flex.RectMask({
	width : 200,
	height : 100
});

var timer = new Flex.Timer(1000 / 60, 200);
timer.addEventListener(TimerEvent.TIMER, timerHandler);
function timerHandler(event) {
	mask.x += 2
}
bm.addEventListener("click",function(event){
	group.mask = mask;
	timer.start();
})

group.getChildAt(0).addEventListener("click",function(){
	group.mask = mask;
	timer.start();
});
