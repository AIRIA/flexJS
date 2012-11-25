//---------------------------------------------
/**
 *
 *
 */
(function(window) {
	var Flex = window.Flex = window.$f = {
		app:window
	};
	Flex.extend = function(sub, sup) {
		sup.constructor.call(sub);
		sub.superClass = sup.__proto__;
		for(prop in sup.__proto__) {
			sub[prop] ? sub[prop] : sub[prop] = sup[prop];
		}
	}
	/**
	 * @description 在浏览器的控制台输出信息  trace的最后一个参数表示的打印级别 默认是info级别
	 */
	window.trace = function() {
		var logType = ['log', 'error', 'info', 'warn'];
		var type = "log";
		var content = "";
		for(var i = 0; i < arguments.length; i++) {
			if(i == arguments.length - 1) {
				if(logType.indexOf(arguments[i]) != -1) {
					type = arguments[i];
					content = content.slice(0, content.length - 1);
				} else {
					content += "arguments[" + i + "]";
				}
			} else {
				content += "arguments[" + i + "],";
			}
		}
		content += ")";
		res = "console." + type + "(" + content;
		eval(res);
	}
})(window);
//---------------------------------------------
(function() {
	
	/**
	 * @class 
	 * 
	 */
	Flex.EventDispatcher = function() {
		this.events = {};
	}

	Flex.EventDispatcher.prototype = {
		constructor : Flex.EventDispatcher,
		addEventListener : function(type, handler, useCapture) {
			if(!this.events[type]) {
				this.events[type] = {
					captureHandlers : [],
					normalHandlers : []
				};
			}
			var evt = this.events[type];
			//捕获阶段的回调函数
			if(useCapture) {
				evt.captureHandlers.push(handler);
			} else {
				//添加到目标和冒泡阶段的回调函数
				evt.normalHandlers.push(handler);
			}
		},
		removeEventListener : function(type, handler, useCapture) {
			var evt = this.events[type];
			useCapture = useCapture || false;
			if(useCapture) {
				FlexUtil.removeElement(evt.captureHandlers, handler);
			} else {
				FlexUtil.removeElement(evt.normalHandlers, handler);
			}
		},
		hasEventListener : function(type) {
			if(this.events[type].lenght) {
				return true;
			}
			return false;
		},
		dispatchEvent : function(event) {
			event.target = this;
			var evt = this.events[event.type];
			if(evt) {
				var normalHandlers = evt.normalHandlers;
				var captureHandlers = evt.captureHandlers;
				for(var i = 0; i < normalHandlers.length; i++) {
					normalHandlers[i].call(this, event);
				}
			}
			var parent = this.parent;
			if(parent) {
				parent.dispatchEvent(event);
			} else {
				throw new Error("normal quit");
			}
		}
	}
})();

//---------------------------------------------
(function(){
	Flex.Graphics = function(owner){
		this.owner = owner;
		this._steps = [];
		this._fillSetted = false;
		this._strokeSetted = false;
	}
	
	Flex.Graphics.prototype = {
		constructor:Flex.Graphics,
		beginFill:function(color){
			this._fillSetted = true;
			context.save();
			this._steps.push({prop:"fillStyle",value:color});
			return this;
		},
		lineStyle:function(weight,color,lineCap){
			context.save();
			this._strokeSetted = true;
			var steps = this._steps;
			steps.push({prop:"strokeStyle",value:color});
			steps.push({prop:'lineWidth',value:weight});
			steps.push({prop:'lineCap',value:lineCap});
			return this;
		},
		clear:function(){
			this._steps.length = 0;
			this._fillSetted = false;
			this._strokeSetted = false;
		},
		drawRect:function(x,y,width,height){
			var drawX = this.owner.stageX + x;
			var drawY = this.owner.stageY + y;
			this.measureSize(x,y,width,height);
			this._steps.push({prop:'fillRect',value:[drawX,drawY,width,height]});
			return this;
		},
		drawCircle:function(x,y,radius){
			var steps = this._steps;
			var drawX = this.owner.stageX + x;
			var drawY = this.owner.stageY + y;
			this.measureSize(x,y,radius,radius);
			steps.push({prop:'beginPath',value:[]});
			steps.push({prop:'arc',value:[drawX,drawY, radius, 0, Math.PI * 2, false]});
			if(this._fillSetted){
				steps.push({prop:'fill',value:[]});
			}
			if(this._strokeSetted){
				steps.push({prop:'stroke',value:[]});
			}
			return this;
		},
		endFill:function(){
			context.restore();
		},
		/**
		 * 在调用drawXXX方法的时候 进行调用 来更新measureWidth measureHeight的值
		 * @TODO 在clear的时候应该更新此方法  
		 * 
		 */
		measureSize:function(x,y,width,height){
			var owner = this.owner;
			owner.measureWidth = Math.max(owner.measureWidth,x+width);
			owner.measureHeight = Math.max(owner.measureHeight,y+height);
		},
		/**
		 * 在owner的render方法中调用本方法来执行steps中保存的步骤
		 */
		render:function(){
			var currentStep;
			var steps = this._steps;
			//执行steps中保存的步骤
			for(var i=0;i<steps.length;i++){
				currentStep = steps[i];
				var prop = context[currentStep.prop];
				var val = currentStep.value;
				if(prop instanceof Function){
					prop.apply(context,val);
				}else{
					context[currentStep.prop] = currentStep.value;
				}
			}
		}
	}
	
})();

//---------------------------------------------
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
				configurable:true,
				enumerable:true,
				get : function() {
					trace("getX");
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

//---------------------------------------------
(function() {
	Flex.DisplayObjectContainer = function(config) {
		Flex.extend(this, new Flex.DisplayObject(config));
		this._children = [];
		Object.defineProperties(this, {
			children : {
				configurable : true,
				enumerable : true,
				get : function() {
					return this._children;
				}
			}
		});
	}

	Flex.DisplayObjectContainer.prototype = {
		constructor : Flex.DisplayObjectContainer,
		numChildren : function() {
			return this.children.length;
		},
		addChild : function(child) {
			var children = this.children;
			if(children.indexOf(child) == -1) {
				children.push(child);
			} else {
				trace(child + '已经存在于' + this + '的显示列表中了', Flex.Const.Log.ERROR);
			}
			return child;
		},
		addChildren : function() {
			var children = Array.prototype.slice.call(arguments);
			var child;
			for(var i = 0; i < children.length; i++) {
				child = children[i]
				if( child instanceof DisplayObject) {
					this.children.push(child);
					child.parent = this;
				} else {
					trace(child + "不是DisplayObject的实例", Flex.Const.Log.ERROR);
				}
			}
			return children;
		},
		addChildAt : function(child, index) {
			this.children.splice(index - 1, 0, child);
			child.parent = this;
			return child;
		},
		contains : function(child) {
			if(this.children.indexOf(child) == -1) {
				return false;
			}
			return true;
		},
		getChildren : function() {
			return this.children;
		},
		getChildAt : function(index) {
			if(this.children.length - 1 < index) {
				trace(this + "索引越界异常");
				return;
			}
			return this.children[index];
		},
		getChildIndex : function(child) {
			var index = this.children.indexOf(child);
			if(index == -1) {
				trace(this + "中不存在" + child + "显示对象")
				return;
			}
			return index;
		},
		removeChild : function(child) {
			this.children.splice(this.getChildAt(child), 1);
			return child;
		},
		removeChildAt : function(index) {
			var child = this.getChildAt(index);
			this.children.splice(index, 1);
			return child;
		},
		setChildIndex : function(child, index) {
			//TODO
		},
		swapChildren : function(child1, child2) {
			var childList = this.children;
			var ind1 = childList.indexOf(child1);
			var ind2 = childList.indexOf(child2);
			if(ind1 == -1 || ind2 == -1) {
				trace("swapChildren参数异常, 不存在交换的元素", "error");
				return;
			}
			childList[ind2] = child1;
			childList[ind1] = child2;
		},
		swapChildrenAt : function(index1, index2) {
			//TODO
		},
		//校验组件的各各属性
		validateProperties : function() {

		},
		//检验组件的尺寸
		validateSize : function() {

		},
		//更新组件内部的显示列表
		validateDisplayList : function() {

		},
		initialize : function() {
			this.validateProperties();
			this.validateSize();
			this.validateDisplayList();
		}
	}

})();
//---------------------------------------------
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

//---------------------------------------------
(function() {
	Flex.Stage = function(canvasID) {
		Flex.extend(this, new Flex.DisplayObjectContainer());
		this._frameRate = 24;
		this.context = null;
		this.canvas = null;
		this._stageWidth = 0;
		this._stageHeight = 0;
		this.state = "start";
		this.renderId = null;
		Object.defineProperties(this, {
			stageWidth:{
				get:function(){
					return this._stageWidth;
				},
				set:function(value){
					if(this._stageWidth!=value){
						this._stageWidth = value;
					}
				}
			},
			stageHeight:{
				get:function(){
					return this._stageHeight;
				},
				set:function(value){
					if(this._stageHeight!=value){
						this._stageHeight = value;
					}
				}
			},
			frameRate : {
				get : function() {
					return this._frameRate;
				},
				set : function(value) {
					if(this._frameRate != value) {
						this._frameRate = value;
						if(this.state == "start") {
							this.stop();
							this.start();
						}
					}
				}
			}
		});
		this.init(canvasID);
		this.start();
	};

	Flex.Stage.prototype = {
		constructor : Flex.Stage,
		init : function(canvasID) {
			var canvas = document.getElementById(canvasID)
			this.canvas = canvas;
			if(canvas.getContext) {
				this.context = canvas.getContext("2d");
			} else {
				alert("Your Browser Doesn't Support HTML5 \n Please Try Chrome,FireFox3.6+,Opera12,IE9+ etc.!");
			}
			this.stageWidth = canvas.width;
			this.stageHeight = canvas.height;
			Flex.app.context = this.context;
		},
		setStageSize:function(w,h){
			this.stageWidth = this.canvas.width = w;
			this.stageHeight = this.canvas.height = h;
			this.canvas.style.marginLeft= (-w/2)+"px";
		},
		start : function() {
			this.renderId = setInterval(this.appRender, 1000 / this.frameRate, this);
			this.state = "start";
		},
		stop : function() {
			clearInterval(this.renderId);
			this.state = "stop";
		},
		appRender : function(self) {
			self.context.clearRect(0, 0, self.stageWidth, self.stageHeight);
			self.render(self);

		},
		render : function(displayObject) {
			if(!( displayObject instanceof Flex.Stage)) {
				if(displayObject.render) {
					displayObject.render();
				}
			}
			var numChildren = displayObject.numChildren();
			if(numChildren) {
				var children = displayObject.getChildren();
				for(var i = 0; i < numChildren; i++) {
					arguments.callee(children[i]);
				}
			}
		}
	}

})();
//---------------------------------------------

//---------------------------------------------

//---------------------------------------------

//---------------------------------------------

//---------------------------------------------

//---------------------------------------------

//---------------------------------------------

//---------------------------------------------

//---------------------------------------------

//---------------------------------------------

//---------------------------------------------

//---------------------------------------------

