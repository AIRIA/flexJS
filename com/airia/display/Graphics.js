(function(){
	Flex.Graphics = function(owner){
		this.owner = owner;
		this._steps = [];
		//调用actions中的方法和参数 重新组装steps的数据
		this._actions = [];
		this._fillSetted = false;
		this._strokeSetted = false;
	}
	
	Flex.Graphics.prototype = {
		constructor:Flex.Graphics,
		beginFill:function(color){
			this._fillSetted = true;
			context.save();
			this._actions.push({method:'beginFill',args:[color]});
			this._steps.push({prop:"fillStyle",value:color});
			return this;
		},
		lineStyle:function(weight,color,lineCap){
			context.save();
			this._actions.push({method:'lineStyle',args:[weight,color,lineCap]});
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
			this._actions.push({method:'drawRect',args:[x,y,width,height]});
			var drawX = this.owner.stageX + x;
			var drawY = this.owner.stageY + y;
			this.measureSize(x,y,width,height);
			this._steps.push({prop:'fillRect',value:[drawX,drawY,width,height]});
			return this;
		},
		drawCircle:function(x,y,radius){
			this._actions.push({method:'drawCircle',args:[x,y,radius]});
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
		},
		/**
		 * 当owner的x,y,stageX,stageY发生了变化要重新绘制
		 */
		validateRender:function(){
			this.clear();
			var actions = this._actions;
			var len = actions.length;
			var action;
			for(var i=0;i<len;i++){
				action = actions[i];
				this[action.method].apply(this,action.args)
			}
			for(var i=0;i<len;i++){
				actions.shift();
			}
		}
	}
	
})();
