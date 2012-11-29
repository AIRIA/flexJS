(function() {
	Flex.DisplayObjectContainer = function(config) {
		Flex.extend(this, new Flex.DisplayObject(config),config);
		this._children = [];
		Object.defineProperties(this, {
			children : {
				get : function() {
					return this._children;
				}
			},
			numChildren:{
				get :function(){
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
			if(parent&&!(parent instanceof Flex.Stage)){
				parent.validateProperties();
			}
			var children = this.getChildren();
			var child;
			for(var i=0;i<children.length;i++){
				child = children[i];
				//设置显示对象测量大小
				this.measureWidth = Math.max(this.measureWidth,child.x+child.measureWidth);
				this.measureHeight = Math.max(this.measureHeight,child.y+child.measureHeight);
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