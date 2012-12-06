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
			window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame;
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
			/**
			 * 启动遮罩
			 */
			if(displayObject.mask){
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
			if(displayObject.mask){
				mask.end();
			}
		}
	}

})();