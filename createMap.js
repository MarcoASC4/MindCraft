CANVAS_WIDTH =700;
CANVAS_HEIGHT = 700;

// Node Class
// grabbed => indicates if the node is being 'grabbed' by the mouse
//var node = {
//  x: 200,
//  y: 200,
//  diameter: 200,
//  radius: 100,
//  grabbed: false
//}

var inp;
var numOfNodes = 1;
var value = 1;
var valSet = 1;
let node = [];
var j;
// Creates the canvas


function addValue() {
  value++;
  console.log(value);
}

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  background(66, 135, 245);
  for(j=0; j<=value; j++){
    node[j] = new Node(200+(j*20),200,200,100,false);
    }

  inp = createInput();
  inp.input(myInputEvent);
  inp.position(200,50);
  inp.size(250,40);
  inp.style('backround-color', color(255,255,255));
  inp.changed(textFromBox);
  // Input Text Field over node
}

function textFromBox() {
  console.log(inp.value());
}

function myInputEvent() {
  // Prints whatever is being typed into inp
    console.log('you are typing: ', this.value());
  }

function test(){
  console.log('Check');
}

function draw(){
  // This background(66, 135, 245) updates the background so that there aren't several copies of
  // the node when we drag it around
  background(66, 135, 245);
  // Draws our node
  //ellipse(node.x, node.y, node.diameter, node.radius);
  textAlign(CENTER);
  //text(inp.value(), node.x, node.y);
  show();
  //  print(grabbed);
}

class Node {
  constructor(x, y, diameter, radius, grabbed) {
    this.x = x;
    this.y = y;
    this.diameter = diameter;
    this.radius = radius;
    this.grabbed = grabbed;
  }

}

var i = 0;

function show() {
  stroke(255);
  strokeWeight(4);
  for (i=0; i<=value-1; i++){
    ellipse(node[i].x, node[i].y, node[i].diameter, node[i].radius, node[i].grabbed);
  }
}

/*function mousePressed () {
  // mousePressed() is triggered when the mouse is clicked
  // Contains logic for checking if our mouse click is INSIDE the node
  let d = dist(mouseX, mouseY, node.x, node.y);
  if (d < node.radius) {
    node.grabbed = true;
  } else {
    node.grabbed = false;
  }
}

function mouseReleased () {
  // mouseReleased() is triggered when the mouse click is released
  node.grabbed = false;
}

function mouseDragged() {
  // Updates the position of the node when being dragged
  if (node.grabbed) {
    node.x = mouseX;
    node.y = mouseY;
  }

}*/