(function(){
	/**
	 * @author AIRIA
	 * @class Flex.Group
	 * @constructor 
	 * @description
	 * @param {JSON} 
	 * 
	 */
	Flex.Group = function(config){
		Flex.extend(this,new Flex.Sprite(config),config);
		/**
		 * @description 布局的方向 默认是垂直方向  【vertical|horizontal】
		 * @field
		 */
		this.direction = "vertical";
		/**
		 * @description 垂直布局中的行间距 
		 * @field
		 */
		this.verticalGap = 5;
		/**
		 * @description 水平布局中的列间距
		 * @field
		 */
		this.horizontalGap = 5;
		/**
		 * @description 水平对齐容器中的子容器。可能值包括 "left"、"center" 和 "right"。默认值为 "left"
		 * @field
		 */
		this.horizontalAlign = "left";
		/**
		 * @description 垂直对齐容器中的子项。可能值包括 "top"、"middle" 和 "bottom"。默认值为 "top"
		 * @field
		 */
		this.verticalAlign = "top";
		
		this.paddingTop = 0;
		this.paddingLeft = 0;
		this.paddingBottom = 0;
		this.paddingRight = 0;
	}
	
	Flex.Group.prototype = {
		constructor:Flex.Group,
		/**
		 * [override]
		 */
		addChild:function(child){
			this.superClass.addChild.apply(this,[child]);
			this.updateDisplayList();
		},
		/**
		 * 进行布局
		 */
		updateDisplayList:function(){
			this.measureHeight = 0;
			this.measureWidth = 0;
			var children = this.getChildren();
			var numChildren = this.numChildren;
			var child;
			var maxWidth = 0;
			var maxHeight = 0;
			if(this.direction=="vertical"){
				for(var i=0;i<numChildren;i++){
					child = children[i];
					child.stageX = this.paddingLeft+this.stageX;
					child.x = this.paddingLeft;
					child.y = this.measureHeight;
					child.stageY = this.stageY+child.y;
					if(i == 0) {
						child.y += this.paddingTop;
					}else{
						child.y+=this.verticalGap;
					}
					if(child.explicitOrMeasureWidth > maxWidth) {
						maxWidth = child.explicitOrMeasureWidth;
					}
					this.measureHeight = child.y + child.explicitOrMeasureHeight;
				}
				this.measureWidth = maxWidth+this.paddingLeft+this.paddingRight;
				this.measureHeight+= this.paddingBottom;
			}else{
				for (var i=0; i < numChildren; i++) {
					child = children[i];
					child.stageY = this.paddingTop+this.stageY;
					child.y = this.paddingTop;
					child.x = this.measureWidth;
					child.stageX = this.stageX+child.x;
					if(i==0){
						child.x += this.paddingLeft;	
					}else{
						child.x+=this.horizontalGap;
					}
					if(child.explicitOrMeasureHeight>maxHeight){
						maxHeight = child.explicitOrMeasureHeight;
					}
					this.measureWidth = child.x + child.explicitOrMeasureWidth;
				}
				this.measureHeight = maxHeight+this.paddingTop+this.paddingBottom;
				this.measureWidth+= this.paddingRight;
			}
		}
	}
	
})();
