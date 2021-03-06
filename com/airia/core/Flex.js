/**
 *
 *
 */
(function(window) {
	/**
	 * pivotX pivotY 用来保存当前要渲染的显示对象的注册点
	 */
	var Flex = window.Flex = window.$f = {
		app:window,
		pivotX:0,
		pivotY:0
	};
	Flex.extend = function(sub, sup) {
		var args = Array.prototype.slice.call(arguments);
		args.shift();
		args.shift();
		sup.constructor.apply(sub,args);
		sub.superClass = sup.__proto__;
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