(function(){
	/**
	 * 圆形的遮罩区域
	 */
	Flex.RoundMask = function(config){
		this.x = config.x || 0;
		this.y = config.y || 0;
		this.radius = config.radius;
	}
	
	Flex.RoundMask.prototype = {
		constructor:Flex.RoundMask,
		start:function(){
			context.save();
			context.beginPath();
			context.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
			context.clip();
			context.closePath();
		},
		end:function(){
			context.restore();
		}
	}
})();
