CANVAS_WIDTH = 400;
CANVAS_HEIGHT = 400;

// Creates the canvas
function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
}
// Draws the button and the text on top of it
function draw() {
  // 255 corresponds to a White background 
  background(255);
  // Rectangle creation
  // This fill function makes the rect the light green color
  fill('rgba(0,255,0, 0.25)');
  // Positions the rect at its centerpoint instead of the corner 
  rectMode(CENTER);
  // Constructs the rectangle
  rect(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 150, 75);
  
  // Creates the text for the button
  let str = "Create New MindMap";
  textSize(14.5);
  fill(50);
  textAlign(CENTER);
  text(str, CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
}