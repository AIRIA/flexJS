(function() {
	//所有的类都有Flex的前缀 把Flex添加到了global作用于
	//查找的时候 去flex的作用域下去查找
	//stage的构造方法可以接受两个参数 第一个 canvas的id 第二个是帧率
	//如果省略了第二个参数 那么帧速默认为24FPS
	var stage = new Flex.Stage("appCanvas");
	var sprite = new Flex.Sprite();
	//调用addChild方法就将sprite添加到了舞台上 目前还没有任何效果
	stage.addChild(sprite);
	//下面我们在sprite上进行绘制  目前只能绘制  矩形和圆形
	var graphics = sprite.graphics;
	//绘制一个矩形
	graphics.beginFill("#333333");
	graphics.drawRect(0, 0, 200, 200);
	graphics.endFill();
	//绘制半透明的圆形
	graphics.lineStyle(3,'#CCCCCC','round');
	graphics.beginFill("rgba(23,23,23,0.5)");
	//参数 圆心的坐标 x y 半径radius
	graphics.drawCircle(310, 110, 100);
	graphics.endFill();
})();
