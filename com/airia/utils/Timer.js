(function() {
	/**
	 * @author AIRIA
	 * @class Flex.Timer
	 * @extends Flex.EventDispatcher 
	 * @description Flex.Timer 类是 计时器的接口。 可以创建新的 Timer 对象，以便按指定的时间顺序运行代码。 使用 start() 方法来启动计时器。 为 timer 事件添加事件侦听器，以便将代码设置为按计时器间隔运行
	 * @constructor 构造方法
	 * @param {Number} 计时器事件间的延迟（以毫秒为单位）
	 * @param {Number} 指定重复次数
	 */
	Flex.Timer = function(delay, repeateCount) {
		Flex.extend(this,Flex.EventDispatcher());
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
		this.repeateCount = repeateCount;
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
			this.timerId = setTimeout(this._timeComplete,this.delay);
		},
		_timeComplete:function(){
			this.currentCount++;
			this.dispatcherEvent(new Flex.Event(TimerEvent.TIMER));
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
