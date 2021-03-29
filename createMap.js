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

// if (localStorage.getItem("key") != null) current_key = localStorage.getItem("key");
// //else window.location = "http://127.0.0.1:5501/allMindMaps.html";
// console.log("current_key: " + current_key);

//   // Your web app's Firebase configuration
// var firebaseConfig = {
//   apiKey: "AIzaSyCJuTDil5mz0rsHrmBTlKSh0nPstEbwd3s",
//   authDomain: "mind-barf-e6745.firebaseapp.com",
//   databaseURL: "https://mind-barf-e6745-default-rtdb.firebaseio.com",
//   projectId: "mind-barf-e6745",
//   storageBucket: "mind-barf-e6745.appspot.com",
//   messagingSenderId: "339425742596",
//   appId: "1:339425742596:web:953a7a9ea744d52197ca51"
// };
//   // Initialize Firebase
//   firebase.initializeApp(firebaseConfig);
//   var ref = firebase.database().ref("Graphs");
//   database = firebase.database();
//   ref.on('value', gotData, errData);
//   currentMindMap = createGraphJSON("testGraph");
//     //console.log("The Starting MindMap is: ");
//     //console.log(currentMindMap); 
//   if (window.location == "http://127.0.0.1:5501/test.html") showMindMap();

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

function addNode(){
  newNode = createNodeJSON(200+(currentMindMap.nodes.length*100),200,200,100,50,false, false, false, false,getNewID());
  currentMindMap.nodes.push(newNode);
  selectedID = newNode.index;
  console.log("Node added, here's the JSON of currentMindMap")
  console.log(currentMindMap);
  redraw();
}

function saveMindMap() {
  //var g = createGraphJSON("testGraph");
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
  for (var i = 0; i< keys.length; i++) {
    // Creating each mindmap in the html from the database that we can click on and open to edit
    var key = keys[i];
    var li = createElement('li', ''); 
    var ahref = createA('#', key);
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
  }

function showMindMap() {
  console.log("Running showMindMap...");
  console.log(currentMindMap);
  //min = this.html();
  if (window.location.href != "http://127.0.0.1:5501/test.html")
  {
    console.log("NOT TEST.HTML");
    localStorage.setItem("key", this.html());
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
    if (DBmindMap != null) {
      currentMindMap = DBmindMap;
      if(currentMindMap.edges == null){
        currentMindMaps["edges"] = [];
      }
      if(currentMindMap.nodes == null){
        currentMindMaps["nodes"] = [];
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
    if (graph1.nodes[item.nodeIndex1].text.split('/')[0].toLowerCase() != graph2.nodes[item.nodeIndex2].text.toLowerCase())
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

//https://www.npmjs.com/package/keyword-extractor
//keyword extraction takes the important words out of sentences
function getKeywords(s){
  var keyword_extractor = require("keyword-extractor");
  var extraction_result = keyword_extractor.extract(s,{
    language:"english",
    remove_digits: true,
    return_changed_case:true,
    remove_duplicates: false
});

  return extraction_result;
}

//https://www.npmjs.com/package/fast-levenshtein
//using NLP find similar spellings of words using levenshtein distance
//where we will merge graph2 INTO graph1 and point edges of merge nodes to the graph1 node
//Output: a list of ID pairs for node merges to make from graph2 into graph1
function getLevenCloseNodes(graph1, graph2){
  var threshold_distance = 2; //any text distance <= this number will result in the nodes merging
  var d;
  var mergeList = [];
  for (n1 of graph1.nodes){
    for (n2 of graph2.nodes){
      //get levenshtein distance
      //d = leven_distance(n1.text, n2. text);
      if (d <= threshold_distance){
        mergeList.push({"nodeIndex1": n1.index, "nodeIndex2": n2.index})
      }
    }
  }

  //return an ID pair list of nodes to merge
  return mergeList;
}

//https://progur.com/2016/12/how-to-use-wordnet-in-nodejs-applications.html
//using WordNet search for synonyms in other nodes
//will accept a string but only return synonyms of the FIRST WORD
function getSynonyms(s){
  var syns = "";
  const natural = require('natural');
  const wordnet = new natural.WordNet();  

  wordnet.lookup(s.split(/[^A-Za-z]/)[0], function(details) {
    syns = details[0].synonyms; //ASSIGNMENT DOESN'T HAPPEN OUTSIDE OF SCOPR WHY?????
    console.log("Synonyms: " + details[0].synonyms);
  });
  
  return syns; // returns "" from Line 806 assignment
}


function mergeBySynonoms(graph1, graph2){ //this isn't pretty, make pretty
  var mergeList = [];
  var keywords = [];
  for (n1 of graph1.nodes){
    //get keyword(s)
    for (keyword of getKeywords(n1.text)){
      //get synonyms
      for(syn of getSynonyms(keyword)){
        for (n2 of graph2.nodes){
          //get keywords of graph2.nodes.text
          //compare keywords1 and keywords 2
          }
        }
      }
    }
  }
}

//HOW TO COMBINE? BY KEYWORD? BY SYNONYM? BY LEVENSHTEIN? WHAT ORDER?

// keywords then synonoms of keywords (toLowerCase())
//levenshtein can be used with Search bar