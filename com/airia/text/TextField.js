(function(){
	/**
	 * @class TextField
	 * @constructor
	 */
	Flex.TextField = function(config){
		config = config || {};
		Flex.extend(this,new DisplayObject(config),config);
		this.textFormat = config.textFormat || null;
		this.text = config.text || null;
	}
	
	Flex.TextField.prototype = {
		constructor:Flex.TextField,
		render:function(){
			var text = this.text;
			if(text&&text.length){
				var format = this.textFormat;
				context.save();
				context.font = format.weight+" "+format.size+"px "+format.font;
				context.fillStyle = format.color;
				context.textAlign = format.align;
				context.textBaseLine = format.baseline;
				context.fillText(text,this.stageX,this.stageY);
				context.restore();
			}
		}
	}
	
})();
