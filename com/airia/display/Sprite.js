(function(){
	Flex.Sprite = function(config){
		Flex.extend(this,new Flex.DisplayObjectContainer(config));
		this.graphics = new Flex.Graphics(this);
	} 
	
	Flex.Sprite.prototype = {
		constructor:Flex.Sprite,
		render:function(){
			this.graphics.render();
		}
	}
	
})();
