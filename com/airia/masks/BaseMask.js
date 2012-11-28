(function(){
	/**
	 * 遮罩的区域的坐标都是相对于owner的坐标系
	 * 在执行clip的时候 都是使用stageX stageY 来作为绘制的X Y
	 * 而且在设置遮罩后 遮罩的区域和owner的交叉区域将作为owner的可点击区域
	 */
	Flex.BaseMask = function(config){
		config = config || {};
		this.x = config.x || 0;
		this.y = config.y || 0;
		//被遮罩的对象
		this.owner = null;
		Object.defineProperties(this,{
			stageX:{
				get:function(){
					return this.x+this.owner.stageX;
				}
			},
			stageY:{
				get:function(){
					return this.y+this.owner.stageY;	
				}
			}
		});
	};
})();
