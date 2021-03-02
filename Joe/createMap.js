CANVAS_WIDTH = 400;
CANVAS_HEIGHT = 400;

// Creates the canvas
function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

  let inp = createInput('');
  inp.input(myInputEvent);
  inp.position(100,200);
}

function myInputEvent() {
    console.log('you are typing: ', this.value());
  }

function draw(){
circle(200,200,100);
}