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
	}

	Flex.DisplayObject.prototype = {
		constructor : Flex.DisplayObject,
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

		},
		getX : function() {
			return this._x;
		},
		setX : function(value) {
			if(this._x != value) {
				this._x = value;
			}
		},
		getY : function() {
			return this._y;
		},
		setY : function(value) {
			if(this._y != value) {
				this._y = value;
			}
		},
		getWidth : function() {
			return this._width;
		},
		setWidth : function(value) {
			if(this._width != value) {
				this._width = value;
			}
		},
		getHeight : function() {
			return this._height;
		},
		setHeight : function(value) {
			if(this._height != value) {
				this._height = value;
			}
		}
	}
})();
