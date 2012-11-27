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
	};
	
	/**
	 * 安全执行某个方法  在方法执行的时候会添加try catch处理
	 */
	window.safeRun = function(handler){
		var args = Array.prototype.slice.call(arguments);
		args.shift();
		try{
			handler.apply(null,args);
		}catch(error){
			
		}
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
(function() {
	Flex.Graphics = function(owner) {
		this.owner = owner;
		this._steps = [];
		//调用actions中的方法和参数 重新组装steps的数据
		this._actions = [];
		this._fillSetted = false;
		this._strokeSetted = false;
	}

	Flex.Graphics.prototype = {
		constructor : Flex.Graphics,
		beginFill : function(color) {
			this._fillSetted = true;
			context.save();
			this._actions.push({
				method : 'beginFill',
				args : [color]
			});
			this._steps.push({
				prop : "fillStyle",
				value : color
			});
			return this;
		},
		lineStyle : function(weight, color, lineCap) {
			context.save();
			this._actions.push({
				method : 'lineStyle',
				args : [weight, color, lineCap]
			});
			this._strokeSetted = true;
			var steps = this._steps;
			steps.push({
				prop : "strokeStyle",
				value : color
			});
			steps.push({
				prop : 'lineWidth',
				value : weight
			});
			steps.push({
				prop : 'lineCap',
				value : lineCap
			});
			return this;
		},
		clear : function() {
			this._steps.length = 0;
			this._fillSetted = false;
			this._strokeSetted = false;
		},
		drawRect : function(x, y, width, height) {
			this._actions.push({
				method : 'drawRect',
				args : [x, y, width, height]
			});
			var drawX = this.owner.stageX + x;
			var drawY = this.owner.stageY + y;
			this.measureSize(x, y, width, height);
			this._steps.push({
				prop : 'fillRect',
				value : [drawX, drawY, width, height]
			});
			return this;
		},
		drawCircle : function(x, y, radius) {
			this._actions.push({
				method : 'drawCircle',
				args : [x, y, radius]
			});
			var steps = this._steps;
			var drawX = this.owner.stageX + x;
			var drawY = this.owner.stageY + y;
			this.measureSize(x, y, radius, radius);
			steps.push({
				prop : 'beginPath',
				value : []
			});
			steps.push({
				prop : 'arc',
				value : [drawX, drawY, radius, 0, Math.PI * 2, false]
			});
			if(this._fillSetted) {
				steps.push({
					prop : 'fill',
					value : []
				});
			}
			if(this._strokeSetted) {
				steps.push({
					prop : 'stroke',
					value : []
				});
			}
			return this;
		},
		endFill : function() {
			context.restore();
		},
		/**
		 * 在调用drawXXX方法的时候 进行调用 来更新measureWidth measureHeight的值
		 * @TODO 在clear的时候应该更新此方法
		 *
		 */
		measureSize : function(x, y, width, height) {
			var owner = this.owner;
			owner.measureWidth = Math.max(owner.measureWidth, x + width);
			owner.measureHeight = Math.max(owner.measureHeight, y + height);
		},
		/**
		 * 在owner的render方法中调用本方法来执行steps中保存的步骤
		 */
		render : function() {
			var currentStep;
			var steps = this._steps;
			//执行steps中保存的步骤
			for(var i = 0; i < steps.length; i++) {
				currentStep = steps[i];
				var prop = context[currentStep.prop];
				var val = currentStep.value;
				if( prop instanceof Function) {
					prop.apply(context, val);
				} else {
					context[currentStep.prop] = currentStep.value;
				}
			}
		},
		/**
		 * 当owner的x,y,stageX,stageY发生了变化要重新绘制
		 */
		validateRender : function() {
			this.clear();
			var actions = this._actions;
			var len = actions.length;
			var action;
			for(var i = 0; i < len; i++) {
				action = actions[i];
				this[action.method].apply(this, action.args)
			}
			for(var i = 0; i < len; i++) {
				actions.shift();
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
			if(parent) {
				this.stageX = this.x + parent.stageX;
				this.stageY = this.y + parent.stageY;
				if(this.graphics) {
					this.graphics.validateRender();
				}
			}
		},
		/**
		 * 根据传进来的事件的pageX pageY来判断组件是不是在此坐标的下面
		 */
		isUnderPoint:function(touch){
			var x = touch.pageX-canvas.offsetLeft;
			var y = touch.pageY-canvas.offsetTop;
			if(x>this.stageX&&x<(this.stageX+this.explicitOrMeasureWidth)&&y>this.stageY&&y<(this.stageY+this.explicitOrMeasureHeight)){
				//app.stopPropagation = true;//此处将app的stopXXX属性设置为ture 以停止事件继续传播
				return true;
			}
			return false;
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


//---------------------------------------------
(function() {
	Flex.DisplayObjectContainer = function(config) {
		Flex.extend(this, new Flex.DisplayObject(config));
		this._children = [];
		Object.defineProperties(this, {
			children : {
				get : function() {
					return this._children;
				}
			},
			numChildren : {
				get : function() {
					return this.children.length;
				}
			}
		});
	}

	Flex.DisplayObjectContainer.prototype = {
		constructor : Flex.DisplayObjectContainer,
		addChild : function(child) {
			var children = this.children;
			if(children.indexOf(child) == -1) {
				children.push(child);
				child.parent = this;
				child.validateCoordinate();
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
				this.children.push(child);
				child.parent = this;
				child.validateCoordinate();	
			}
			return children;
		},
		addChildAt : function(child, index) {
			this.children.splice(index - 1, 0, child);
			child.parent = this;
			child.validateCoordinate();
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
			var parent = this.parent;
			if(parent && !( parent instanceof Flex.Stage)) {
				parent.validateProperties();
			}
			var children = this.getChildren();
			var child;
			for(var i = 0; i < children.length; i++) {
				child = children[i];
				//设置显示对象测量大小
				this.measureWidth = Math.max(this.measureWidth, child.x + child.measureWidth);
				this.measureHeight = Math.max(this.measureHeight, child.y + child.measureHeight);
				//获取明确设置的尺寸 如果没有明确设置 则获取测量大小
				// this.width = Math.max(this.explicitOrMeasureWidth,child.x+child.explicitOrMeasureWidth);
				// this.height = Math.max(this.explicitOrMeasureHeight,child.y+child.explicitOrMeasureHeight);
			}
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
(function() {
	Flex.Sprite = function(config) {
		Flex.extend(this, new Flex.DisplayObjectContainer(config));
		this._graphics = null;
		Object.defineProperties(this, {
			graphics : {
				get : function() {
					if(!this._graphics) {
						this._graphics = new Flex.Graphics(this);
					}
					return this._graphics;
				}
			}
		});
	}

	Flex.Sprite.prototype.render = function() {
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
		/**
		 * init方法中对canvas context 进行初始化
		 * 并且会注册事件监听器
		 */
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
			Flex.app.canvas = this.canvas;
			var self = this;
			Flex.EventManager.addHandler(this.canvas,"mouseMove",function(event){
				self.touchMoveHandler(event);
			});
			Flex.EventManager.addHandler(this.canvas,"mousedown",function(event){
				self.touchStartHandler(event);
			});
			Flex.EventManager.addHandler(this.canvas,"click",function(event){
				self.touchEndHandler(event);
			});
		},
		touchStartHandler:function(event){
			
		},
		touchEndHandler:function(event){
			safeRun(this.triggerListeners,event,this);
		},
		touchMoveHandler:function(event){
			
		},
		triggerListeners:function(event,displayObj){
			var touch = event;
			var numChildren = displayObj.numChildren;
			if(numChildren){
				//如果有子项的话  就递归调用此方法 直到最内层的元素
				var children = displayObj.getChildren();
				for(var i=numChildren-1;i>=0;i--){
					arguments.callee(event,children[i]);
				}
			}else{
				//将event事件对象传入每个显示对象的mouseEvent方法中 根据event的信息来判断是不是要调用注册的回调函数
				if(displayObj.isUnderPoint(touch)){
					displayObj.dispatchEvent(event);
				}
			}
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
			var numChildren = displayObject.numChildren;
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
(function(){
	/**
	 * BitmapData 都是和Bitmap结合使用 
	 * 所以在Bitmap中为bitmapData属性赋值的时候 
	 * 可以对实例的used属性进行增减操作
	 */
	Flex.BitmapData = function(src,rect){
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
					if(this._src!=value||this.loaded==false){
						this._src = value;
						var assets = this.assets,content = this.content,self = this;
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
	
	Flex.BitmapData.prototype.load = function(){
		this.src = this.src;
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

//---------------------------------------------
(function() {
	/**
	 * Bitmap 类表示用于表示位图图像的显示对象
	 * @extends Flex.DisplayObject
	 */
	Flex.Bitmap = function(bmd, rect) {
		Flex.extend(this, new Flex.DisplayObject());
		this._bitmapData = null;
		if(rect) {
			this.width = rect.w;
			this.height = rect.h;
		}
		Object.defineProperties(this, {
			rect : {
				get : function() {
					return this._rect;
				},
				set : function(value) {
					if(this._rect != value) {
						this._rect = value;
						this.width = value.w;
						this.height = value.h;
					}
				}
			},
			/**
			 * 在此处对 BitmapData进行优化 一旦bitmapData的引用长度为0的话 就立刻进行回收
			 */
			bitmapData:{
				get:function(){
					return this._bitmapData;
				},
				set:function(value){
					if(this._bitmapData!=value){
						var bmd = this._bitmapData;
						//如果bmd不为空的话 就把bmd的引用减1 以便正确的统计引用次数
						if(bmd){
							bmd.used--;
							if(bmd.used==0){
								//释放bitmapdata的资源
								bmd.dispose();
							}
						}
						this._bitmapData = value;
						if(value.used==0){
							value.load();
						}
						this._bitmapData.used += 1;
						
					}
				}
			}
		});
		if(bmd) {
			this.bitmapData = bmd;
		} else {
			throw new Error("Bitmap的bitmapData参数不能为空");
		}

	}
	/**
	 * 每一帧的渲染逻辑
	 */
	Flex.Bitmap.prototype.render = function() {
		var bmd = this.bitmapData;
		var rect = this.rect;
		if(!rect) {
			rect = bmd.getRect();
		}
		if(bmd.loaded) {
			var width, height;
			if(this.width) {
				width = this.width;
			} else {
				this.width = width = rect.w;
			}
			if(this.height) {
				height = this.height;
			} else {
				this.height = height = rect.h;
			}
			context.save();
			context.globalAlpha = this.alpha;
			context.drawImage(bmd.content, rect.x, rect.y, rect.w, rect.h, this.stageX, this.stageY, width, height);
			context.restore();
		}
	}
})();
//---------------------------------------------
(function(){

	/**
	 * 资源modal 包括两个属性 一个是src 一个是被引用次数 used
	 */
	Flex.app.Assets = function(){
		this.src = null;
		this.used = 0;
	};
	/**
	 * 资源管理类
	 * cachedAssets中存放Assets对象实例
	 */
	Flex.app.AssetsManager = {
		cachedAssets:[],
	};
})();

//---------------------------------------------
(function(){
	/**
 * @class 事件管理实例 此类不能实例化
 */
	Flex.EventManager = {
	addHandler:function(element,type,handler){
		if(element.addEventListener){
			element.addEventListener(type,handler,false);
		}else if(element.attachEvent){
			element.attachEvent("on"+type,handler);
		}else{
			element["on"+type] = handler;
		}
	},
	/**
	 * 移除Dom元素注册的事件
	 */
	removeHandler:function(element,type,handler){
		if(element.removeEventListener){
			element.removeEventListener(type,handler,false);
		}else if(element.detachEvent){
			element.detachEvent("on"+type,handler);
		}else{
			element["on"+type] = null;
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