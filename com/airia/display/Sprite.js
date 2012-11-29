(function(){
	Flex.Sprite = function(config){
		Flex.extend(this,new Flex.DisplayObjectContainer(config),config);
		this._graphics = null;
		Object.defineProperties(this,{
			graphics:{
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
