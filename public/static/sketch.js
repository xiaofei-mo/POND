var xoff = 0.0;
var inc = 0.03;

var str1 = "rgba(255,0,255,";
var str2 = ")";

function setup() {

	createCanvas(windowWidth,windowHeight);

}

function draw() {

	xoff += inc;
	var lumi = (noise(xoff)*8-6);

	var lumiValue = lumi.toString();
	var lumiString = str1.concat(lumiValue,str2);

	document.getElementById("rays").style.backgroundColor = lumiString;
	//println(document.getElementsByTagName("body")[0].style)

}
