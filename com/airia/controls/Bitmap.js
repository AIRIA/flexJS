(function() {
	/**
	 * Bitmap 类表示用于表示位图图像的显示对象
	 * @extends Flex.DisplayObject
	 */
	Flex.Bitmap = function(bmd, rect) {
		Flex.extend(this, new Flex.DisplayObject());
		this._bitmapData = null;
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
			},
			/**
			 * 在此处对 BitmapData进行优化 一旦bitmapData的引用长度为0的话 就立刻进行回收
			 */
			bitmapData:{
				get:function(){
					return this._bitmapData;
				},
				set:function(value){
					if(this._bitmapData!=value){
						var bmd = this._bitmapData;
						//如果bmd不为空的话 就把bmd的引用减1 以便正确的统计引用次数
						if(bmd){
							bmd.used--;
							if(bmd.used==0){
								//释放bitmapdata的资源
								bmd.dispose();
							}
						}
						this._bitmapData = value;
						if(value.used==0){
							value.load();
						}
						trace(this._bitmapData);
						this._bitmapData.used += 1;
						
					}
				}
			}
		});
		if(bmd) {
			this.bitmapData = bmd;
		} else {
			throw new Error("Bitmap的bitmapData参数不能为空");
		}

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