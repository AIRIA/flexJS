(function(){
	/**
	 * BitmapData 都是和Bitmap结合使用 
	 * 所以在Bitmap中为bitmapData属性赋值的时候 
	 * 可以对实例的used属性进行增减操作
	 */
	Flex.BitmapData = function(src,rect){
		this.assets = null;
		this.loaded = false;
		//被引用次数
		this.used = 0;
		//Image类型的实例
		this.content = null;
		this._src = null;
		Object.defineProperties(this,{
			src:{
				get:function(){
					return this._src;
				},
				set:function(value){
					if(this._src!=value){
						this._src = value;
						var assets = this.assets,content = this.content,self = this;
						if(!assets){
							assets = new Assets();
							assets.src = value;
						}
						if(!content){
							content = new Image();
							content.src = value;
							content.onload = function(){
								self.loaded = true;
								self.x = this.x;
								self.y = this.y;
								self.width = this.width
								self.height = this.height;
								self.content = content;
							}
						}
					}
				}
			}
		});
		this.src = src;
	}
	
	/**
	 * 释放资源 
	 */
	Flex.BitmapData.prototype.dispose = function(){
		this.used = 0;
		this.loaded = false;
		this.content = null;
		this.assets = null;
	}
	
	Flex.BitmapData.prototype.getRect = function(){
		return {
			x:this.x,
			y:this.y,
			w:this.width,
			h:this.height
		};
	}
	
})();