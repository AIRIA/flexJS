var stage = new Flex.Stage("myCanvas");
var textField = new Flex.TextField();
textField.width = stage.stageWidth-40;
textField.x = 20;
textField.y = 20;
var textFormat = new Flex.TextFormat({
	font:'宋体',
	size:18,
	color:'#aaaaaa'
});

textField.textFormat = textFormat;
textField.text = "1985年，Adobe公司在由苹果公司LaserWriter打印机带领下的PostScript桌面出版革命中扮演了重要的角色，公司名称“Adobe”来自于奥多比溪：这条河在公司原位于加州山景城的办公室不远处。2005年4月18日，Adobe系统公司以34亿美元的价格收购了原先最大的竞争对手Macromedia公司，这一收购极大丰富了Adobe的产品线，提高了其在多媒体和网络出版业的能力，这宗交易在2005年12月完成。2006年12月，Adobe宣布全线产品采用新图示，以彩色的背景配搭该程序的简写，例如：蓝色配搭Ps是Photoshop，红色配搭Fl是Flash，感觉像是元素符号，引起社会极大回响。2008年，Adobe公司在Adobe cs3基础上推出Adobe CS4，Adobe CS5套装，将有更多新功能加入^-^";
stage.addChild(textField);
