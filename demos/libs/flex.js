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
		var args = Array.prototype.slice.call(arguments);
		args.shift();
		args.shift();
		sup.constructor.apply(sub,args);
		sub.superClass = sup;
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
			} else if(this.getRect) {
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
				// var maskRect = new Flex.Rectangle(mask.stageX,mask.stageY,mask.width,mask.height);
				// var selfRect = this.getRect();
				if(x>mask.stageX&&x<(mask.stageX+mask.width)&&y>mask.stageY&&y<(mask.stageY+mask.width)){
					return true;
				}
				return false;
			}else if(x>this.stageX&&x<(this.stageX+this.explicitOrMeasureWidth)&&y>this.stageY&&y<(this.stageY+this.explicitOrMeasureHeight)){
				trace(this);
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
				trace(child + '已经存在于' + this + '的显示列表中了', Log.ERROR);
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
			safeRun(this.triggerListeners,event,this);
		},
		touchEndHandler:function(event){
			safeRun(this.triggerListeners,event,this);
		},
		touchMoveHandler:function(event){
			safeRun(this.triggerListeners,event,this);
		},
		/**
		 * 每当canvas接收到事件后 都要调用此方法来遍历
		 */
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
		/**
		 * 设置舞台的大小 并将舞台居中显示
		 */
		setStageSize:function(w,h){
			this.stageWidth = this.canvas.width = w;
			this.stageHeight = this.canvas.height = h;
			this.canvas.style.marginLeft= (-w/2)+"px";
		},
		/**
		 * 开始渲染
		 */
		start : function() {
			this.renderId = setInterval(this.appRender, 1000 / this.frameRate, this);
			this.state = "start";
		},
		/**
		 * 停止渲染
		 */
		stop : function() {
			clearInterval(this.renderId);
			this.state = "stop";
		},
		appRender : function(self) {
			self.context.clearRect(0, 0, self.stageWidth, self.stageHeight);
			self.render(self);

		},
		/**
		 * 递归调用此方法来 调用每个显示对象的render方法来显示界面
		 * 目前的渲染是从外到内  即先渲染父容器 在渲染子项显示对象
		 * 
		 * 渲染的时候要判断是不是stage 
		 * 如果是stage的话就不调用render方法 stage的render方法是在appRender方法中调用的
		 * 
		 * 如果当前渲染对象的mask属性不为空的话  就调用mask对象的start方法来启动遮罩 
		 * 完毕之后调用mask对象的end方法来恢复context上下文
		 * 
		 */
		render : function(displayObject) {
			mask = displayObject.mask;
			/**
			 * 启动遮罩
			 */
			if(mask){
				mask.start();
			}
			
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
			if(mask){
				mask.end();
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
(function(){
	/**
	 * 矩形的遮罩区域
	 * mask的坐标都是相对于被遮罩的显示对象的的 
	 */
	Flex.RectMask = function(config){
		Flex.extend(this,new Flex.BaseMask(config),config);
		this.width = config.width;
		this.height = config.height;
		//被遮罩的对象
		this.owner = null;
	}
	
	Flex.RectMask.prototype = {
		constructor:Flex.RectMask,
		start:function(){
			var owner = this.owner;
			context.save();
			context.beginPath();
			context.rect(this.stageX,this.stageY,this.width,this.height);
			context.clip();
			context.closePath();
		},
		end:function(){
			context.restore();
		}
	}
	
})();

//---------------------------------------------
(function(){
	/**
	 * 圆形的遮罩区域
	 */
	Flex.RoundMask = function(config){
		Flex.extend(this,new Flex.BaseMask(config),config);
		this.radius = config.radius;
	}
	
	Flex.RoundMask.prototype = {
		constructor:Flex.RoundMask,
		start:function(){
			context.save();
			context.beginPath();
			context.arc(this.stageX,this.stageY,this.radius,0,Math.PI*2,false);
			context.clip();
			context.closePath();
		},
		end:function(){
			context.restore();
		}
	}
})();

//---------------------------------------------
(function(){
	/**
	 * Point 对象表示二维坐标系统中的某个位置，其中 x 表示水平轴，y 表示垂直轴。 
	 */
	Flex.Point = function(x,y){
		this.x = x || 0;
		this.y = y || 0;
	}
})();

//---------------------------------------------
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
//---------------------------------------------
(function(){
	/**
	 * 遮罩的区域的坐标都是相对于owner的坐标系
	 * 在执行clip的时候 都是使用stageX stageY 来作为绘制的X Y
	 * 而且在设置遮罩后 遮罩的区域和owner的交叉区域将作为owner的可点击区域
	 */
	Flex.BaseMask = function(config){
		trace(config);
		config = config || {};
		this.x = config.x || 0;
		this.y = config.y || 0;
		//被遮罩的对象
		this.owner = null;
		Object.defineProperties(this,{
			stageX:{
				get:function(){
					return this.x+this.owner.stageX;
				}
			},
			stageY:{
				get:function(){
					return this.y+this.owner.stageY;	
				}
			}
		});
	};
})();

//---------------------------------------------
(function(){
	/**
	 * @class Flex.Event
	 * @description Event 类作为创建 Event 对象的基类，当发生事件时，Event 对象将作为参数传递给事件侦听器。
	 * @constructor
	 */
	Flex.Event = function(type,bubbles,cancleable){
		/**
		 * @description [read-only] 事件的类型。
		 * @field
		 */
		this.type = type;
		/**
		 * @description [read-only] 是否可以冒泡
		 * @field
		 */
		this.bubbles = bubbles || false;
		/**
		 * [read-only] 指示是否可以阻止与事件相关联的行为。 
		 * @field
		 */
		this.cancleable = cancleable || false;
		/**
		 * @description [read-only] 事件目标。 
		 * @field
		 */
		this.target = null;
	}
	
	Flex.Event.prototype = {
		constructor:Flex.Event,
		/**
		 * 防止对事件流中当前节点的后续节点中的所有事件侦听器进行处理。 
		 */
		stopPropagation:function(){
			
		},
		/**
		 * 防止对事件流中当前节点中和所有后续节点中的事件侦听器进行处理。 
		 */
		stopImmediatePropagation:function(){
			
		},
		/**
		 * 如果可以取消事件的默认行为，则取消该行为。
		 */
		preventDefault:function(){
			
		}
	}
})();

//---------------------------------------------
var TimerEvent = {
	TIMER:'timer',
	TIMER_COMPLETE:'timer_complete'
};
//---------------------------------------------
(function(){
	/**
	 * @author AIRIA
	 * @class Flex.Timer
	 * @extends Flex.EventDispatcher 
	 * @description Flex.Timer 类是 计时器的接口。 可以创建新的 Timer 对象，以便按指定的时间顺序运行代码。 使用 start() 方法来启动计时器。 为 timer 事件添加事件侦听器，以便将代码设置为按计时器间隔运行
	 * @constructor 构造方法
	 * @param {Number} 计时器事件间的延迟（以毫秒为单位）
	 * @param {Number} 指定重复次数
	 */
	Flex.Timer = function(delay, repeatCount) {
		Flex.extend(this,new Flex.EventDispatcher());
		/**
		 * @description [read-only] 计时器从 0 开始后触发的总次数。
		 * @field
		 */
		this.currentCount = 0;
		/**
		 * @description 计时器事件间的延迟（以毫秒为单位）。
		 * @field
		 */
		this.delay = delay;
		/**
		 * @description 设置的计时器运行总次数。
		 * @field
		 */
		this.repeatCount = repeatCount;
		/**
		 * @description [read-only] 计时器的当前状态；如果计时器正在运行，则为 true，否则为 false。
		 * @field
		 */
		this.running = false;
		
		this.timerId = null;
		
	}

	Flex.Timer.prototype = {
		constructor : Flex.Timer,
		/**
		 * @description 如果计时器尚未运行，则启动计时器。
		 */
		start : function() {
			var self = this;
			this.timerId = setTimeout(function(){
				self._timeComplete();
			},this.delay);
		},
		_timeComplete:function(){
			this.running = true;
			this.dispatchEvent(new Flex.Event(TimerEvent.TIMER));
			if(this.currentCount!=this.repeatCount){
				this.currentCount++;
				this.start();
			}else{
				this.dispatchEvent(new Flex.Event(TimerEvent.TIMER_COMPLETE));
			}
		},
		/**
		 * @description 如果计时器正在运行，则停止计时器，并将 currentCount 属性设回为 0，这类似于秒表的重置按钮。
		 */
		reset : function() {

		},
		/**
		 * @description 停止计时器。 
		 */
		stop : function() {

		}
	}

})();
//---------------------------------------------
(function() {
	/**
	 * @author AIRIA
	 * @class Flex.Group
	 * @constructor
	 * @description
	 * @param {JSON}
	 *
	 */
	Flex.Group = function(config) {
		Flex.extend(this, new Flex.Sprite(config), config);
		/**
		 * @description 布局的方向 默认是垂直方向  【vertical|horizontal】
		 * @field
		 */
		this._direction = "vertical";
		/**
		 * @description 垂直布局中的行间距
		 * @field
		 */
		this._verticalGap = 5;
		/**
		 * @description 水平布局中的列间距
		 * @field
		 */
		this._horizontalGap = 5;
		/**
		 * @description 水平对齐容器中的子容器。可能值包括 "left"、"center" 和 "right"。默认值为 "left"
		 * @field
		 */
		this._horizontalAlign = "left";
		/**
		 * @description 垂直对齐容器中的子项。可能值包括 "top"、"middle" 和 "bottom"。默认值为 "top"
		 * @field
		 */
		this._verticalAlign = "top";

		this._paddingTop = 0;
		this._paddingLeft = 0;
		this._paddingBottom = 0;
		this._paddingRight = 0;

		Object.defineProperties(this, {
			direction : {
				get : function() {
					return this._direction;
				},
				set : function(value) {
					if(this._direction != value) {
						this._direction = value;
						this.updateDisplayList();
					}
				}
			},
			verticalGap : {
				get : function() {
					return this._verticalGap;
				},
				set : function(value) {
					if(this._verticalGap != value) {
						this._verticalGap = value;
						this.updateDisplayList();
					}
				}
			},
			horizontalGap : {
				get : function() {
					return this._horizontalGap;
				},
				set : function(value) {
					if(this._horizontalGap != value) {
						this._horizontalGap = value;
						this.updateDisplayList();
					}
				}
			},
			paddingLeft : {
				get : function() {
					return this._paddingLeft
				},
				set : function(value) {
					if(this._paddingLeft != value) {
						this._paddingLeft = value;
						this.updateDisplayList();
					}
				}
			},
			paddingRight : {
				get : function() {
					return this._paddingRight;
				},
				set : function(value) {
					if(this._paddingRight != value) {
						this._paddingRight = value;
						this.updateDispalyList();
					}
				}
			},
			paddingTop : {
				get : function() {
					return this._paddingTop;
				},
				set : function(value) {
					if(this._paddingTop != value) {
						this._paddingTop = value;
						this.updateDisplayList();
					}
				}
			},
			paddingBottom : {
				get : function() {
					return this._paddingBottom;
				},
				set : function(value) {
					if(this._paddingBottom != vlaue) {
						this._paddingBottom = value;
						this.updateDisplayList();
					}
				}
			}
		})

	}

	Flex.Group.prototype = {
		constructor : Flex.Group,
		/**
		 * [override]
		 */
		addChild : function(child) {
			this.superClass.addChild.apply(this, [child]);
			this.updateDisplayList();
		},
		/**
		 * 进行布局
		 */
		updateDisplayList : function() {
			this.measureHeight = 0;
			this.measureWidth = 0;
			var children = this.getChildren();
			var numChildren = this.numChildren;
			var child;
			var maxWidth = 0;
			var maxHeight = 0;
			if(this.direction == "vertical") {
				for(var i = 0; i < numChildren; i++) {
					child = children[i];
					child.stageX = this.paddingLeft + this.stageX;
					child.x = this.paddingLeft;
					child.y = this.measureHeight;
					child.stageY = this.stageY + child.y;
					if(i == 0) {
						child.y += this.paddingTop;
					} else {
						child.y += this.verticalGap;
					}
					if(child.explicitOrMeasureWidth > maxWidth) {
						maxWidth = child.explicitOrMeasureWidth;
					}
					this.measureHeight = child.y + child.explicitOrMeasureHeight;
				}
				this.measureWidth = maxWidth + this.paddingLeft + this.paddingRight;
				this.measureHeight += this.paddingBottom;
			} else {
				for(var i = 0; i < numChildren; i++) {
					child = children[i];
					child.stageY = this.paddingTop + this.stageY;
					child.y = this.paddingTop;
					child.x = this.measureWidth;
					child.stageX = this.stageX + child.x;
					if(i == 0) {
						child.x += this.paddingLeft;
					} else {
						child.x += this.horizontalGap;
					}
					if(child.explicitOrMeasureHeight > maxHeight) {
						maxHeight = child.explicitOrMeasureHeight;
					}
					this.measureWidth = child.x + child.explicitOrMeasureWidth;
				}
				this.measureHeight = maxHeight + this.paddingTop + this.paddingBottom;
				this.measureWidth += this.paddingRight;
			}
		}
	}

})();


//---------------------------------------------
(function() {

	Flex.app.Log = {
		ERROR : 'error',
		WARN : 'warn',
		INFO : 'info',
		LOG : 'log'
	}
	
	Flex.app.LineGap = {
		
	}
	
	Flex.app.TouchEvent = {
		TOUCH_END:'touchend',
		TOUCH_START:'touchstart',
		TOUCH_MOVE:'touchmove'
	}
	
})();

//---------------------------------------------
(function() {
	/**
	 * @class RoundRectMask
	 * @description
	 * @constructor
	 * @param {JSON}
	 */
	Flex.RoundRectMask = function(config) {
		Flex.extend(this, new Flex.BaseMask(config), config);
		this.topLeftRadius = 0;
		this.bottomLeftRadius = 0;
		this.topRightRadius = 0;
		this.bottomRightRadius = 0;
	}

	Flex.RoundRectMask.prototype = {
		constructor : Flex.RoundRectMask,
		start : function() {
			trace("ok");
			context.save();
			context.beginPath();
			var stageX = this.stageX;
			var stageY = this.stageY;
			var width = this.width;
			var height = this.height;
			var topLeftRadius = this.topLeftRadius;
			var bottomLeftRadius = this.bottomLeftRaidus;
			var topRightRadius = this.topRightRadius;
			var bottomRightRadius = this.bottomRightRadius;
			trace(stageX, topLeftRadius, topLeftRadius, stageY, topLeftRadius);
			context.arcTo(stageX, topLeftRadius, topLeftRadius, stageY, topLeftRadius);
			context.lineTo(stageX + width - topRightRadius, stageY);
			context.arcTo(stageX + width - topRightRadius, stageY, stageX + width, stageY + topRightRadius, topRightRadius);
			context.lineTo(stageX + width, stageY + height - bottomRightRadius);
			context.arcTo(stageX + width, stageY + height - bottomRightRadius, stageX + width - bottomRightRadius, stageY + height, bottomRightRadius);
			context.lineTo(stageX + bottomLeftRadius, stageY + height);
			context.arcTo(stageX + bottomLeftRadius, stageY + height, stageX, stageY + height - bottomLeftRadius, bottomLeftRadius);
			context.clip();
			context.closePath();
		},
		end : function() {
			context.restore();
		}
	}

})();

//---------------------------------------------
(function(){
	/**
	 * @class TextField
	 * @constructor
	 */
	Flex.TextField = function(config){
		config = config || {};
		Flex.extend(this,new Flex.DisplayObject(config),config);
		this.textFormat = config.textFormat || null;
		this.text = config.text || null;
	}
	
	Flex.TextField.prototype = {
		constructor:Flex.TextField,
		render:function(){
			var text = this.text;
			if(text&&text.length){
				var format = this.textFormat;
				context.save();
				context.font = format.weight+" "+format.size+"px "+format.font;
				context.fillStyle = format.color;
				context.textAlign = format.align;
				context.textBaseline = format.baseline;
				context.fillText(this.text,this.stageX,this.stageY);
				context.restore();
			}
		}
	}
	
})();

//---------------------------------------------
(function(){
	/**
	 * 
	 * @class TextFormat 
	 * @constructor
	 * @description TextFormat类描述字符格式设置信息。
	 */
	Flex.TextFormat = function(config){
		config = config || {};
		/**
		 * @description 字体
		 * @field
		 */
		this.font = config.font||"宋体",
		/**
		 * @description 大小
		 * @field
		 */
		this.size = config.size || 12;
		/**
		 * @description 颜色
		 * @field
		 */
		this.color = config.color || "#333333";
		this.url = config.url || null;
		/**
		 * @description是否有下划线
		 * @field
		 */
		this.underline = config.underline || false;
		/**
		 * @description 是否是斜体
		 * @field
		 */
		this.italic = config.italic || false;
		/**
		 * @description 字体的粗细
		 * @field
		 */
		this.weight = config.weight || 400;
		/**
		 * @description 文本对齐方式
		 * @field
		 */
		this.align = config.align || "left";
		/**
		 * @description 文本底线对齐方式
		 * @field
		 */
		this.baseline = config.baseline || "top";
	}
	
})();

//---------------------------------------------

//---------------------------------------------

//---------------------------------------------

//---------------------------------------------

//---------------------------------------------