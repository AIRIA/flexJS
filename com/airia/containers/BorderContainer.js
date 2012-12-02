(function(){
	/**
	 * @class Flex.BorderContainer
	 * @constructor
	 * @param {JSON}
	 * 
	 */
	Flex.BorderContainer = function(config){
		Flex.extend(this,new Flex.Sprite(config),config);
		/**
		 * @description 背景图像
		 * @field
		 */
		this.backgroundImage = null;
		/**
		 * @description 背景颜色
		 * @field
		 */
		this.backgroundColor = "#FFFFFF";
		/**
		 * @description 背景透明度
		 * @field
		 */
		this.backgroundAlpha = 1;
		/**
		 * @description 背景图像的填充模式 repeate scale normal 
		 * @field
		 */
		this.fillMode = "normal";
	}
})();
