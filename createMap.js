CANVAS_WIDTH =400;
CANVAS_HEIGHT = 400;

// Node Class
// grabbed => indicates if the node is being 'grabbed' by the mouse
var node = {
  x: 200,
  y: 200,
  diameter: 200,
  radius: 100,
  grabbed: false
}

var inp;

// Creates the canvas
function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  background(66, 135, 245);
  inp = createInput();
  inp.input(myInputEvent);
  inp.position(200,10);
  inp.size(10,40);
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

function draw(){
  // This background(66, 135, 245) updates the background so that there aren't several copies of
  // the node when we drag it around
  background(66, 135, 245);
  // Draws our node
  ellipse(node.x, node.y, node.diameter, node.radius);
  textAlign(CENTER);
  text(inp.value(), node.x, node.y);
  //  print(grabbed);
}

function mousePressed () {
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
}