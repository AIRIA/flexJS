(function(){
	var stage = new Flex.Stage("myCanvas");
	var bmd = new Flex.BitmapData("http://nodejs.org/images/logo.png");
	var bitmap = new Flex.Bitmap(bmd);
	stage.addChild(bitmap);
	
	var group1 = new Flex.Group();
	for(var i=0;i<3;i++){
		bmd = new Flex.BitmapData("http://nodejs.org/images/logo.png");
		bitmap = new Flex.Bitmap(bmd);
		bitmap.width = 200;
		bitmap.height = 50;
		group1.addChild(bitmap);
	}
	
	group1.x = 400;
	stage.addChild(group1);
	
	var group2 = new Flex.Group();
	group2.direction = "horizontal";
	for(var i=0;i<3;i++){
		bmd = new Flex.BitmapData("http://nodejs.org/images/logo.png");
		bitmap = new Flex.Bitmap(bmd);
		bitmap.width = 200;
		bitmap.height = 50;
		group2.addChild(bitmap);
	}
	group2.y = group1.measureHeight+100;
	stage.addChild(group2);
	group2.addEventListener("click",function(event){
		if(group2.direction=="vertical"){
			group2.direction = "horizontal";
		}else{
			group2.direction = "vertical";
		}
	});
	group1.addEventListener("click",clickHandler);
	function clickHandler(event){
		trace(event);
		if(group1.direction=="vertical"){
			group1.direction = "horizontal";
		}else{
			group1.direction = "vertical";
		}
	}
})();
