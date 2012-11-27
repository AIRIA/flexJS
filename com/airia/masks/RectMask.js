(function(){
	/**
	 * 矩形的遮罩区域
	 */
	Flex.RectMask = function(config){
		this.x = config.x || 0;
		this.y = config.y || 0;
		this.width = config.width;
		this.height = config.height;
	}
	
	Flex.RectMask.prototype = {
		constructor:Flex.RectMask,
		start:function(){
			context.save();
			context.beginPath();
			context.rect(this.x,this.y,this.width,this.height);
			context.clip();
			context.closePath();
		},
		end:function(){
			context.restore();
		}
	}
	
})();
