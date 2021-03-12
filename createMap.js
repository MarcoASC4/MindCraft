CANVAS_WIDTH =1920;
CANVAS_HEIGHT = 1080;

// Node Class
// grabbed => indicates if the node is being 'grabbed' by the mouse
//var node = {
//  x: 200,
//  y: 200,
//  diameter: 200,
//  height: 100,
//  grabbed: false
//}

var inp;
var numOfNodes = 1;
var numNodes = 0;
var valSet = 1;
let nodes = [];
let inputs = [];
var j;
let px, py;
var inputXVal = 100;
var inputYVal = 40;
// Creates the canvas


function addNode() {
  numNodes++;
  node1 = new Node(200+(numNodes*100),200,200,100,50,50,50,50,false, false);

  node1.inp.input(myInputEvent);
  node1.inp.position(250+(numNodes*100),270);
  node1.inp.size(100,40);
  node1.inp.style('backround-color', color(255,255,255));
  node1.inp.changed(textFromBox);

  nodes.push(node1);
  inputs.push(node1.inp);


  draw();


  //for(j=0; j<=numNodes; j++){
  //  node[j] = new Node(200+(j*20),200,200,100,false);
  //  }

}

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  background(66, 135, 245);
}

function textFromBox() {
  //console.log(this.numNodes());
  this.text = this.numNodes();
  console.log(this.text);

}

function myInputEvent() {
  // Prints whatever is being typed into inp
    console.log('you are typing: ', this.numNodes());
  }

function test(){
  console.log('Check');
}

function draw(){
  // This background(66, 135, 245) updates the background so that there aren't several copies of
  // the node when we drag it around
  background(66, 135, 245);
  // Draws our node
  //ellipse(node.x, node.y, node.diameter, node.height);
  textAlign(CENTER);
  //text(inp.numNodes(), node.x, node.y);
  displayNodes(mouseX, mouseY);
  //  print(grabbed);

}


class Node {
  constructor(x, y, width, height, round1, round2, round3, round4, grabbed, resizeDC, resizeKP) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.round1 = round1;
    this.round2 = round2;
    this.round3 = round3;
    this.round4 = round4;
    this.grabbed = grabbed;
    this.resizeDC = resizeDC;
    this.resizeKP = resizeKP;
    this.offsetX = 0;
    this.offsetY = 0;
    this.text = '';
    this.inp = createInput();
    //this.resize = resize;
  }

  checkClicked(px, py) {
    //let d = dist(px, py, this.x , this.y);
    if ((px > this.x && px < (this.x + this.width)) && ((py > this.y) && py < (this.y + this.height))) {
      this.grabbed = true;
      this.offsetX = this.x - px;
      this.offsetY = this.y - py;

    }

  }

  checkDoubleClick(px, py){
    if ((px > this.x && px < (this.x + this.width)) && ((py > this.y) && py < (this.y + this.height))) {
    console.log('yes');
    this.resizeDB = !this.resizeDB;
    }
  }

  checkKeyPress() {
    if (this.resizeDB) {
      if (keyCode == RIGHT_ARROW) {
        this.width += 10;
        inputXVal = this.width - 90;
        this.inp.size(inputXVal, inputYVal)
      }
      else if (keyCode == LEFT_ARROW) {
        if (this.width < 200){
          
        }
        else{
          this.width -= 10;
        }
        inputXVal = this.width - 90;
        this.inp.size(inputXVal, inputYVal)
      }
      else if (keyCode == DOWN_ARROW) {
        this.height += 10;
        inputYVal = this.height - 40;
        this.inp.size(inputXVal, inputYVal);
      }
      else if (keyCode == UP_ARROW) {
        if(this.height < 100){

        }
        else{
          this.height -= 10;
        }
        inputYVal = this.height - 40;
        this.inp.size(inputXVal, inputYVal);
      }
    }

  }
}

var k;

function mousePressed(){
  for (k=0; k<nodes.length; k++) {
    nodes[k].checkClicked(mouseX, mouseY);
  }
}

function mouseReleased(){
  for (k=0; k<nodes.length; k++){
    nodes[k].grabbed = false;
  }
}

function doubleClicked(){
  for (k=0; k<nodes.length; k++){
    nodes[k].checkDoubleClick(mouseX, mouseY);
    
  }
}

function keyPressed() {
  for (k=0; k<nodes.length; k++){
    nodes[k].checkKeyPress();
  }
}


var i = 0;

function displayNodes(px, py) {
  stroke(51);
  strokeWeight(4);
  //scale(mouseX / 400, mouseY / 400);
  for (i=0; i<=numNodes-1; i++){
    rect(nodes[i].x, nodes[i].y, nodes[i].width, nodes[i].height, nodes[i].round1, nodes[i].round2, nodes[i].round3, nodes[i].round5, nodes[i].grabbed);
    if(nodes[i].grabbed) {
      // Movement
      nodes[i].x = px + nodes[i].offsetX;
      nodes[i].y = py + nodes[i].offsetY;
      nodes[i].inp.position(px + nodes[i].offsetX+50, py + nodes[i].offsetY+70);
    }

  }
}

/*function mousePressed () {
  // mousePressed() is triggered when the mouse is clicked
  // Contains logic for checking if our mouse click is INSIDE the node
  let d = dist(mouseX, mouseY, node.x, node.y);
  if (d < node.height) {
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