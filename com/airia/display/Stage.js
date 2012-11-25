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