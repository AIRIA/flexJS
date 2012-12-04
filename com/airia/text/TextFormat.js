(function(){
	/**
	 * 
	 * @class TextFormat 
	 * @constructor
	 * @description TextFormat类描述字符格式设置信息。
	 */
	Flex.TextFormat = function(config){
		config = config || {};
		/**
		 * @description 字体
		 * @field
		 */
		this.font = config.font||"宋体",
		/**
		 * @description 大小
		 * @field
		 */
		this.size = config.size || 12;
		/**
		 * @description 颜色
		 * @field
		 */
		this.color = config.color || "#333333";
		this.url = config.url || null;
		/**
		 * @description是否有下划线
		 * @field
		 */
		this.underline = config.underline || false;
		/**
		 * @description 是否是斜体
		 * @field
		 */
		this.italic = config.italic || false;
		/**
		 * @description 字体的粗细
		 * @field
		 */
		this.weight = config.weight || 400;
		/**
		 * @description 文本对齐方式
		 * @field
		 */
		this.align = config.align || "left";
		/**
		 * @description 文本底线对齐方式
		 * @field
		 */
		this.baseline = config.baseline || "top";
	}
	
})();
