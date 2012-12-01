(function() {
	//参数是canvas domID
	var stage = new Flex.Stage("myCanvas");
	//可以通过设置frameRate属性来动态改变渲染的帧率 我们将FPS设置成60
	stage.frameRate = 60;
	/**
	 * BitmapData接收两个参数 第一个是图片的src 第二个是截取图片的大小和坐标信息 是一个JSON对象
	 * {x,y,width,height} 如果没有设置第二个参数的话 就会取图像的实际大小
	 */
	var bmd1 = new Flex.BitmapData("http://cdn-img.easyicon.cn/png/5221/522185.png");
	//bitmap接受
	var bitmap = new Flex.Bitmap(bmd1);
	bitmap.x = 100;
	bitmap.y = 100;
	stage.addChild(bitmap);
	//到目前为止一张原始尺寸的图片就出来了 下面我们来给他添加点击事件来更新图片的尺寸和坐标信息
	bitmap.addEventListener("click", clickHandler);
	//方法中我们来更新尺寸 同时来更新舞台的大小
	function clickHandler(event) {
		bitmap.width = 100;
		bitmap.height = 100;
		bitmap.x = 200;
		trace("ok");
	}

})()