(function() {
	/**
	 * @class TextField
	 * @constructor
	 */
	Flex.TextField = function(config) {
		config = config || {};
		Flex.extend(this, new Flex.DisplayObject(config), config);
		this.textFormat = config.textFormat || null;
		this._text = config.text || null;
		this.lines = [];
		this.cacheAsBitmap = false;
		this._lineHeight = 24;
		

		Object.defineProperties(this, {
			textWidth : {
				get : function() {
					context.save();
					this.setContext();
					var textWidth = context.measureText(this.text).width;
					context.restore();
					return textWidth;
				}
			},
			text:{
				get:function(){
					return this._text;
				},
				set:function(value){
					if(this._text!=value){
						this._text = value;
						context.save();
						this.setLine();
						context.restore();
					}
				}
			},
			lineHeight:{
				get:function(){
					return this._lineHeight;
				},
				set:function(value){
					if(this._lineHeight!=value){
						this._lineHeight = value;
					}
				}
			}
		});

	}

	Flex.TextField.prototype = {
		constructor : Flex.TextField,
		render : function() {
			var text = this.text;
			if(text && text.length) {
				context.save();
				this.setContext();
				var lines = this.lines;
				var len = lines.len;
				for(var i=0;i<len;i++){
					context.fillText(lines[i], this.stageX, this.stageY+this.lineHeight*i);
				}
				context.restore();
			}
		},
		setContext : function() {
			var format = this.textFormat;
			context.font = format.weight + " " + format.size + "px " + format.font;
			context.fillStyle = format.color;
			context.textAlign = format.align;
			context.textBaseline = format.baseline;
		},
		setLine : function() {
			this.setContext();
			var text = this.text;
			var len = text.length;
			var currentLine = '';
			var width = this.width;
			if(width && width < this.textWidth) {
				for(var i = 0; i < len; i++) {
					if(context.measureText(currentLine).width>=width){
						this.lines.push(currentLine);
						currentLine = '';
					}else{
						currentLine += text.indexOf(i);
					}
				}
			}

		}
	}

})();
