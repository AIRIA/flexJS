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
			} else if(this.getRect){//getRect来判断是不是displayObject类型的对象
				throw new Error("normal quit");
			}
		}
	}
})();
