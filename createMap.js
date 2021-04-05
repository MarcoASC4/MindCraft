CANVAS_WIDTH =1920;
CANVAS_HEIGHT = 1080;

var inp;
var numnodes = 0;
var valSet = 1;


var i = 0;

var selectedID = 0;
var grabbedID = 0;
var connectCounter = 0;

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

var source = "";
var target = "";
var nodeToDelete;
var deleteNodeInp;
var indexOfNode = 0;
// The current_key is the key associated to the current mindmap being displayed
// which is saved in the database. (Keys are a string that usually start with "M....")
var current_key;
// The keys of the mindmaps saved in the database
var keys = [];

//if (localStorage.getItem("key") != null) 
current_key = localStorage.getItem("key");
//else window.location = "http://127.0.0.1:5501/allMindMaps.html";

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

if (localStorage.getItem("user") == null) window.location = "login.html";
console.log(localStorage.getItem("user"));

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var ref = firebase.database().ref("Graphs");
  database = firebase.database();
  var user = firebase.auth().currentUser;
  console.log("user: " + user);
  var isExistingMindMap;
  if (current_key != null) {
    currentMindMap = createGraphJSON(localStorage.getItem("label"));
    //currentMindMap.label = localStorage.getItem("label");
    isExistingMindMap = true;
  }

  else
  {
    currentMindMap = createGraphJSON("Untitled MindMap");
    isExistingMindMap = false;
  }
  ref.on('value', gotData, errData);
  console.log("current_key: " + current_key);
  console.log("currentMindMap.label: " + currentMindMap.label);
    //console.log("The Starting MindMap is: ");
    //console.log(currentMindMap); 
  if (window.location == "http://127.0.0.1:5501/test.html") showMindMap();

  //showMindMap();
  //nodes = currentMindMap.nodes;
  //console.log("Initial Nodes: ");
  //console.log(nodes);

  
//   //inputs.push(node1.inp);


//   draw();


//   //for(j=0; j<=numg.nodes; j++){
//   //  node[j] = new Node(200+(j*20),200,200,100,false);
//   //  }

// }

function createNewMindMap() {
  localStorage.removeItem("key");
  //localStorage.setItem("label", mindMap_name);
  if (window.location.href == "http://127.0.0.1:5501/test.html") {
      location.reload();
  }
  else
  {
    window.location = "http://127.0.0.1:5501/test.html"
  }
}

function addNode(){
  newNode = createNodeJSON(200+(currentMindMap.nodes.length*100),200,200,100,50,false, false, false, false,getNewID());
  currentMindMap.nodes.push(newNode);
  selectedID = newNode.index;
  console.log("Node added, here's the JSON of currentMindMap")
  console.log(currentMindMap);
  redraw();
}

function saveMindMap() {
  //var newNodesKey = firebase.database().ref('Graphs').child('nodes').push().key;
  //var DBmindMap = ref.child(s + "/store_location");
  //var updates = {};
  //updates['/nodes/' + newNodesKey] = currentMindMap;

  var result;
  if (isExistingMindMap)
  {
    var rootRef = firebase.database().ref('Graphs');
    rootRef.orderByChild('label').equalTo(currentMindMap.label).on("value", function(snapshot) {
      snapshot.forEach((function(child) { 
        current_key = child.key
        localStorage.setItem("key", current_key); })); 
    });
    rootRef = database.ref('Graphs/' + current_key);
    result = rootRef.update(currentMindMap, dataSent);
  } else
  {
    mindMap_name = prompt("Creating new Mindmap... What is the name?");
    if (mindMap_name == null)
    {
      return;
    }
    currentMindMap.label = mindMap_name;
    result = ref.push(currentMindMap);
    isExistingMindMap = true;
  }
}

function saveAs() {
  //var g = createGraphJSON("testGraph");
  mindMap_name = prompt("Creating new Mindmap... What is the name?");
  if (mindMap_name == null)
  {
    return;
  }
  currentMindMap.label = mindMap_name;
  var result = ref.push(currentMindMap, dataSent);
  console.log("currentMindMap in saveMindMap(): ");
  console.log(currentMindMap);
  console.log(result.key);

}

function dataSent(error, status) {
  console.log("dataSent(error, status): status = " + status);
}



function gotData(data) {
  console.log("Running gotData(data)...");
  var mindMaps = data.val();
  if (mindMaps == null) 
  {
    keys = []
  }
  else
  {
    keys = Object.keys(mindMaps);
  }
  console.log("Keys:");
  console.log(keys);
  old_key = current_key;
  for (var i = 0; i< keys.length; i++) {
    // Creating each mindmap in the html from the database that we can click on and open to edit
    var key = keys[i];
    current_key = keys[i];
    localStorage.setItem("key", current_key);
    var li = createElement('li', ''); 
    //console.log()
    current_label = mindMaps[key].label;
    var ahref = createA('#', current_label);
    ahref.style('text-decoration: none');
    ahref.style('padding: 2rem');
    ahref.style('text-align: center');
    ahref.mousePressed(showMindMap);
    console.log("window.location : ");
    console.log(window.location.href);
    if (window.location.href == "http://127.0.0.1:5501/allMindmaps.html") 
    {
      ahref.parent(li);
      li.parent('mindmapList');
      }
    }
    localStorage.setItem("key", old_key);
  }


function showMindMap() {
  console.log("Running showMindMap...");
  console.log(currentMindMap);
  //min = this.html();
  if (window.location.href != "http://127.0.0.1:5501/test.html")
  {
    var ref = firebase.database().ref('Graphs');
    ref.orderByChild('label').equalTo(this.html()).on("value", function(snapshot) {
      snapshot.forEach((function(child) { 
        current_key = child.key
        localStorage.setItem("key", current_key); })); 
        var c_label = this.html();
        localStorage.setItem("label", c_label);
    });
    console.log("NOT TEST.HTML");
    console.log(localStorage.getItem("key"));
  }
  if (window.location != "http://127.0.0.1:5501/test.html") window.location = "test.html";

  //}
  //else
 // {
    console.log("IT IS TEST.HTML");
    key = current_key;
//}
  console.log("key in showMindMap() : " + key);
  var ref = database.ref('Graphs/' + key);
  console.log("ref : ");
  console.log(ref);
  ref.on('value', oneMindMap, errData);

  function oneMindMap(data) {
    var DBmindMap = data.val();
    console.log("DBmindmap: " + DBmindMap); 
    if (DBmindMap != null) {
      currentMindMap = DBmindMap;
      if(currentMindMap.edges == null){
        currentMindMap.edges = [];
      }
      if(currentMindMap.nodes == null){
        currentMindMaps.nodes = [];
      }
    }
    console.log("currentMindMap = DBmindmap: ");
    console.log(currentMindMap);
    // if (!currentMindMap.nodes)
    // {
    //   DBnodes = [];
    // }
    // else
    // {
    //   DBnodes = DBmindMap.nodes;
    // }
    // console.log(DBnodes);
    // nodes = [];
    // for (j = 0; j < DBnodes.length; ++j)
    // {
    //   currentNode = new Node(DBnodes[j].x_pos, DBnodes[j].y_pos, DBnodes[j].width, DBnodes[j].height, DBnodes[j].round_amt, DBnodes[j].grabbed, DBnodes[j].select, DBnodes[j].resizeDC, DBnodes[j].resizeKP, DBnodes[j].index);     
    //   nodes.push(currentNode);
    // }
    console.log("nodes has been changed to:");
    console.log(nodes);
    console.log("Mindmap has been changed to: ");
    console.log(currentMindMap);
  }
  //if (window.location != "http://127.0.0.1:5501/test.html") window.location = "test.html";
  //console.log(this.html);
}


// Deletes mindmap from the database
// deleteMindMap(i) deletes the ith mindmap in the database 
function deleteMindMap(mindMap_num) {
  var key = keys[mindMap_num - 1];
  var ref = database.ref('Graphs/' + key);
  ref.remove();
  keys.splice(mindMap_num - 1, 1);
  location.reload();

}

function errData(err) {
  console.log(err);
}

//Accepts input to connect two nodes
// function addEdge() {
  
//   //source input box
//   twoNodesinp1 = createInput('');
//   twoNodesinp1.input(myInputEvent);
//   twoNodesinp1.position(800,50);
//   twoNodesinp1.size(80,40);
//   twoNodesinp1.changed(connectingText1);

//   //var s = twoNodesinp1.value();

//   //target input box
//   twoNodesinp2 = createInput('');
//   twoNodesinp2.input(myInputEvent);
//   twoNodesinp2.position(900,50);
//   twoNodesinp2.size(80,40);
//   twoNodesinp2.changed(connectingText2);

//   //var t = twoNodesinp2.value();

//   //make JSON and store to edges list
//   //var edge = createEdgeJSON(s,t);
//   //edges.push(edge);


// }

function addEdge(){
  if(currentMindMap.nodes.length >= 2){ 
  connectCounter = 1; // this means the next 2 clicks will link those nodes
  }
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
  redraw();
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
    redraw();
  }

function test(){
  console.log('Check');
}

// //Text box to enter a node to delete
// function deleteNodeText() {

//   deleteNodeInp = createInput();
//   deleteNodeInp.input(myInputEvent);
//   deleteNodeInp.position(1200,50);
//   deleteNodeInp.size(80,40);
//   deleteNodeInp.changed(deleteNode);

// }

//function to delete the node
function deleteNode() {
  //nodeToDelete = deleteNodeInp.value();
  currentMindMap.nodes.splice(getIndexFromID(selectedID) ,1);
  //numnodes -= 1;

  //also delete edges
  //nodeToDelete is the index or the ID of the node to delete
  currentMindMap.edges = currentMindMap.edges.filter(e => (e.source === nodeToDelete || e.target === nodeToDelete));
}

function draw(){
  // This background(66, 135, 245) updates the background so that there aren't several copies of
  // the node when we drag it around
  background(255, 255, 255);
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

//gets the index of the node for reference with the list
function getIndexFromID(id){
  return currentMindMap.nodes.findIndex(n => n.index === id);
}

//id assignment for nodes
function getNewID(){
  do {
    console.log("getNewID() running..");
    console.log(currentMindMap.label);
    id = currentMindMap.label.concat(String(Math.floor(1000 + Math.random() * 9000)));
  } while (currentMindMap.nodes.some(n => n.index === id));
  
  return id;
}

//writes the text of the node taken from the input field
function writeNode(id){
  textSize(24);
  strokeWeight(0);
  text(currentMindMap.nodes[getIndexFromID(id)].text, currentMindMap.nodes[getIndexFromID(id)].x_pos + currentMindMap.nodes[getIndexFromID(id)].width/2, currentMindMap.nodes[getIndexFromID(id)].y_pos + currentMindMap.nodes[getIndexFromID(id)].height/1.8);
}

function checkClicked(px, py, id){
  //let d = dist(px, py, this.x , this.n.y_pos);
  console.log(getIndexFromID(id));
  if ((px > currentMindMap.nodes[getIndexFromID(id)].x_pos && px < (currentMindMap.nodes[getIndexFromID(id)].x_pos + currentMindMap.nodes[getIndexFromID(id)].width)) && ((py > currentMindMap.nodes[getIndexFromID(id)].y_pos) && py < (currentMindMap.nodes[getIndexFromID(id)].y_pos + currentMindMap.nodes[getIndexFromID(id)].height))) {
      currentMindMap.nodes[getIndexFromID(id)].grabbed = true;
      grabbedID = id;
      currentMindMap.nodes[getIndexFromID(id)].offsetX = currentMindMap.nodes[getIndexFromID(id)].x_pos - px;
      currentMindMap.nodes[getIndexFromID(id)].offsetY = currentMindMap.nodes[getIndexFromID(id)].y_pos - py;
      deSelectAllNodes();
      currentMindMap.nodes[getIndexFromID(id)].select = true;
      
      //set node text when you click away
      if(currentMindMap.nodes.some(item => item.index === selectedID)){  //check if the node was deleted
        currentMindMap.nodes[getIndexFromID(selectedID)].text = nodeInput.value();
      }

      selectedID = id; //update the newly selected node

      //update node input field location and clear ""
      nodeInput.value(currentMindMap.nodes[getIndexFromID(id)].text);
      nodeInput.position(currentMindMap.nodes[getIndexFromID(id)].x_pos + 20, currentMindMap.nodes[getIndexFromID(id)].y_pos+20);
  }
}

function checkDoubleClick(px, py, id){
  if ((px > currentMindMap.nodes[getIndexFromID(id)].x_pos && px < (currentMindMap.nodes[getIndexFromID(id)].x_pos + currentMindMap.nodes[getIndexFromID(id)].width)) && ((py > currentMindMap.nodes[getIndexFromID(id)].y_pos) && py < (currentMindMap.nodes[getIndexFromID(id)].y_pos + currentMindMap.nodes[getIndexFromID(id)].height))) {
  console.log('double click');
  currentMindMap.nodes[getIndexFromID(id)].resizeDC = !currentMindMap.nodes[getIndexFromID(id)].resizeDC;
  }
}


function checkKeyPress(id) {
  if (currentMindMap.nodes[getIndexFromID(id)].resizeDC) {
    if(keyCode == DELETE){
      delete currentMindMap.nodes[getIndexFromID(id)];
    }

    if (keyCode == RIGHT_ARROW) {
      currentMindMap.nodes[getIndexFromID(id)].width += 10;
      inputXVal = currentMindMap.nodes[getIndexFromID(id)].width - 90;
      //this.inp.size(inputXVal, inputYVal)
    }
    else if (keyCode == LEFT_ARROW) {
      if (currentMindMap.nodes[getIndexFromID(id)].width < 200){
        
      }
      else{
        currentMindMap.nodes[getIndexFromID(id)].width -= 10;
      }
      inputXVal = currentMindMap.nodes[getIndexFromID(id)].width - 90;
      //this.inp.size(inputXVal, inputYVal)
    }

    else if (keyCode == DOWN_ARROW) {
      currentMindMap.nodes[getIndexFromID(id)].height += 10;
      inputYVal = currentMindMap.nodes[getIndexFromID(id)].height - 40;
      //this.inp.size(inputXVal, inputYVal);
    }
    else if (keyCode == UP_ARROW) {
      if(currentMindMap.nodes[getIndexFromID(id)].height < 100){

      }
      else{
        currentMindMap.nodes[getIndexFromID(id)].height -= 10;
      }
      inputYVal = currentMindMap.nodes[getIndexFromID(id)].height - 40;
      //this.inp.size(inputXVal, inputYVal);
    }

  }

}

// class Node {
//   constructor(x, y, width, height, round_amt, grabbed, select, resizeDC, resizeKP,index) {
//     this.n = createNodeJSON(x, y, width, height, round_amt, grabbed, select, resizeDC, resizeKP,index); //this is the JSON that we upload to Firebase
//     console.log(this.n.index);
//   //constructor(x, y, width, height, round_amt, grabbed, select, resizeDC, resizeKP) {
//     //this.n = createNodeJSON(x, y, width, height, round_amt, grabbed, select, resizeDC, resizeKP); //this is the JSON that we upload to Firebase
//     //console.log("Node created. Its JSON object: ");
//     //console.log(this.n);

//     //this.inp = createInput();
//   }

//   writeNode(){
//     textSize(24);
//     strokeWeight(0);
//     text(this.n.text, this.n.x_pos + this.n.width/2, this.n.y_pos + this.n.height/1.8);
//   }

//   checkClicked(px, py) {
//     //let d = dist(px, py, this.x , this.n.y_pos);
//     if ((px > this.n.x_pos && px < (this.n.x_pos + this.n.width)) && ((py > this.n.y_pos) && py < (this.n.y_pos + this.n.height))) {

//         this.n.grabbed = true;
//         this.n.offsetX = this.n.x_pos - px;
//         this.n.offsetY = this.n.y_pos - py;
//         deSelectAllNodes();
//         this.n.select = true;

//         nodeInput.value(this.n.text);

//         nodeInput.position(this.n.x_pos + 20, this.n.y_pos+20);
//     }

//   }

//    checkDoubleClick(px, py){
//      if ((px > this.n.x_pos && px < (this.n.x_pos + this.n.width)) && ((py > this.n.y_pos) && py < (this.n.y_pos + this.n.height))) {
//      console.log('yes');
//      this.n.resizeDC = !this.n.resizeDC;
//      }
//    }

//   checkKeyPress() {
//     if (this.n.resizeDC) {

//       if(keyCode == DELETE){
//         nodes.splice(this.n.index,1);
//         numnodes -= 1;
        
//         for(i=0; i<numnodes; i++){
//           if (nodes[i].n.index > this.n.index){
//             nodes[i].n.index -= 1;
//           }
//         }
//       }

//       if (keyCode == RIGHT_ARROW) {
//         this.n.width += 10;
//         inputXVal = this.n.width - 90;
//         //this.inp.size(inputXVal, inputYVal)
//       }
//       else if (keyCode == LEFT_ARROW) {
//         if (this.n.width < 200){
          
//         }
//         else{
//           this.n.width -= 10;
//         }
//         inputXVal = this.n.width - 90;
//         //this.inp.size(inputXVal, inputYVal)
//       }
//       else if (keyCode == DOWN_ARROW) {
//         this.n.height += 10;
//         inputYVal = this.n.height - 40;
//         //this.inp.size(inputXVal, inputYVal);
//       }
//       else if (keyCode == UP_ARROW) {
//         if(this.n.height < 100){

//         }
//         else{
//           this.n.height -= 10;
//         }
//         inputYVal = this.n.height - 40;
//         //this.inp.size(inputXVal, inputYVal);
//       }

//     }

//   }
// }

// var k;

// function deSelectAllNodes()
// {
//   for (k=0; k<nodes.length; k++) {
//     nodes[k].n.select = false;
//   }
// }

function deSelectAllNodes()
{
  for (n of currentMindMap.nodes) {
    n.select = false;
  }
}

// function mousePressed(){
//   for (k=0; k<nodes.length; k++) {
//     nodes[k].checkClicked(mouseX, mouseY);
//   }
// }

function mousePressed(){
  for (n of currentMindMap.nodes) {
    checkClicked(mouseX, mouseY, n.index);
  }

  if(connectCounter == 1){
    source = selectedID;
    console.log("connectCounter is 1");
    connectCounter = connectCounter + 1;
  }
  if(connectCounter == 2){
    if(source != selectedID){
      target = selectedID;
      currentMindMap.edges.push(createEdgeJSON(source, target));
      console.log("connectCounter is 2");
      connectCounter = 0;
    }
  }
  
}

// function mouseReleased(){
//   for (k=0; k<nodes.length; k++){
//     nodes[k].n.grabbed = false;
//   }
// }

function mouseReleased(){
  for (n of currentMindMap.nodes) {
    n.grabbed = false;
  }
}

// function doubleClicked(){
//   for (k=0; k<nodes.length; k++){
//     nodes[k].checkDoubleClick(mouseX, mouseY);\
//   }
// }

function doubleClicked(){
  for (n of currentMindMap.nodes) {
    checkDoubleClick(mouseX, mouseY, n.index);
  }
}

// function keyPressed() {
//   for (k=0; k<nodes.length; k++){
//     nodes[k].checkKeyPress();
//   }
// }

function keyPressed() {
  for (n of currentMindMap.nodes) {
    checkKeyPress(n.index);
  }
}



// function displaynodes(px, py) {
//   console.log("displayNodes() is being run...");
//   stroke(51);
//   strokeWeight(4);
//   //scale(mouseX / 400, mouseY / 400);
//     for (i=0; i<=numnodes-1; i++){
//       strokeWeight(2);
//       rect(nodes[i].n.x_pos, nodes[i].n.y_pos, nodes[i].n.width, nodes[i].n.height, nodes[i].n.round_amt,nodes[i].n.round_amt,nodes[i].n.round_amt,nodes[i].n.round_amt, nodes[i].n.grabbed);
//       if(nodes[i].n.grabbed) {
//       // Movement
//         console.log("grabbed");
//         nodes[i].n.x_pos = px + nodes[i].n.offsetX;
//         nodes[i].n.y_pos = py + nodes[i].n.offsetY;
//         nodeInput.position(px + nodes[i].n.offsetX+50, py + nodes[i].n.offsetY+125);
//       }
//       nodes[i].writeNode();

//   }
// }

function displaynodes(px, py) {
  //console.log("displayNodes2() is being run...");
  stroke(51);
  strokeWeight(4);
  //scale(mouseX / 400, mouseY / 400);
    for (n of currentMindMap.nodes){
      strokeWeight(2);
      rect(n.x_pos, n.y_pos, n.width, n.height, n.round_amt,n.round_amt,n.round_amt,n.round_amt, n.grabbed);
      if(n.grabbed) {
      // Movement
        //console.log("grabbed");
        n.x_pos = px + n.offsetX;
        n.y_pos = py + n.offsetY;
        nodeInput.position(px + n.offsetX+50, py + n.offsetY+125);
      }
      writeNode(n.index);

  }
}

//   function drawEdges(){
//   if (edges.length > 0){
//     strokeWeight(4);
//     for (j=0; j<edges.length; j++)
//     {
//       var sx = nodes[edges[j].source].n.x_pos + nodes[edges[j].source].n.width;
//       var sy = nodes[edges[j].source].n.y_pos + 50;
//       var tx = nodes[edges[j].target].n.x_pos;
//       var ty = nodes[edges[j].target].n.y_pos + 50;
//       line(sx,sy,tx,ty);
//     }
//   }
// }

function drawEdges(){
  strokeWeight(4);
  for (e of currentMindMap.edges)
  {
    var sx = currentMindMap.nodes[getIndexFromID(e.source)].x_pos + currentMindMap.nodes[getIndexFromID(e.source)].width;
    var sy = currentMindMap.nodes[getIndexFromID(e.source)].y_pos + 50;
    var tx = currentMindMap.nodes[getIndexFromID(e.target)].x_pos;
    var ty = currentMindMap.nodes[getIndexFromID(e.target)].y_pos + 50;
    line(sx,sy,tx,ty);
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
  
  //for (i = 0; i < nodes.length; i++) g.nodes.push(nodes[i].n);
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
//nodeReplaceList is a list of JS objects with nodeIndex1, and nodeIndex2 attributes where nodeIndex1 is the 
//     merged node in graph1 and nodeIndex2 is the merge node in graph2
function mergeMaps(graph1, graph2, nodeReplaceList)
{

   //add all graph2 nodes EXCEPT those in nodeReplaceList.nodeIndex2
   graph1.nodes.push(...graph2.nodes.filter(n => !nodeReplaceList.some(item => item.nodeIndex2 === n.index)))

  //add all edges from graph2 to graph1
  graph1.edges.push(...graph2.edges)

  for (item of nodeReplaceList) {
    if (graph1.nodes[item.nodeIndex1].text != graph2.nodes[item.nodeIndex2].text)
    {
      graph1.nodes[item.nodeIndex1].text += "/" + graph2.nodes[item.nodeIndex2].text;
    }

    //! the new edges now in graph1 from and to graph2.nodes[nodeIndex2] need to point to graph1.nodes[nodeIndex1]
    for(i = 0; i < graph1.edges.length; i++)
    {
      //find and replace old node in the SOURCE
      if (graph1.edges[i].source == graph2.nodes[item.nodeIndex2].index)
      {
        graph1.edges[i].source = graph1.nodes[item.nodeIndex1].index;
      }
      //find and replace the old node in TARGET
      if (graph1.edges[i].target == graph2.nodes[item.nodeIndex2].index)
      {
        graph1.edges[i].target = graph1.nodes[item.nodeIndex1].index;
      }
    }
  }
  
    

  return graph1;
}

//using NLP find similar spellings of words using levenstein distance
//using NLP search for synonyms in other nodes

////

////
///
///
///
///
    
      //https://www.npmjs.com/package/keyword-extractor
//keyword extraction takes the important words out of sentences
function getKeywords(s){​
  s.toLowerCase;
  var keyword_extractor = require("keyword-extractor");
  var extraction_result = keyword_extractor.extract(s,{​
    language:"english",
    remove_digits: true,
    return_changed_case:true,
    remove_duplicates: false
}​);
  return extraction_result;
}​
//finds which nodes to merge by seeing which nodes share exact words/synonyms from a the keywords found in their text
function mergeByKeywords(graph1, graph2){​
  n1Keywords = graph1.nodes.map( function(n){​
    var k = {​"index": n.index, "keywords" : getKeywords(n.text)}​
    return k;
  }​);
  n2Keywords = graph2.nodes.map( function(n){​
    var k = {​"index": n.index, "keywords" : getKeywords(n.text)}​
    return k;
  }​);
  //make and the replacement list of ID 'tuples'
  replacementList = [];
  for(n1 of n1Keywords){​
    for(n2 of n2Keywords){​
      n1.keywords.map( function(s){​
        if (n2.keywords.includes(s)){​
          replacementList.push({​nodeIndex1: n1.index, nodeIndex2: n2.index}​) ;
        }​
      }​);
    }​
  }​
  return [...new Set(replacementList)];
}​
//merge nodes and edges 
//graph1 and graph 2 are different JSON graphs
//nodeReplaceList is a list of JS objects with nodeIndex1, and nodeIndex2 attributes where nodeIndex1 is the 
//     merged node in graph1 and nodeIndex2 is the merge node in graph2
function mergeMaps(graph1, graph2, nodeReplaceList)
{​
  if (graph2.nodes == []) return graph1;
  nodeReplaceList = [...new Set(mergeByKeywords(graph1, graph2))];
  console.log(nodeReplaceList);
  //add all graph2 nodes EXCEPT those in nodeReplaceList.nodeIndex2
  graph1.nodes.push(...graph2.nodes.filter(n => !nodeReplaceList.some(item => item.nodeIndex2 === n.index)))
  //add all edges from graph2 to graph1
  graph1.edges.push(...graph2.edges)
  for (item of nodeReplaceList) {​
    if (graph1.nodes[getIndexFromID2(graph1, item.nodeIndex1)].text.split('/')[0].toLowerCase != graph2.nodes[getIndexFromID2(graph2, item.nodeIndex2)].text.toLowerCase)
    {​
      graph1.nodes[item.nodeIndex1].text += "/" + graph2.nodes[item.nodeIndex2].text;
    }​
    //! the new edges now in graph1 from and to graph2.nodes[nodeIndex2] need to point to graph1.nodes[nodeIndex1]
    for(i = 0; i < graph1.edges.length; i++)
    {​
      //find and replace old node in the SOURCE
      if (graph1.edges[i].source == graph2.nodes[getIndexFromID2(graph2, item.nodeIndex2)].index)
      {​
        graph1.edges[i].source = graph1.nodes[getIndexFromID2(graph1, item.nodeIndex1)].index;
      }​
      //find and replace the old node in TARGET
      if (graph1.edges[i].target == graph2.nodes[getIndexFromID2(graph2, item.nodeIndex2)].index)
      {​
        graph1.edges[i].target = graph1.nodes[getIndexFromID2(graph1, item.nodeIndex1)].index;
      }​
    }​
  }​
  return graph1;
}​
//combines any number of JSON graphs in a list
// accumulator stores the combining map
// currentValue is the next map to be combined
// reduce() mergers maps down the list until they have been reduced to 1 map
function mergeListOfMaps(mapList){​
  const merger = (accumulator, currentValue) => mergeMaps(accumulator, currentValue);
  return mapList.reduce(merger);
  //return mapList.reduce(merger, createGraphJSON());
}​
//gets the index of the node for reference with the list
function getIndexFromID2(graph,id){​
  return graph.nodes.findIndex(n => n.index === id);
}​
function getNewID2(graph){​
  do {​
    id = graph.label.concat(String(Math.floor(1000 + Math.random() * 9000)));
  }​ while (graph.nodes.some(n => n.index === id));
  return id;
}​
//generates random number of graphs and uses the list of words in nodeTextList to assign words to nodes
//Usage: testMergeGraphs(["happy", "excited"],3) will generate 3 graphs with 2-5 nodes which have the words "happy" or "excited"
function testMergeGraphs(nodeTextList,num){​
  var graphList = [];
  //create random graphs
  for(i=0; i < num; i++){​
    tempG = createGraphJSON(i + "testGraph");
    //generate a random number of nodes 
    // randomly generated 2 <= N <= 5,  length array 0 <= A[N] < nodeTextList.length()
    wordIndexList = Array.from({​length: 2+Math.floor(Math.random() * 4)}​, () => Math.floor(Math.random() * (nodeTextList.length)));
    //create nodes
    for(wIndex in wordIndexList){​
      tempG.nodes.push(createNodeJSON(0,0,0,0,0,0,0,0,0,getNewID2(tempG)));
      tempG.nodes[wIndex].text = nodeTextList[wordIndexList[wIndex]];
    }​
    //createEdges
    tempG.edges.push(createEdgeJSON(tempG.nodes[0].index, tempG.nodes[1].index));
    graphList.push(tempG);
  }​
  mergeResult = mergeListOfMaps(graphList);
  console.log(mergeResult);
  return mergeResult;
}​
//graphNodeText is a list of lists of words, each list of words will become a graph
//Usage: testMergeGraphs2([["clean"],["dirty"]]) merges 2 graphs, one with 1 node called "clean" and another graph with 1 noce called "dirty"
function testMergeGraphs2(graphNodeText){​
  graphList = [];
  i = 0;
  for (gTexts of graphNodeText){​
    tempG = createGraphJSON(i + "testGraph");
    for (nText in gTexts){​
      tempG.nodes.push(createNodeJSON(0,0,0,0,0,0,0,0,0,getNewID2(tempG)));
      tempG.nodes[nText].text = gTexts[nText];
    }​
    i++;
    //add edges
    if(tempG.nodes.length >= 2){​
      tempG.edges.push(createEdgeJSON(tempG.nodes[0].index, tempG.nodes[1].index));
    }​
    graphList.push(tempG);
  }​
  mergeResult = mergeListOfMaps(graphList);
  console.log(mergeResult);
  return mergeResult;
}​
testMergeGraphs2([["I hope this works","happy"],["ignorant","fear","tpyo"],["happy","last"]]);
//testMergeGraphs2([["happy","sad"],["happy"]]);
//testMergeGraphs(["happy","sad","excited","fear"]);
//https://www.npmjs.com/package/fast-levenshtein
//Input: String that's searched
//return nodeID and text
function searchWithinMap(graph, s){​
  var threshold_distance = 2; //maximum distance to return a result
  var levenshtein = require('fast-levenshtein');
  var result = [];
  for(n of graph.nodes){​
    keywords = getKeywords(n.text)
    for (k in keyword){​
      if (levenshtein.get(s, k) <= threshold_distance){​
        result.push({​index: n.index, similarWord: k}​)
      }​
    }​
  }​
  return result;
}​