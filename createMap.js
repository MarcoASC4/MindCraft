console.log("createMap.js is running..");

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


var i = 0;

//create Empty JSON Graph (we also need a function to import a saved json graph)
let nodes = [];
let edges = [];
let inputs = [];
let deletedNodes = [];
var j;
let px, py;
var inputXVal = 100;
var inputYVal = 40;
// Creates the canvas

var twoNodesinp1;
var twoNodesinp2;

var nodeInput;

var s;
var nodeToDelete;
var deleteNodeInp;
var indexOfNode = 0;



  // Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCJuTDil5mz0rsHrmBTlKSh0nPstEbwd3s",
  authDomain: "mind-barf-e6745.firebaseapp.com",
  databaseURL: "https://mind-barf-e6745-default-rtdb.firebaseio.com",
  projectId: "mind-barf-e6745",
  storageBucket: "mind-barf-e6745.appspot.com",
  messagingSenderId: "339425742596",
  appId: "1:339425742596:web:953a7a9ea744d52197ca51"
};
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var ref = firebase.database().ref("Graphs");
  database = firebase.database();
  //ref.on('value', gotData, errData)
  currentMindMap = createGraphJSON("startingGraph");
  //console.log("The Starting MindMap is: ");
  //console.log(currentMindMap); 
  nodes = currentMindMap.nodes;
  console.log("Initial Nodes: ");
  console.log(nodes);

function addNode() {
  numnodes++;
  node1 = new Node(200+(numnodes*100),200,200,100,50,false, false, false, false,numnodes-1);
  //node1 = new Node(200+(numnodes*100),200,200,100,50,false, false, false, false);
  //console.log("x: " + node1.n.x_pos);
                     // (x, y, width, height, round_amt, grabbed, resizeDC, resizeKP)

  // node1.inp.input(myInputEvent);
  // node1.inp.position(250+(numnodes*100),325);
  // node1.inp.size(100,40);
  // node1.inp.style('backround-color', color(255,255,255));
  // node1.inp.changed(textFromBox);
  nodes.push(node1);
  console.log("A new node has been pushed onto nodes. Here is nodes now:");
  console.log(nodes);
  
  //inputs.push(node1.inp);


  draw();


  //for(j=0; j<=numg.nodes; j++){
  //  node[j] = new Node(200+(j*20),200,200,100,false);
  //  }

}

function saveMindMap() {
  var g = createGraphJSON("testGraph");
  var result = ref.push(g, dataSent);
  console.log(result.key);
}

function dataSent(error, status) {
  console.log("dataSent(error, status): status = " + status);
}

function gotData(data) {
  console.log("Running gotData(data)...");
  var mindMaps = data.val();
  //console.log("mindMaps length: ");
  //console.log(mindMaps);
  var keys = Object.keys(mindMaps);
  console.log("Keys:");
  console.log(keys);
  for (var i = 0; i< keys.length; i++) {
    var key = keys[i];
    showMindMap();
  }
}

function showMindMap() {
  console.log("Running showMindMap...");
  var key = this.html();
  console.log("key in showMindMap() : " + key);
  var ref = database.ref('Graphs/' + key);
  //console.log("ref : ");
  //console.log(ref);
  ref.on('value', oneMindMap, errData);

  function oneMindMap(data) {
    var DBmindMap = data.val();
    currentMindMap = DBmindMap;
    if (!currentMindMap.nodes)
    {
      DBnodes = [];
    }
    else
    {
      DBnodes = DBmindMap.nodes;
    }
    console.log(DBnodes);
    nodes = [];
    for (j = 0; j < DBnodes.length; ++j)
    {
      currentNode = new Node(DBnodes[j].x_pos, DBnodes[j].y_pos, DBnodes[j].width, DBnodes[j].height, DBnodes[j].round_amt, DBnodes[j].grabbed, DBnodes[j].select, DBnodes[j].resizeDC, DBnodes[j].resizeKP);     
      nodes.push(currentNode);
    }
    console.log("nodes has been changed to:");
    console.log(nodes);
    console.log("Mindmap has been changed to: ");
    console.log(currentMindMap);
  }
  //console.log(this.html);
}

function errData(err) {
  console.log(err);
}

//Accepts input to connect two nodes
function addEdge() {
  
  //source input box
  twoNodesinp1 = createInput('');
  twoNodesinp1.input(myInputEvent);
  twoNodesinp1.position(800,50);
  twoNodesinp1.size(80,40);
  twoNodesinp1.changed(connectingText1);

  //var s = twoNodesinp1.value();

  //target input box
  twoNodesinp2 = createInput('');
  twoNodesinp2.input(myInputEvent);
  twoNodesinp2.position(900,50);
  twoNodesinp2.size(80,40);
  twoNodesinp2.changed(connectingText2);

  //var t = twoNodesinp2.value();

  //make JSON and store to edges list
  //var edge = createEdgeJSON(s,t);
  //edges.push(edge);


}

//First connecting node
function connectingText1() {
  //connect1.push(twoNodesinp1.value());
  s = twoNodesinp1.value();
}

//Second connecting node
function connectingText2() {
  var t = twoNodesinp2.value();
  var edge = createEdgeJSON(s,t);
  edges.push(edge);
  displaynodes();
}

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  background(66, 135, 245);

  nodeInput = createInput('');
  nodeInput.size(110,40);
  nodeInput.style('font-size', '24px');
}

function textFromBox() {
  //console.log(this.numnodes());
  //this.text = this.value();
  //console.log(this.text);

  for (j=0; j<numnodes; j++){
    if(nodes[j].n.select)
    {
      nodes[j].n.text = nodeInput.value();
      console.log(nodes[j].n.text);
      
    }
  }
}

function myInputEvent() {
  // Prints whatever is being typed into inp
    console.log('you are typing: ', this.value());
  }

function test(){
  console.log('Check');
}

//Text box to enter a node to delete
function deleteNodeText() {

  deleteNodeInp = createInput();
  deleteNodeInp.input(myInputEvent);
  deleteNodeInp.position(1200,50);
  deleteNodeInp.size(80,40);
  deleteNodeInp.changed(deleteNode);

}

//function to delete the node
function deleteNode() {
  nodeToDelete = deleteNodeInp.value();
  nodes.splice(nodeToDelete,1);
  numnodes -= 1;
  //nodes.remove[0];
  //numnodes -= 1;
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
  drawEdges();
  //  print(grabbed);
  nodeInput.changed(textFromBox);
  //console.log("Current MindMap: ");
  //console.log(currentMindMap);
  //console.log(currentMindMap.nodes);


}


class Node {
  constructor(x, y, width, height, round_amt, grabbed, select, resizeDC, resizeKP,index) {
    this.n = createNodeJSON(x, y, width, height, round_amt, grabbed, select, resizeDC, resizeKP,index); //this is the JSON that we upload to Firebase
    console.log(this.n.index);
  //constructor(x, y, width, height, round_amt, grabbed, select, resizeDC, resizeKP) {
    //this.n = createNodeJSON(x, y, width, height, round_amt, grabbed, select, resizeDC, resizeKP); //this is the JSON that we upload to Firebase
    //console.log("Node created. Its JSON object: ");
    //console.log(this.n);

    //this.inp = createInput();
  }

  writeNode(){
    textSize(24);
    strokeWeight(0);
    text(this.n.text, this.n.x_pos + this.n.width/2, this.n.y_pos + this.n.height/1.8);
  }

  checkClicked(px, py) {
    //let d = dist(px, py, this.x , this.n.y_pos);
    if ((px > this.n.x_pos && px < (this.n.x_pos + this.n.width)) && ((py > this.n.y_pos) && py < (this.n.y_pos + this.n.height))) {

        this.n.grabbed = true;
        this.n.offsetX = this.n.x_pos - px;
        this.n.offsetY = this.n.y_pos - py;
        deSelectAllNodes();
        this.n.select = true;

        nodeInput.value(this.n.text);

        nodeInput.position(this.n.x_pos + 20, this.n.y_pos+20);
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

      if(keyCode == DELETE){
        nodes.splice(this.n.index,1);
        numnodes -= 1;
        
        for(i=0; i<numnodes; i++){
          if (nodes[i].n.index > this.n.index){
            nodes[i].n.index -= 1;
          }
        }
      }

      if (keyCode == RIGHT_ARROW) {
        this.n.width += 10;
        inputXVal = this.n.width - 90;
        //this.inp.size(inputXVal, inputYVal)
      }
      else if (keyCode == LEFT_ARROW) {
        if (this.n.width < 200){
          
        }
        else{
          this.n.width -= 10;
        }
        inputXVal = this.n.width - 90;
        //this.inp.size(inputXVal, inputYVal)
      }
      else if (keyCode == DOWN_ARROW) {
        this.n.height += 10;
        inputYVal = this.n.height - 40;
        //this.inp.size(inputXVal, inputYVal);
      }
      else if (keyCode == UP_ARROW) {
        if(this.n.height < 100){

        }
        else{
          this.n.height -= 10;
        }
        inputYVal = this.n.height - 40;
        //this.inp.size(inputXVal, inputYVal);
      }

    }

  }
}

var k;

function deSelectAllNodes()
{
  for (k=0; k<nodes.length; k++) {
    nodes[k].n.select = false;
  }
}

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
  for (k=0; k<nodes.length; k++){
    nodes[k].checkDoubleClick(mouseX, mouseY);
    
  }
}

function keyPressed() {
  for (k=0; k<nodes.length; k++){
    nodes[k].checkKeyPress();
  }
}



function displaynodes(px, py) {
  console.log("displayNodes() is being run...");
  stroke(51);
  strokeWeight(4);
  //scale(mouseX / 400, mouseY / 400);
    for (i=0; i<=numnodes-1; i++){
      strokeWeight(2);
      rect(nodes[i].n.x_pos, nodes[i].n.y_pos, nodes[i].n.width, nodes[i].n.height, nodes[i].n.round_amt,nodes[i].n.round_amt,nodes[i].n.round_amt,nodes[i].n.round_amt, nodes[i].n.grabbed);
      if(nodes[i].n.grabbed) {
      // Movement
        console.log("grabbed");
        nodes[i].n.x_pos = px + nodes[i].n.offsetX;
        nodes[i].n.y_pos = py + nodes[i].n.offsetY;
        nodeInput.position(px + nodes[i].n.offsetX+50, py + nodes[i].n.offsetY+125);
      }
      nodes[i].writeNode();

  }
}

  function drawEdges(){
  if (edges.length > 0){
    strokeWeight(4);
    for (j=0; j<edges.length; j++)
    {
      var sx = nodes[edges[j].source].n.x_pos + nodes[edges[j].source].n.width;
      var sy = nodes[edges[j].source].n.y_pos + 50;
      var tx = nodes[edges[j].target].n.x_pos;
      var ty = nodes[edges[j].target].n.y_pos + 50;
      line(sx,sy,tx,ty);
    }
  }
}


//create an empty graph JSON object
function createGraphJSON(title)
{
  console.log("Nodes JSON: ");
  console.log(nodes);
  console.log("Edges JSON: ");
  console.log(edges);
  var i;
  var g = {"label": title,
           "nodes": [], //no nodes

           "edges": [] //no edges
          };
  
  for (i = 0; i < nodes.length; i++) g.nodes.push(nodes[i].n);
  //for (i = 0; i < nodes.length; i++) g.edges.push(edges[i]);   

  return g; 
}


//add an edge to a graph JSON object
function createEdgeJSON(source, target)
{
  return {
    source: source,
    target: target
  };
}


//NODE Methods
//create a node JSON object
function createNodeJSON(x, y, width, height, round_amt, grabbed, select, resizeDC, resizeKP,index)
{
  return {x_pos: x,
          y_pos: y,
          width : width,
          height : height,
          round_amt : round_amt,
          grabbed : grabbed,
          select : select,
          resizeDC : resizeDC,
          resizeKP : resizeKP,
          offsetX : 0,
          offsetY : 0,
          text : '',
          index : index
        };

}




//merge nodes and edges 
//graph1 and graph 2 are different JSON graphs
//nodeID1 is the index of a node in graph1
//nodeID 2 is the index node in graph2
function mergeMaps(graph1, graph2, nodeIndex1, nodeIndex2)
{
  int i;
  //combine the text of the nodes
  if (graph1.nodes[nodeIndex1].text != graph1.nodes[nodeIndex2].text)
  {
    graph1.nodes[nodeIndex1].text += ' ' + graph2.nodes[nodeIndex2].text;
  }

  for(i = 0; i < graph2.edges.length; i++)
  {
    graph1.nodes.push(graph2.edges[i])
  }

  return graph1;
}

//using NLP find similar spellings of words using levenstein distance
//using NLP search for synonyms in other nodes

