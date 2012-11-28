(function(){
	/**
	 * Rectangle 对象是按其位置（由它左上角的点 (x, y) 确定）以及宽度和高度定义的区域。 
	 * Rectangle 类的 x、y、width 和 height 属性相互独立；更改一个属性的值不会影响其它属性。 
	 * 但是，right 和 bottom 属性与这四个属性是整体相关的。 
	 * 例如，如果更改 right 属性的值，则 width 属性的值将发生变化；如果更改 bottom 属性，则 height 属性的值将发生变化。 
	 */
	Flex.Rectangle = function(x,y,width,height){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		Object.defineProperties(this,{
			/**
			 * y 和 height 属性的和。
			 */
			bottom:{
				get:function(){
					return this.y+this.height;
				}
			},
			/**
			 * 由 right 和 bottom 属性的值确定的 Rectangle 对象的右下角的位置。
			 */
			bottomRight:{
				get:function(){
					return new Point(this.right,this.bottom);
				}
			},
			/**
			 * 矩形左上角的 x 坐标。
			 */
			left:{
				get:function(){
					return this.x;
				}
			},
			/**
			 * x 和 width 属性的和。
			 */
			right:{
				get:function(){
					return this.x+this.width;
				}
			},
			/**
			 * 矩形左上角的 y 坐标。
			 */
			top:{
				get:function(){
					return this.y;
				}
			},
			/**
			 * 由该点的 x 和 y 坐标确定的 Rectangle 对象左上角的位置。
			 */
			topLeft:{
				get:function(){
					return new Point(this.x,this.y);
				}
			}
		});
	}
	
	Flex.Rectangle.prototype = {
		constructor:Flex.Rectangle,
		/**
		 * 获取两个Rectangle实例的交叉区域
		 * 实现思路 分左右两种情况来考虑 如果
		 * 
		 * 
		 * @param {Flex.Rectangle} 获取与rect的交叉区域
		 * @type {Flex.Rectangle}
		 * 
		 */
		getCross:function(rect){
			//TODO
			var rectTopLeft = rect.topLeft;
			var rectBottomRight = rect.bottomRight;
			var selfTopLeft = self.topLeft;
			var selfBottomRight = self.bottomRight;
			return new Flex.Rectangle();
		},
		/**
		 * 判断两个矩形是否相交
		 */
		isCross:function(rect){
			//TODO
		}
	}
	
})();
