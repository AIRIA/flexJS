(function() {
	/**
	 * x y width height stageX stageY 这些属性对于定位非常重要
	 * stageX的值等于所在容器的stageX值加上自己的X属性 在绘制的时候 是以stageX stageY为坐标为起点开始绘制的
	 * 为了达到自适应的效果 关于坐标和尺寸的数值都会统一和一个比例相乘
	 * 这个比例是在stage初始化的时候获取到的值 获取到之后存放到window全局作用域中
	 * stageX stageY 都是在添加到容器的时候进行设置的
	 * width height是在render之前进行设置
	 * measureWidth measureHeight 是实际测量的大小
	 *
	 */
	Flex.DisplayObject = function(config) {
		Flex.extend(this, new Flex.EventDispatcher());
		config = config || {};
		this._x = config.x || 0;
		this._y = config.y || 0;
		this._width = NaN;
		this._height = NaN;
		this.measureWidth = 0;
		this.measureHeight = 0;
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
				get : function() {
					return this._x;
				},
				set : function(value) {
					if(this._x != value) {
						this._x = value;
						this.validateCoordinate();
					}
				}
			},
			y : {
				get : function() {
					return this._y;
				},
				set : function(value) {
					if(this._y != value) {
						this._y = value;
						this.validateCoordinate();
					}
				}
			},
			width : {
				get : function() {
					return this._width;
				},
				set : function(value) {
					if(this._width != value) {
						this._width = value;
					}
				}
			},
			height : {
				get : function() {
					return this._height;
				},
				set : function(value) {
					if(this._height != value) {
						this._height = value;
					}
				}
			},
			/**
			 * 快速获取显示对象的尺寸
			 * 如果没有明确设置尺寸的话 就返回测量的尺寸 也就是实际占用的尺寸
			 */
			explicitOrMeasureWidth : {
				get : function() {
					return isNaN(this.width) ? this.measureWidth : this.width;
				}
			},
			explicitOrMeasureHeight : {
				get : function() {
					return isNaN(this.height) ? this.measureHeight : this.height;
				}
			}
		});
	}

	Flex.DisplayObject.prototype = {
		constructor : Flex.DisplayObject,
		/**
		 * 在被添加到显示列表中的时候 对child的全局坐标进行校验
		 */
		validateCoordinate:function(){
			var parent = this.parent;
			this.stageX = this.x + parent.stageX;
			this.stageY = this.y + parent.stageY;
		},
		getRect : function() {
			//TODO
		},
		getBounds : function() {
			//TODO
		},
		globalToLocal : function() {
			//TODO
		},
		localToGlobal : function() {

		}
	}
})();
