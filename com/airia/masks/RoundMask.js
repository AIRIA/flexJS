(function(){
	/**
	 * 圆形的遮罩区域
	 */
	Flex.RoundMask = function(config){
		Flex.extend(this,new Flex.BaseMask(config));
		this.radius = config.radius;
	}
	
	Flex.RoundMask.prototype = {
		constructor:Flex.RoundMask,
		start:function(){
			context.save();
			context.beginPath();
			context.arc(this.stageX,this.stageY,this.radius,0,Math.PI*2,false);
			context.clip();
			context.closePath();
		},
		end:function(){
			context.restore();
		}
	}
})();
