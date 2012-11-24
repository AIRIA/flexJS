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
			this._steps.push({prop:'fillRect',value:[this.owner.stageX + x,this.owner.stageY + y,width,height]});
			return this;
		},
		drawCircle:function(x,y,radius){
			var steps = this._steps;
			steps.push({prop:'beginPath',value:[]});
			steps.push({prop:'arc',value:[this.owner.stageX + x, this.owner.stageY + y, radius, 0, Math.PI * 2, false]});
			if(this._fillSetted){
				steps.push({prop:'fill',value:[]});
			}
			if(this._strokeSetted){
				steps.push({prop:'stroke',value:[]});
			}
			steps.push({prop:'closePath',value:[]});
			return this;
		},
		endFill:function(){
			context.restore();
		},
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
