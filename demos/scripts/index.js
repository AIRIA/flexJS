var StyleUtil = function() {

	return {
		resetStyle : function(parentNodeID, className) {
			var parent = document.getElementById(parentNodeID);
			var links = parent.getElementsByTagName("a");
			var link;
			for(var i = links.length - 1; i >= 0; i--) {
				link = links[i];
				link.className = "";
				link.onclick = function() {
					StyleUtil.setStyle(parentNodeID, className);
					this.className = className;
				}
			}
			if(arguments.length==3){
				links[arguments[2]].className = className;	
			}
		},
		setStyle : function() {
			this.resetStyle.apply(null,arguments);
		}
	};
}();
