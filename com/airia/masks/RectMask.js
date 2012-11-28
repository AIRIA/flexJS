(function(){
	/**
	 * 矩形的遮罩区域
	 * mask的坐标都是相对于被遮罩的显示对象的的 
	 */
	Flex.RectMask = function(config){
		Flex.extend(this,new Flex.BaseMask(config));
		this.width = config.width;
		this.height = config.height;
		//被遮罩的对象
		this.owner = null;
	}
	
	Flex.RectMask.prototype = {
		constructor:Flex.RectMask,
		start:function(){
			var owner = this.owner;
			context.save();
			context.beginPath();
			context.rect(this.stageX,this.stageY,this.width,this.height);
			context.clip();
			context.closePath();
		},
		end:function(){
			context.restore();
		}
	}
	
})();
