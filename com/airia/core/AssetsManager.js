(function(){

	/**
	 * 资源modal 包括两个属性 一个是src 一个是被引用次数 used
	 */
	Flex.app.Assets = function(){
		this.src = null;
		this.used = 0;
	};
	/**
	 * 资源管理类
	 * cachedAssets中存放Assets对象实例
	 */
	Flex.app.AssetsManager = {
		cachedAssets:[],
	};
})();
