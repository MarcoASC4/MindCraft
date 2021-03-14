

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
var numnodes = 0;
var valSet = 1;

//create Empty JSON Graph (we also need a function to import a saved json graph)
let g = createGraphJSON("title");
let nodes = [];
let inputs = [];
var j;
let px, py;
var inputXVal = 100;
var inputYVal = 40;
// Creates the canvas

var connecting = false;
var connect1 = [];
var connect2 = [];
var connect1Bool = false;
var connect2Bool = false;
var twoNodesinp1;
var twoNodesinp2;

function addNode() {
  numnodes++;
  node1 = new Node(200+(numnodes*100),200,200,100,50,false, false, false);

  node1.inp.input(myInputEvent);
  node1.inp.position(250+(numnodes*100),325);
  node1.inp.size(100,40);
  node1.inp.style('backround-color', color(255,255,255));
  node1.inp.changed(textFromBox);

  g.nodes.push(node1.n);
  nodes.push(node1);
  inputs.push(node1.inp);


  draw();


  //for(j=0; j<=numg.nodes; j++){
  //  node[j] = new Node(200+(j*20),200,200,100,false);
  //  }

}

function addLine() {

  connect1Bool = false;
  connect2Bool = false;
  twoNodesinp1 = createInput('');
  twoNodesinp1.input(myInputEvent);
  twoNodesinp1.position(800,50);
  twoNodesinp1.size(80,40);
  twoNodesinp1.changed(connectingText1);

  twoNodesinp2 = createInput('');
  twoNodesinp2.input(myInputEvent);
  twoNodesinp2.position(900,50);
  twoNodesinp2.size(80,40);
  twoNodesinp2.changed(connectingText2);
}

function connectingText1() {
  connect1.push(twoNodesinp1.value());
  connect1Bool = true;
}

function connectingText2() {
  connect2.push(twoNodesinp2.value());
  connect2Bool = true;
  displaynodes();
}

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  background(66, 135, 245);
}

function textFromBox() {
  //console.log(this.numnodes());
  this.text = this.value();
  console.log(this.text);

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
  //ellipse(node.x, node.y, node.diameter, node.height);
  textAlign(CENTER);
  //text(inp.numnodes(), node.x, node.y);
  displaynodes(mouseX, mouseY);
  //  print(grabbed);

}


class Node {
  constructor(x, y, width, height, round, grabbed, resizeDC, resizeKP) {
    this.n = createNodeJSON(x, y, width, height, round, grabbed, resizeDC, resizeKP); //this is the JSON that we upload to Firebase
    console.log(this.n);

    this.inp = createInput();
  }

  checkClicked(px, py) {
    //let d = dist(px, py, this.x , this.n.y_pos);
    if ((px > this.n.x_pos && px < (this.n.x_pos + this.n.width)) && ((py > this.n.y_pos) && py < (this.n.y_pos + this.n.height))) {
      this.n.grabbed = true;
      this.n.offsetX = this.n.x_pos - px;
      this.n.offsetY = this.n.y_pos - py;

    }

  }

  checkDoubleClick(px, py){
    if ((px > this.n.x_pos && px < (this.n.x_pos + this.n.width)) && ((py > this.n.y_pos) && py < (this.n.y_pos + this.n.height))) {
    console.log('yes');
    this.n.resizeDB = !this.n.resizeDB;
    }
  }

  checkKeyPress() {
    if (this.n.resizeDB) {
      if (keyCode == RIGHT_ARROW) {
        this.n.width += 10;
        inputXVal = this.n.width - 90;
        this.inp.size(inputXVal, inputYVal)
      }
      else if (keyCode == LEFT_ARROW) {
        if (this.n.width < 200){
          
        }
        else{
          this.n.width -= 10;
        }
        inputXVal = this.n.width - 90;
        this.inp.size(inputXVal, inputYVal)
      }
      else if (keyCode == DOWN_ARROW) {
        this.n.height += 10;
        inputYVal = this.n.height - 40;
        this.inp.size(inputXVal, inputYVal);
      }
      else if (keyCode == UP_ARROW) {
        if(this.n.height < 100){

        }
        else{
          this.n.height -= 10;
        }
        inputYVal = this.n.height - 40;
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
    nodes[k].n.grabbed = false;
  }
}

function doubleClicked(){
  for (k=0; k<g.nodes.length; k++){
    nodes[k].checkDoubleClick(mouseX, mouseY);
    
  }
}

function keyPressed() {
  for (k=0; k<g.nodes.length; k++){
    nodes[k].checkKeyPress();
  }
}


var i = 0;

function displaynodes(px, py) {
  stroke(51);
  strokeWeight(4);
  //scale(mouseX / 400, mouseY / 400);
  for (i=0; i<=numnodes-1; i++){
    rect(nodes[i].n.x_pos, nodes[i].n.y_pos, nodes[i].n.width, nodes[i].n.height, nodes[i].n.round,nodes[i].n.round,nodes[i].n.round,nodes[i].n.round, nodes[i].n.grabbed);
    if(nodes[i].n.grabbed) {
      // Movement
      console.log("grabbed");
      nodes[i].n.x_pos = px + nodes[i].n.offsetX;
      nodes[i].n.y_pos = py + nodes[i].n.offsetY;
      nodes[i].inp.position(px + nodes[i].n.offsetX+50, py + nodes[i].n.offsetY+125);
    }

  }

  for (j=0; j<connect1.length; j++){
    if((connect1Bool == true) && (connect2Bool == true))
        line(nodes[connect1[j]-1].n.x_pos + nodes[connect1[j]-1].n.width, nodes[connect1[j]-1].n.y_pos+50, nodes[connect2[j]-1].n.x_pos, nodes[connect2[j]-1].n.y_pos+50);
  }
}

//create an empty graph JSON object
function createGraphJSON(title)
{
  return {
    "label": title,
    "nodes": [], //no nodes

    "edges": [] //no edges
  };
}


//add an edge to a graph JSON object
function createEdgeJSON(source, target, label)
{
  return {
    source: source,
    target: target,
    label:  label
  };
}


//NODE Methods
//create a node JSON object
function createNodeJSON(x, y, width, height, round, grabbed, resizeDC, resizeKP)
{
  return {x_pos: x,
          y_pos: y,
          width : width,
          height : height,
          round : round,
          grabbed : grabbed,
          resizeDC : resizeDC,
          resizeKP : resizeKP,
          offsetX : 0,
          offsetY : 0,
          text : ''
        };

}
