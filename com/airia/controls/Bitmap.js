(function() {
	/**
	 * Bitmap 类表示用于表示位图图像的显示对象
	 * @extends Flex.DisplayObject
	 */
	Flex.Bitmap = function(bmd, rect) {
		Flex.extend(this, new Flex.DisplayObject());
		if(bmd) {
			this.bitmapData = bmd;
		} else {
			throw new Error("Bitmap的bitmapData参数不能为空");
		}
		if(rect) {
			this.width = rect.w;
			this.height = rect.h;
		}
		Object.defineProperties(this, {
			rect : {
				get : function() {
					return this._rect;
				},
				set : function(value) {
					if(this._rect != value) {
						this._rect = value;
						this.width = value.w;
						this.height = value.h;
					}
				}
			}
		});

	}
	/**
	 * 每一帧的渲染逻辑
	 */
	Flex.Bitmap.prototype.render = function() {
		var bmd = this.bitmapData;
		var rect = this.rect;
		if(!rect) {
			rect = bmd.getRect();
		}
		if(bmd.loaded) {
			var width, height;
			if(this.width) {
				width = this.width;
			} else {
				this.width = width = rect.w;
			}
			if(this.height) {
				height = this.height;
			} else {
				this.height = height = rect.h;
			}
			context.drawImage(bmd.content, rect.x, rect.y, rect.w, rect.h, this.stageX, this.stageY, width, height);
		}
	}
})();