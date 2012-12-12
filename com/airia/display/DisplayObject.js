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
		this._width = config.width || NaN;
		this._height =config.height ||  NaN;
		this.measureWidth = 0;
		this.measureHeight = 0;
		this._stageX = 0;
		this._stageY = 0;
		this._pivotX = 0;
		this._pivotY = 0;
		this.visibal = true;
		this.alpha = 1;
		this.rotation = 0;
		this.enable = true;
		this.parent = null;
		this._mask = null;
		Object.defineProperties(this, {
			mask:{
				get:function(){
					return this._mask;
				},
				set:function(value){
					if(this._mask!=value){
						this._mask = value;
						if(value){
							this._mask.owner = this;
						}
					}
				}
			},
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
			pivotX:{
				get:function(){
					return this._pivotX;
				},
				set:function(value){
					if(this._pivotX!=value){
						this._pivotX = value;
						this.validateCoordinate();
					}
				}
			},
			pivotY:{
				get:function(){
					return this._pivotY;
				},
				set:function(value){
					if(this._pivotY!=value){
						this._pivotY = value;
						this.validateCoordinate();
					}
				}
			},
			stageX:{
				get:function(){
					var res = this._stageX - Flex.pivotX;
					if(this.numChildren){
						res -= this.pivotX;
					}
					return res;
				},
				set:function(value){
					this._stageX = value;
					// var parent = this.parent;
					// if(parent&this._stageX!=value-parent.pivotX-this.pivotX){
						// this._stageX = value-parent.pivotX-this.pivotX;
					// }else{
						// this._stageX = value - this.pivotX;
					// }
				}
			},
			stageY:{
				get:function(){
					var res = this._stageY - Flex.pivotY
					if(this.numChildren){
						res -= this.pivotY;
					}
					return res;
				},
				set:function(value){
					this._stageY = value;
					// var parent = this.parent;
					// if(parent&this._stageY!=value-parent.pivotY-this.pivotY){
						// this._stageY = value -parent.pivotY-this.pivotY ;
					// }else{
						// this._stageY = value - this.pivotY;
					// }
				}
			},
			width : {
				get : function() {
					return this.explicitOrMeasureWidth;
				},
				set : function(value) {
					if(this._width != value) {
						this._width = value;
					}
				}
			},
			height : {
				get : function() {
					return this.explicitOrMeasureHeight;
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
					return isNaN(this._width) ? this.measureWidth : this._width;
				}
			},
			explicitOrMeasureHeight : {
				get : function() {
					return isNaN(this._height) ? this.measureHeight : this._height;
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
			if(parent) {
				this.stageX = this.x + parent._stageX;
				this.stageY = this.y + parent._stageY;
				if(this.graphics) {
					this.graphics.validateRender();
				}
				if(this.updateDisplayList){
					this.updateDisplayList();
				}
			}
		},
		/**
		 * 根据传进来的事件的pageX pageY来判断组件是不是在此坐标的下面
		 * 如果存在遮罩的话 热点区域以重叠区域为有效点击区域
		 * @param {Event} 触发的事件对象
		 */
		isUnderPoint:function(touch){
			var x = touch.pageX-canvas.offsetLeft;
			var y = touch.pageY-canvas.offsetTop;
			var mask = this.mask;
			if(mask){
				trace(mask);
				if(x>mask.stageX&&x<(mask.stageX+mask.width)&&y>mask.stageY&&y<(mask.stageY+mask.width)){
					return true;
				}
				return false;
			}else if(x>this.stageX&&x<(this.stageX+this.explicitOrMeasureWidth)&&y>this.stageY&&y<(this.stageY+this.explicitOrMeasureHeight)){
				this.touch = touch;
				return true;
			}
			return false;
		},
		/**
		 * 指定坐标系
		 * @param {Flex.DisplayObject} 参考的坐标系
		 */
		getRect : function(targetCoordinateSpace) {
			var rect;
			if(targetCoordinateSpace){
				rect = new Flex.Rectangle(this.stageX,this.stageY,this.width,this.height);
			}else{
				rect = new Flex.Rectangle(this.stageX,this.stageY,this.width,this.height);
			}
			return rect;
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