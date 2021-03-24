//load json graph object from the database (NOTE: There is a my_url from which you get the object)
//This may not be needed with Firebase but idk- Andrew
function getJSONFromURL() {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': my_url,
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    })
    return json;
}



//create an empty graph JSON object
function createGraphJSON(title)
{
  return {"graph": {
    "label": title,
    "nodes": [], //no nodes

    "edges": [] //no edges
   }
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
function createNodeJSON(text, x, y, round, grabbed, resizeDC, resizeKP)
{
  return {text: text,
          x_pos: x,
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


// //run this to see how it is created
// var g = createGraph("test graph"); // create empty graph
// console.log("Empty Graph created:");
// console.log(g);
//
// console.log("Creating Empty Node");
// var n = createNode("text label", 100, 100) //create node with given attributes
// console.log(n);
//
// console.log("Adding Node");
// g.graph.nodes["nodeName or ID"] = n; //add a node to graph            NOTE: Identical names or ids will overwrite
// console.log(g);
//
// console.log("Removing Node")
// delete g.graph.nodes["nodeName or ID"]; //remove a node
// console.log(g);
//
// //similarly
// console.log("Nodes with id1 and id2");
// g.graph.nodes["id1"] = n;
// g.graph.nodes["id2"] = n;
//
// console.log("Adding Edge");
// g.graph.edges["Edge name or ID"] = createEdge("id1", "id2", "Edge Label") //add an edge
// console.log(g);
//
// console.log("Removing Edge");
// delete g.graph.edges["Edge name or ID"]; //remove an edge
// console.log(g);


