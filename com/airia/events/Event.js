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
