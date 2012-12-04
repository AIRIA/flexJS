(function() {
	/**
	 * @class RoundRectMask
	 * @description
	 * @constructor
	 * @param {JSON}
	 */
	Flex.RoundRectMask = function(config) {
		Flex.extend(this, new Flex.BaseMask(config), config);
		this.topLeftRadius = 0;
		this.bottomLeftRadius = 0;
		this.topRightRadius = 0;
		this.bottomRightRadius = 0;
	}

	Flex.RoundRectMask.prototype = {
		constructor : Flex.RoundRectMask,
		start : function() {
			context.save();
			context.beginPath();
			var stageX = this.stageX;
			var stageY = this.stageY;
			var width = this.width;
			var height = this.height;
			var topLeftRadius = this.topLeftRadius;
			var bottomLeftRadius = this.bottomLeftRaidus;
			var topRightRadius = this.topRightRadius;
			var bottomRightRadius = this.bottomRightRadius;
			context.arcTo(stageX, topLeftRadius, topLeftRadius, stageY, topLeftRadius);
			context.lineTo(stageX + width - topRightRadius, stageY);
			context.arcTo(stageX + width - topRightRadius, stageY, stageX + width, stageY + topRightRadius, topRightRadius);
			context.lineTo(stageX + width, stageY + height - bottomRightRadius);
			context.arcTo(stageX + width, stageY + height - bottomRightRadius, stageX + width - bottomRightRadius, stageY + height, bottomRightRadius);
			context.lineTo(stageX + bottomLeftRadius, stageY + height);
			context.arcTo(stageX + bottomLeftRadius, stageY + height, stageX, stageY + height - bottomLeftRadius, bottomLeftRadius);
			context.closePath();
		},
		end : function() {
			context.restore();
		}
	}

})();
