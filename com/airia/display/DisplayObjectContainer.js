(function() {
	Flex.DisplayObjectContainer = function(config) {
		Flex.extend(this, new Flex.DisplayObject(config));
		this._children = [];
	}

	Flex.DisplayObjectContainer.prototype = {
		constructor : Flex.DisplayObjectContainer,
		numChildren : function() {
			return this._children.length;
		},
		addChild : function(child) {
			var children = this._children;
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
					this._children.push(child);
					child.parent = this;
				} else {
					trace(child + "不是DisplayObject的实例", Flex.Const.Log.ERROR);
				}
			}
			return children;
		},
		addChildAt : function(child, index) {
			this._children.splice(index - 1, 0, child);
			child.parent = this;
			return child;
		},
		contains : function(child) {
			if(this._children.indexOf(child) == -1) {
				return false;
			}
			return true;
		},
		getChildren : function() {
			return this._children;
		},
		getChildAt : function(index) {
			if(this._children.length - 1 < index) {
				trace(this + "索引越界异常");
				return;
			}
			return this._children[index];
		},
		getChildIndex : function(child) {
			var index = this._children.indexOf(child);
			if(index == -1) {
				trace(this + "中不存在" + child + "显示对象")
				return;
			}
			return index;
		},
		removeChild : function(child) {
			this._children.splice(this.getChildAt(child), 1);
			return child;
		},
		removeChildAt : function(index) {
			var child = this.getChildAt(index);
			this._children.splice(index, 1);
			return child;
		},
		setChildIndex : function(child, index) {
			//TODO
		},
		swapChildren : function(child1, child2) {
			var childList = this._children;
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
