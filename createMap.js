
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
var j;
let px, py;
var inputXVal = 100;
var inputYVal = 40;
// Creates the canvas

var nodeInput;

var source = "";
var target = "";

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


  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var ref = firebase.database().ref("Graphs");
  database = firebase.database();
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
  if (window.location == "http://127.0.0.1:5501/test.html") showMindMap();

  //showMindMap();
  //nodes = currentMindMap.nodes;

  
//   //inputs.push(node1.inp);


//   draw();


//   //for(j=0; j<=numg.nodes; j++){
//   //  node[j] = new Node(200+(j*20),200,200,100,false);
//   //  }

// }
var combinedMapMade = false;

// createNewMindMap Function directs the user to a new blank canvas to create a new mindmap 
function createNewMindMap() {
  localStorage.removeItem("key");
  if (window.location.href == "http://127.0.0.1:5501/test.html") {
      location.reload();
  }
  else
  {
    window.location = "http://127.0.0.1:5501/test.html"
  }
}

// addNode function pushes a new node to currentMindMap
function addNode(){
  newNode = createNodeJSON(200,200,200,100,50,false, false, false, false,getNewID());
  currentMindMap.nodes.push(newNode);
  selectedID = newNode.index;
  console.log("Node added, here's the JSON of currentMindMap")
  console.log(currentMindMap);
  redraw();
}

/* saveMindMap function: 
 When the mindmap is an existing mindmap the system would be able to override 
 the exisiting mindmap by saving what the user edited on the mindmap to the firebase database.
 However if the mindmap is new, then the save funciton would save the same way as the saveAs function */

function saveMindMap() {
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

/* saveAs function: 
 When saving a new mindmap, the function will create a new key
 for it and save it to the firebase realtime database */

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

/* datasent function: 
 If there is an error then when you inspect the website 
 the user would see the error that appeared */

function dataSent(error, status) {
  console.log("dataSent(error, status): status = " + status);
}

/* gotData function: 
 This function is getting the mindmap key data from firebase 
 and displaying it on the allMindmaps.html file for the users to see when they view all of their mindmap */

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
    if (window.location == "http://127.0.0.1:5501/allMindmaps.html") 
    {
    var key = keys[i];
    current_key = keys[i];
    localStorage.setItem("key", current_key);
    var li = createElement('li', ''); 
    current_label = mindMaps[key].label;
    var ahref = createA('#', current_label);
    ahref.style('text-decoration: none');
    ahref.style('padding: 2rem');
    ahref.style('text-align: center');
    ahref.mousePressed(showMindMap);
    console.log("window.location : ");
    console.log(window.location.href);
      console.log("PARENT ~~~~");
      ahref.parent(li);
      li.parent('mindmapList');
    }
    else
    {
      console.log("NOT PARENT ~~~");
    }
  }
    localStorage.setItem("key", old_key);
  }

/*showMindMap Function: 
 When the user click on the title of their saved mind map on the view all mindmap (allMindmaps.html) page,
 the system would be triggered to redirect the user to the respective mind map
 From there you can edit and save the mind map however you please to do so. */

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
        currentMindMap.nodes = [];
      }
    }
    console.log("currentMindMap = DBmindmap: ");
    console.log(currentMindMap);

    console.log("Mindmap has been changed to: ");
    console.log(currentMindMap);
  }
  //if (window.location != "http://127.0.0.1:5501/test.html") window.location = "test.html";
  
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

/* errData Function: prints the error that might appears*/

function errData(err) {
  console.log(err);
}

/*getAllMindMaps Function:
 */
var mindMap_objects = [];

function getAllMindMaps(data)
{
  var mindMaps = data.val();
  if (mindMaps == null) 
  {
    keys = []
  }
  else
  {
    keys = Object.keys(mindMaps);
  }
  
  for (i = 0; i < keys.length; ++i)
  {
    console.log("keys[i] = ");
    console.log(keys[i]);
    var m_ref = database.ref('Graphs/' + keys[i]);
    console.log("m_ref: ");
    console.log(m_ref);
  
    m_ref.once('value', getOneMindMap, errData);

    function getOneMindMap(data) {
      var DBmindMap = data.val();
      console.log("DBmindMap in getOneMindMap: ");
      console.log(DBmindMap);
      mindMap_objects.push(DBmindMap);
    }
  }
  //mindMap_objects = mindMap_objects[0];
  if (window.location == "http://127.0.0.1:5501/allMindmaps.html")
  {
    console.log("mindMap_objects: ");
    for (i = 0; i < mindMap_objects.length; ++i)
    {
      console.log(mindMap_objects[i]);
      
      if (mindMap_objects[i].nodes == null)
      {
        mindMap_objects[i].nodes = [];
      }
      if (mindMap_objects[i].edges == null)
      {
        mindMap_objects[i].edges = [];
      }
      
    }
    //test = mergeListOfMaps([createGraphJSON("test"), createGraphJSON("test2")]);
    test = mergeListOfMaps(mindMap_objects);
    console.log("mergeListOfMaps(test) = ");
    console.log(test);
    //e = testMergeGraphs(["happy", "excited"],3);
    currentMindMap = test;
    console.log("testMergeGraphs: ");
    //console.log(e);
    combinedMapMade = true;
  }
}


//button function called from Add Edge Button
function addEdge(){
  if(currentMindMap.nodes.length >= 2){ 
  connectCounter = 1; // this means the next 2 clicks will link those nodes
  }
}

// setting up the basic blank canvas for the users

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  background(66, 135, 245);

  nodeInput = createInput('');
  nodeInput.size(110,40);
  nodeInput.style('font-size', '24px');
}

//gets the text from the input box and stores it in the selected node
function textFromBox() {
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


//function to delete the node
function deleteNode() {
  if (currentMindMap.nodes != [])
  {
    currentMindMap.nodes.splice(getIndexFromID(selectedID) ,1);

    //also delete edges
    //nodeToDelete is the index or the ID of the node to delete
    currentMindMap.edges = currentMindMap.edges.filter(e => (e.source === nodeToDelete || e.target === nodeToDelete));
  }
}
/* The draw function will continuously execute, 
this will create a constant background, 
allows us to display nodes, and update node input
*/
function draw(){
  clear();
  background(255, 255, 255); //white BG
  
  textAlign(CENTER);
  
  drawEdges();
  displaynodes(mouseX, mouseY);
  nodeInput.changed(textFromBox);
  if (!combinedMapMade)
  {
    console.log("window.location: " + window.location);
    if (window.location == "http://127.0.0.1:5501/allMindmaps.html")
    {
      console.log("PASSED");
      ref.on('value', getAllMindMaps, errData);
    }
  }
  console.log("currentMindMap: " + currentMindMap.label);
}

//gets the index of the node for reference with the list
function getIndexFromID(id){
  return currentMindMap.nodes.findIndex(n => n.index === id);
}

//unique id assignment for nodes
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

//ran when mousePressed() is called
//checks all nodes to see if clicked
function checkClicked(px, py){
  for (n of currentMindMap.nodes) {
      id = n.index; 
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
      nodeInput.position(currentMindMap.nodes[getIndexFromID(id)].x_pos + 20, currentMindMap.nodes[getIndexFromID(id)].y_pos);
      break;
    }
  }
}

//ran when doubleClick() is called
//checks all nodes to see if double clicked
function checkDoubleClick(px, py, id){
  if ((px > currentMindMap.nodes[getIndexFromID(id)].x_pos && px < (currentMindMap.nodes[getIndexFromID(id)].x_pos + currentMindMap.nodes[getIndexFromID(id)].width)) && ((py > currentMindMap.nodes[getIndexFromID(id)].y_pos) && py < (currentMindMap.nodes[getIndexFromID(id)].y_pos + currentMindMap.nodes[getIndexFromID(id)].height))) {
  console.log('double click');
  currentMindMap.nodes[getIndexFromID(id)].resizeDC = !currentMindMap.nodes[getIndexFromID(id)].resizeDC;
  }
}
/* The checkKeyPress function will continuously run in the background
the function will then listen for keyboard inputs
as we only want to listen for keypressed once a node has been double clicked,
we have an if statement that confirms the node has been double clicked
*/

function checkKeyPress(id) {
  if (currentMindMap.nodes[getIndexFromID(id)].resizeDC) {
    //initial check allows users to delete a node at anytime while editing the node
    if(keyCode == DELETE){
      delete currentMindMap.nodes[getIndexFromID(id)];
    }

    //cases for moving nodes using arrow keys
    if (keyCode == RIGHT_ARROW) {
      currentMindMap.nodes[getIndexFromID(id)].width += 10;
      inputXVal = currentMindMap.nodes[getIndexFromID(id)].width - 90;
      
    }
    else if (keyCode == LEFT_ARROW) {
      if (currentMindMap.nodes[getIndexFromID(id)].width < 200){
        
      }
      else{
        currentMindMap.nodes[getIndexFromID(id)].width -= 10;
      }
      inputXVal = currentMindMap.nodes[getIndexFromID(id)].width - 90;
    }

    else if (keyCode == DOWN_ARROW) {
      currentMindMap.nodes[getIndexFromID(id)].height += 10;
      inputYVal = currentMindMap.nodes[getIndexFromID(id)].height - 40;
    }
    else if (keyCode == UP_ARROW) {
      if(currentMindMap.nodes[getIndexFromID(id)].height < 100){

      }
      else{
        currentMindMap.nodes[getIndexFromID(id)].height -= 10;
      }
      inputYVal = currentMindMap.nodes[getIndexFromID(id)].height - 40;
    }
    //end moving nodes using arrow keys
  }

}

//deselects all nodes
function deSelectAllNodes()
{
  for (n of currentMindMap.nodes) {
    n.select = false;
  }
}

//runs every time mouse is pressed
function mousePressed(){
  
  //for (n of currentMindMap.nodes) { //check all ndoes to see if they are clicked
  //  checkClicked(mouseX, mouseY, n.index);
  //}
  checkClicked(mouseX, mouseY);

  if(connectCounter == 1){ //used for connecting nodes
    source = selectedID; //store this clicked node as the source for connecting
    console.log("connectCounter is 1");
    connectCounter = connectCounter + 1;
  }
  if(connectCounter == 2){ //used for connecting nodes
    if(source != selectedID){
      target = selectedID; //store this clicked node as the target for connecting (as long as it's not the source)
      
      //add the edges to the graph/map
      if(!(currentMindMap.edges.includes(createEdgeJSON(source, target)) || currentMindMap.edges.includes(createEdgeJSON(target,source)))){
        currentMindMap.edges.push(createEdgeJSON(source, target));
        console.log("connectCounter is 2");
      }
      connectCounter = 0;
    }
  }
  
}

//runs every time mouse is released
function mouseReleased(){
  //"releases" all nodes from selection
  for (n of currentMindMap.nodes) {
    n.grabbed = false;
  }
}

//runs every time a double click is registered
function doubleClicked(){
  //checks if a node at mouseX,mouseY is double clicked
  for (n of currentMindMap.nodes) {
    checkDoubleClick(mouseX, mouseY, n.index);
  }
}

//runs every time a key is pressed
function keyPressed() {
  //check each node to see if it's selected
  for (n of currentMindMap.nodes) {
    checkKeyPress(n.index);
  }
}


//displays all nodes and there text
function displaynodes(px, py) {
  stroke(51);
  strokeWeight(4);
  //scale(mouseX / 400, mouseY / 400);
    for (n of currentMindMap.nodes){
      strokeWeight(2);
      rect(n.x_pos, n.y_pos, n.width, n.height, n.round_amt,n.round_amt,n.round_amt,n.round_amt, n.grabbed);
      if(n.grabbed) {
      // Movement
        n.x_pos = px + n.offsetX;
        n.y_pos = py + n.offsetY;
        nodeInput.position(px + n.offsetX+50, py + n.offsetY+125);
      }
      writeNode(n.index);

  }
}

//draws lines from source to target nodes
function drawEdges(){
  strokeWeight(4);
  for (e of currentMindMap.edges)
  {
    var sx = currentMindMap.nodes[getIndexFromID(e.source)].x_pos + (currentMindMap.nodes[getIndexFromID(e.source)].width / 2);
    var sy = currentMindMap.nodes[getIndexFromID(e.source)].y_pos + 50;
    var tx = currentMindMap.nodes[getIndexFromID(e.target)].x_pos;
    var ty = currentMindMap.nodes[getIndexFromID(e.target)].y_pos + 50;
    line(sx,sy,tx,ty);
  }
}


//create an empty graph JSON object
function createGraphJSON(title)
{
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


//taken from https://github.com/mirzaasif/JS-StopWord/blob/master/StopWord.js
var stopWords = "a,able,about,above,abst,accordance,according,accordingly,across,act,actually,added,adj,\
affected,affecting,affects,after,afterwards,again,against,ah,all,almost,alone,along,already,also,although,\
always,am,among,amongst,an,and,announce,another,any,anybody,anyhow,anymore,anyone,anything,anyway,anyways,\
anywhere,apparently,approximately,are,aren,arent,arise,around,as,aside,ask,asking,at,auth,available,away,awfully,\
b,back,be,became,because,become,becomes,becoming,been,before,beforehand,begin,beginning,beginnings,begins,behind,\
being,believe,below,beside,besides,between,beyond,biol,both,brief,briefly,but,by,c,ca,came,can,cannot,can't,cause,causes,\
certain,certainly,co,com,come,comes,contain,containing,contains,could,couldnt,d,date,did,didn't,different,do,does,doesn't,\
doing,done,don't,down,downwards,due,during,e,each,ed,edu,effect,eg,eight,eighty,either,else,elsewhere,end,ending,enough,\
especially,et,et-al,etc,even,ever,every,everybody,everyone,everything,everywhere,ex,except,f,far,few,ff,fifth,first,five,fix,\
followed,following,follows,for,former,formerly,forth,found,four,from,further,furthermore,g,gave,get,gets,getting,give,given,gives,\
giving,go,goes,gone,got,gotten,h,had,happens,hardly,has,hasn't,have,haven't,having,he,hed,hence,her,here,hereafter,hereby,herein,\
heres,hereupon,hers,herself,hes,hi,hid,him,himself,his,hither,home,how,howbeit,however,hundred,i,id,ie,if,i'll,im,immediate,\
immediately,importance,important,in,inc,indeed,index,information,instead,into,invention,inward,is,isn't,it,itd,it'll,its,itself,\
i've,j,just,k,keep,keeps,kept,kg,km,know,known,knows,l,largely,last,lately,later,latter,latterly,least,less,lest,let,lets,like,\
liked,likely,line,little,'ll,look,looking,looks,ltd,m,made,mainly,make,makes,many,may,maybe,me,mean,means,meantime,meanwhile,\
merely,mg,might,million,miss,ml,more,moreover,most,mostly,mr,mrs,much,mug,must,my,myself,n,na,name,namely,nay,nd,near,nearly,\
necessarily,necessary,need,needs,neither,never,nevertheless,new,next,nine,ninety,no,nobody,non,none,nonetheless,noone,nor,\
normally,nos,not,noted,nothing,now,nowhere,o,obtain,obtained,obviously,of,off,often,oh,ok,okay,old,omitted,on,once,one,ones,\
only,onto,or,ord,other,others,otherwise,ought,our,ours,ourselves,out,outside,over,overall,owing,own,p,page,pages,part,\
particular,particularly,past,per,perhaps,placed,please,plus,poorly,possible,possibly,potentially,pp,predominantly,present,\
previously,primarily,probably,promptly,proud,provides,put,q,que,quickly,quite,qv,r,ran,rather,rd,re,readily,really,recent,\
recently,ref,refs,regarding,regardless,regards,related,relatively,research,respectively,resulted,resulting,results,right,run,s,\
said,same,saw,say,saying,says,sec,section,see,seeing,seem,seemed,seeming,seems,seen,self,selves,sent,seven,several,shall,she,shed,\
she'll,shes,should,shouldn't,show,showed,shown,showns,shows,significant,significantly,similar,similarly,since,six,slightly,so,\
some,somebody,somehow,someone,somethan,something,sometime,sometimes,somewhat,somewhere,soon,sorry,specifically,specified,specify,\
specifying,still,stop,strongly,sub,substantially,successfully,such,sufficiently,suggest,sup,sure,t,take,taken,taking,tell,tends,\
th,than,thank,thanks,thanx,that,that'll,thats,that've,the,their,theirs,them,themselves,then,thence,there,thereafter,thereby,\
thered,therefore,therein,there'll,thereof,therere,theres,thereto,thereupon,there've,these,they,theyd,they'll,theyre,they've,\
think,this,those,thou,though,thoughh,thousand,throug,through,throughout,thru,thus,til,tip,to,together,too,took,toward,towards,\
tried,tries,truly,try,trying,ts,twice,two,u,un,under,unfortunately,unless,unlike,unlikely,until,unto,up,upon,ups,us,use,used,\
useful,usefully,usefulness,uses,using,usually,v,value,various,'ve,very,via,viz,vol,vols,vs,w,want,wants,was,wasn't,way,we,wed,\
welcome,we'll,went,were,weren't,we've,what,whatever,what'll,whats,when,whence,whenever,where,whereafter,whereas,whereby,wherein,\
wheres,whereupon,wherever,whether,which,while,whim,whither,who,whod,whoever,whole,who'll,whom,whomever,whos,whose,why,widely,\
willing,wish,with,within,without,won't,words,world,would,wouldn't,www,x,y,yes,yet,you,youd,you'll,your,youre,yours,yourself,\
yourselves,you've,z,zero";
//end of  https://github.com/mirzaasif/JS-StopWord/blob/master/StopWord.js
var sw = stopWords.split(",");

 function getKeywords(s){
   s.toLowerCase;
   extraction_result = s.split(' ').filter(word => !sw.some(s2 => s2 === word));
   
   return extraction_result;
 }


//finds which nodes to merge by seeing which nodes share exact words/synonyms from a the keywords found in their text
function mergeByKeywords(graph1, graph2){
  console.log("graph 1: ");
  console.log(graph1);
  console.log("graph 2: ");
  console.log(graph2);
  n1Keywords = graph1.nodes.map( function(n){
    var k = {"index": n.index, "keywords" : getKeywords(n.text)}
    return k;
  });
  n2Keywords = graph2.nodes.map( function(n){
    var k = {"index": n.index, "keywords" : getKeywords(n.text)}
    return k;
  });
  //make and the replacement list of ID 'tuples'
  replacementList = [];
  for(n1 of n1Keywords){
    for(n2 of n2Keywords){
      n1.keywords.map( function(s){
        if (n2.keywords.includes(s)){
          replacementList.push({nodeIndex1: n1.index, nodeIndex2: n2.index}) ;
        }
      });
    }
  }
  return [...new Set(replacementList)];
}


//merge nodes and edges 
//graph1 and graph 2 are different JSON graphs
//nodeReplaceList is a list of JS objects with nodeIndex1, and nodeIndex2 attributes where nodeIndex1 is the 
//     merged node in graph1 and nodeIndex2 is the merge node in graph2
function mergeMaps(graph1, graph2, nodeReplaceList)
{
  console.log("MERGEMAPS");
  console.log(graph1);
  console.log(graph2);
  console.log(nodeReplaceList);
  console.log("~~~~~");
  if (graph2.nodes == []) return graph1;
  nodeReplaceList = [...new Set(mergeByKeywords(graph1, graph2))];
  console.log(nodeReplaceList);
  //add all graph2 nodes EXCEPT those in nodeReplaceList.nodeIndex2
  graph1.nodes.push(...graph2.nodes.filter(n => !nodeReplaceList.some(item => item.nodeIndex2 === n.index)))
  //add all edges from graph2 to graph1
  graph1.edges.push(...graph2.edges)
  for (item of nodeReplaceList) {
    if (graph1.nodes[getIndexFromID2(graph1, item.nodeIndex1)].text.toLowerCase != graph2.nodes[getIndexFromID2(graph2, item.nodeIndex2)].text.toLowerCase)
    {
      graph1.nodes[item.nodeIndex1].text.concat("/" + graph2.nodes[item.nodeIndex2].text);
    }
    //! the new edges now in graph1 from and to graph2.nodes[nodeIndex2] need to point to graph1.nodes[nodeIndex1]
    for(i = 0; i < graph1.edges.length; i++)
    {
      //find and replace old node in the SOURCE
      if (graph1.edges[i].source == graph2.nodes[getIndexFromID2(graph2, item.nodeIndex2)].index)
      {
        graph1.edges[i].source = graph1.nodes[getIndexFromID2(graph1, item.nodeIndex1)].index;
      }
      //find and replace the old node in TARGET
      if (graph1.edges[i].target == graph2.nodes[getIndexFromID2(graph2, item.nodeIndex2)].index)
      {
        graph1.edges[i].target = graph1.nodes[getIndexFromID2(graph1, item.nodeIndex1)].index;
      }
    }
  }
  
  return graph1;
}


//combines any number of JSON graphs in a list
// accumulator stores the combining map
// currentValue is the next map to be combined
// reduce() mergers maps down the list until they have been reduced to 1 map
function mergeListOfMaps(mapList){
  console.log("MERGELISTOFMAPS")
  console.log("mapList______: ");
  console.log(mapList[0]);
  console.log("~~~~~~~~~~~~~~~~~");
  const merger = (accumulator, currentValue) => mergeMaps(accumulator, currentValue);
  return mapList.reduce(merger);
  //return mapList.reduce(merger, createGraphJSON());
}
//gets the index of the node for reference with the list
function getIndexFromID2(graph,id){
  return graph.nodes.findIndex(n => n.index === id);
}
function getNewID2(graph){
  do {
    id = graph.label.concat(String(Math.floor(1000 + Math.random() * 9000)));
  } while (graph.nodes.some(n => n.index === id));
  return id;
}


//generates random number of graphs and uses the list of words in nodeTextList to assign words to nodes
//Usage: testMergeGraphs(["happy", "excited"],3) will generate 3 graphs with 2-5 nodes which have the words "happy" or "excited"
function testMergeGraphs(nodeTextList,num){
  var graphList = [];
  //create random graphs
  for(i=0; i < num; i++){
    tempG = createGraphJSON(i + "testGraph");
    //generate a random number of nodes 
    // randomly generated 2 <= N <= 5,  length array 0 <= A[N] < nodeTextList.length()
    wordIndexList = Array.from({length: 2+Math.floor(Math.random() * 4)}, () => Math.floor(Math.random() * (nodeTextList.length)));
    
    //create nodes
    for(wIndex in wordIndexList){
      tempG.nodes.push(createNodeJSON(200,200,200,100,50,false, false, false, false,getNewID2(tempG)));
      tempG.nodes[wIndex].text = nodeTextList[wordIndexList[wIndex]];
      tempG.nodes[wIndex].x_pos = Math.floor(Math.random() * 1000);
      tempG.nodes[wIndex].y_pos = Math.floor(Math.random() * 500);
    }
    //createEdges
    tempG.edges.push(createEdgeJSON(tempG.nodes[0].index, tempG.nodes[1].index));
    graphList.push(tempG);
  }
  
  mergeResult = mergeListOfMaps(graphList);
  console.log(mergeResult);
  return mergeResult;
}


//graphNodeText is a list of lists of words, each list of words will become a graph
//Usage: testMergeGraphs2([["clean"],["dirty"]]) merges 2 graphs, one with 1 node called "clean" and another graph with 1 noce called "dirty"
function testMergeGraphs2(graphNodeText){
  graphList = [];
  i = 0;
  for (gTexts of graphNodeText){
    tempG = createGraphJSON(i + "testGraph");
    for (nText in gTexts){
      tempG.nodes.push(createNodeJSON(0,0,0,0,0,0,0,0,0,getNewID2(tempG)));
      tempG.nodes[nText].text = gTexts[nText];
    }
    i++;
    //add edges
    if(tempG.nodes.length >= 2){
      tempG.edges.push(createEdgeJSON(tempG.nodes[0].index, tempG.nodes[1].index));
    }
    
    graphList.push(tempG);
  }
  mergeResult = mergeListOfMaps(graphList);
  console.log(mergeResult);
  return mergeResult;
}


//testMergeGraphs2([["I hope this works","happy"],["ignorant","fear","tpyo"],["happy","last"]]);
//testMergeGraphs2([["happy","sad"],["happy"]]);
//testMergeGraphs(["happy","sad","excited","fear"]);

//https://coderwall.com/p/uop8jw/fast-and-working-levenshtein-algorithm-in-javascript
function levenshtein(a, b) {
  if(a.length === 0) return b.length;
  if(b.length === 0) return a.length;

  var matrix = [];

  // increment along the first column of each row
  var i;
  for(i = 0; i <= b.length; i++){
    matrix[i] = [i];
  }

  // increment each column in the first row
  var j;
  for(j = 0; j <= a.length; j++){
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for(i = 1; i <= b.length; i++){
    for(j = 1; j <= a.length; j++){
      if(b.charAt(i-1) == a.charAt(j-1)){
        matrix[i][j] = matrix[i-1][j-1];
      } else {
        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                Math.min(matrix[i][j-1] + 1, // insertion
                                         matrix[i-1][j] + 1)); // deletion
      }
    }
  }

  return matrix[b.length][a.length];
}
 //end of https://coderwall.com/p/uop8jw/fast-and-working-levenshtein-algorithm-in-javascript


//levenshtein can be used with Search bar
//Input: String that's searched
//return nodeID and text
function searchWithinMap(graph,s){
  var threshold_distance = 2;
  for(n of graph.nodes){
    keywords = getKeywords(n.text)
    console.log(keywords);
    for (k of keywords){
      if (levenshtein(s, k) <= threshold_distance){
        return true;
      }
    }
  }
  return false;
  }
  
  

//called when user presses the submit button after searching
const searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", function(event){
  event.preventDefault();
  var searchTerm = document.getElementById("searchTerm").value;
  if (searchTerm == "")
  {
    alert("Please enter a term in the search field!");
  }
  else
  {
    if (searchWithinMap(currentMindMap, searchTerm)){
      alert(searchTerm + " was found!");
    }
    else{
      alert(searchTerm + " was not found.");
    }
     
  }
})
/*
function searchEnter(){
  var searchTerm = document.getElementById("searchTerm").value;
  searchResults = searchWithinMap(currentMindMap, searchTerm);

  console.log("Results for " + searchTerm + ": " + searchResults);
}
*/