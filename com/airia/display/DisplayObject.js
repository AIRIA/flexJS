(function() {
	Flex.DisplayObject = function(config) {
		Flex.extend(this, new Flex.EventDispatcher());
		config = config || {};
		this._x = config.x || 0;
		this._y = config.y || 0;
		this._width = NaN;
		this._height = NaN;
		this.stageX = 0;
		this.stageY = 0;
		this.visibal = true;
		this.alpha = 1;
		this.rotation = 0;
		this.enable = true;
		this.parent = null;
		this.mask = null;
		Object.defineProperties(this, {
			x : {
				configurable:true,
				enumerable:true,
				get : function() {
					return this._x;
				},
				set : function(value) {
					if(this._x != value) {
						this._x = value;
					}
				}
			},
			y : {
				configurable:true,
				enumerable:true,
				get : function() {
					return this._y;
				},
				set : function(value) {
					if(this._y != value) {
						this._y = value;
					}
				}
			},
			width : {
				configurable:true,
				enumerable:true,
				get : function() {
					return this._width;
				},
				set : function(value) {
					if(this._width!=value){
						this._width = value;
					}
				}
			},
			height : {
				configurable:true,
				enumerable:true,
				get : function() {
					return this._height;
				},
				set : function(value) {
					if(this._height!=value){
						this._height = value;
					}
				}
			}
		});
	}
	
	Flex.DisplayObject.prototype = {
		constructor:Flex.DisplayObject,
		getRect:function(){
			//TODO
		},getBounds:function(){
			//TODO
		},globalToLocal:function(){
			//TODO
		},localToGlobal:function(){
			
		}
	}
})();
