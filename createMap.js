CANVAS_WIDTH =1920;
CANVAS_HEIGHT = 1080;

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
var value = 0;
var valSet = 1;
let node = [];
let inputs = [];
var j;
let px, py;
// Creates the canvas


function addValue() {
  value++;
  addNode();
  console.log(value);
}

function addNode() {
  node1 = new Node(200+(value*100),200,200,100,false);

  node1.inp.input(myInputEvent);
  node1.inp.position(150+(value*100),215);
  node1.inp.size(100,40);
  node1.inp.style('backround-color', color(255,255,255));
  node1.inp.changed(textFromBox);

  node.push(node1);
  inputs.push(node1.inp);


  draw();


  //for(j=0; j<=value; j++){
  //  node[j] = new Node(200+(j*20),200,200,100,false);
  //  }

}

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  background(66, 135, 245);

  //node1 = new Node(200+(value*20),200,200,100,false);
  //node.push(node1);

  /*inp = createInput();
  inp.input(myInputEvent);
  inp.position(200+(value*20),200);
  inp.size(250,40);
  inp.style('backround-color', color(255,255,255));
  inp.changed(textFromBox);
  inputs.push(inp);*/
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
  show(mouseX, mouseY);
  //  print(grabbed);
}

class Node {
  constructor(x, y, diameter, radius, grabbed, text, resize) {
    this.x = x;
    this.y = y;
    this.diameter = diameter;
    this.radius = radius;
    this.grabbed = grabbed;
    this.offsetX = 0;
    this.offsetY = 0;
    this.text = text;
    this.inp = createInput();
    this.resize = resize;
  }

  clicked(px, py) {
    let d = dist(px, py, this.x , this.y);
    if (d < this.radius) {
      this.grabbed = true;
      this.offsetX = this.x - px;
      this.offsetY = this.y - py;
    }
    //else if(px == this.x && py == this.y){
    //  this.resize = true;
    //}

  }
  notClicked(px, py){
    this.grabbed = false;
    this.resize = false;
  }

}

var k;

function mousePressed(){
  for (k=0; k<node.length; k++) {
    node[k].clicked(mouseX, mouseY);
  }
}

function mouseReleased(){
  for (k=0; k<node.length; k++){
    node[k].notClicked();
  }
}


var i = 0;

function show(px, py) {
  stroke(51);
  strokeWeight(4);
  //scale(mouseX / 400, mouseY / 400);
  for (i=0; i<=value-1; i++){
    ellipse(node[i].x, node[i].y, node[i].diameter, node[i].radius, node[i].grabbed);
    if(node[i].grabbed) {
      node[i].x = px + node[i].offsetX;
      node[i].y = py + node[i].offsetY;
      node[i].inp.position(px + node[i].offsetX - 50, py + node[i].offsetY+15);
    }

    if(node[i].resize) {
      node[i].scale(mouseX / 400, mouseY / 400);
    }
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