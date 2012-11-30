var myApp = function(){
	var canvas;//canavs Dom节点的引用 
	var context;//上下文的引用
	var bgImg;//背景图片的引用 
	var date;//声明当前时间
	var timeLabel;
	var initContext = function(canvasId){//初始化上下文
		canvas = document.getElementById(canvasId);
		if(canvas.getContext){
			context = canvas.getContext("2d");
			context.translate(canvas.width/2,canvas.height/2); //将坐标系的(0,0)位置移动到中心
			context.save();//保存初始化时候的状态
		}else{
			alert("your browser didn't support html5");
		}
	};
	
	var numSet = function(targetNum){//如果数字小于10的话 前面补零
		if(parseInt(targetNum)<10){
			targetNum = "0"+targetNum;
		}
		return targetNum;
	}
	
	return {
		initContext:initContext,
		drawBG:function(){
			context.globalCompositeOperation = "destination-over";
			context.fillStyle = "RGBA(69,69,70,0.5)";
			context.strokeStyle = "RGB(112,170,50)";
			context.lineWidth = 2;
			context.fillRect(-canvas.width/2,-canvas.height/2,canvas.width,canvas.height);
			context.strokeRect(-canvas.width/2,-canvas.height/2,canvas.width,canvas.height);
			
			if(!bgImg){
				bgImg = new Image();
				bgImg.src = "http://airia.github.com/JSLearn/images/Prettybeauty8_05.jpg";
				bgImg.onload = function(){
					context.drawImage(bgImg,-canvas.width/2,-canvas.height/2,canvas.width,canvas.height);
				};
			}else{
				context.drawImage(bgImg,-canvas.width/2,-canvas.height/2,canvas.width,canvas.height);
			}
		},
		drawSkin:function(){
			
			/**
			 * 绘制外面的圆形边框
			 */
			context.rotate(-Math.PI/2);//逆时针旋转 90度 将垂直方向 作为起始
			context.strokeStyle = "#334455";
			context.lineWidth = 5;
			context.beginPath();
			context.arc(0,0,200,0,Math.PI*2,false);
			context.stroke();
			context.closePath();
			/**
			 * 开始绘制小时刻度
			 */
			context.beginPath();//每次修改了strokeStyle之前 都要调用beginPath;
			context.strokeStyle = "#FFFFFF";
			context.lineWidth = 3;
			context.lineCap = "round";
			for(var i=0;i<12;i++){
				context.rotate(Math.PI/6);
				context.moveTo(0,-195);
				context.lineTo(0,-180);
				context.stroke();
			}
			
			/**
			 * 绘制分钟刻度
			 */
			context.beginPath();
			context.strokeStyle = "#FFFF33";
			context.lineWidth = 1;
			context.lineCap = "round";
			for(var i=0;i<60;i++){
				if(i%5!=0){
					context.moveTo(0,-195);
					context.lineTo(0,-188);
					context.stroke();
				}
				context.rotate(Math.PI/30);
			}
			context.restore();//回到初始化的状态
			context.save();//保存初始化的状态
		},
		timeGo:function(){//绘制指针 让指针走起来
			date = new Date();
			var seconds = date.getSeconds();
			var minutes = date.getMinutes();
			var hours = date.getHours();
			var month = date.getMonth();
			var day = date.getDate();
			this.setTimeTxt(numSet(hours)+":"+numSet(minutes)+":"+numSet(seconds),0,-100);
			this.setTimeTxt(numSet(month+1)+"月"+numSet(day)+"日",0,100);
			//绘制时针
			context.beginPath();
			var hoursPointAngle = Math.PI/6*(hours%12)+minutes/60*Math.PI/6;
			context.rotate(hoursPointAngle);//在beginPath后紧跟rotate方法 确保后面的绘制效果可以应用到旋转的参数
			context.strokeStyle = "RGB(112,170,50)";
			context.lineCap = "round";
			context.lineWidth = 4;
			context.moveTo(0,25);
			context.lineTo(0,-130);
			context.stroke();
			context.restore();
			context.save();
			
			//绘制分针
			context.beginPath();
			context.rotate(Math.PI/30*minutes+seconds/60*Math.PI/30);
			context.strokeStyle = "#FFF333";
			context.lineCap = "round";
			context.lineWidth = 3;
			context.moveTo(0,20);
			context.lineTo(0,-150);
			context.stroke();
			context.restore();
			context.save();
			
			//绘制秒针
			context.beginPath();
			// context.globalCompositeOperation = "source-over";
			context.strokeStyle = "RGB(224,120,49)";
			context.lineWidth = 3;
			context.lineCap = "round";
			context.rotate(Math.PI/30*seconds);
			context.moveTo(0,-160);
			context.lineTo(0,30);
			context.stroke();
			//绘制秒针上面的圆圈
			context.beginPath();
			context.fillStyle = "#FFFFFF";
			context.arc(0,-130,8,0,Math.PI*2,false);
			context.fill();
			context.stroke();
			//绘制秒针后面的圆圈
			context.beginPath();
			context.fillStyle = "RGB(224,120,49)";
			context.arc(0,30,6,0,Math.PI*2,false);
			context.fill();
			context.restore();//回到初始化的状态
			context.save();//保存初始化的状态;
			
			//绘制中心的柱子
			context.beginPath();
			context.strokeStyle = "#FFFFFF";
			context.fillStyle = "#FFFFFF";
			context.arc(0,0,6,0,Math.PI*2,false);
			context.fill();
		},
		setTimeTxt:function(timeLabelText,x,y){
			context.fillStyle = "#FFFFFF";
			context.font = "20px 微软雅黑 ";
			context.textAlign = "center";
			context.textBaseLine = "middle";
			context.fillText(timeLabelText,x,y);
		},
		startUp:function(){
			context.clearRect(-canvas.width/2,-canvas.height/2,canvas.width,canvas.height);
			myApp.drawSkin();
			myApp.timeGo();
			myApp.drawBG();
		}
	};
}();
myApp.initContext("myCanvas");
myApp.startUp();
setInterval(myApp.startUp,1000);
