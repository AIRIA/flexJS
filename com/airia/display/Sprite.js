(function(){
	Flex.Sprite = function(config){
		Flex.extend(this,new Flex.DisplayObjectContainer(config));
		this._graphics = null;
		Object.defineProperties(this,{
			graphics:{
				configurable:true,
				enumerable:true,
				get:function(){
					if(!this._graphics){
						this._graphics = new Flex.Graphics(this);
					}
					return this._graphics;
				}
			}
		});
	} 
	
	Flex.Sprite.prototype.render = function(){
		this.graphics.render();
	}
	
})();
