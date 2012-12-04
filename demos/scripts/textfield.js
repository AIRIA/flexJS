var stage = new Flex.Stage("myCanvas");
var textField = new Flex.TextField();
var textFormat = new Flex.TextFormat({
	font:'宋体',
	size:24,
	color:'#FFFFFF'
});

textField.textFormat = textFormat;
textField.text = "Hello TF";
stage.addChild(textField);
