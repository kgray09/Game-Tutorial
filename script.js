let myGamePiece;
let myObstacle;
let myObstacles = [];
let myScore;

//start by creating a gaming area
function startGame(){
    //this will call the function in the myGameArea object
    // make an object constructor/component in the order: width, height, color, x, y
    myGamePiece = new component(30, 30, "red", 10, 120);
    myObstacle = new component(10, 300, "green", 300, 120);
    // addint text on the canvas
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    myGameArea.start();
}

// //the game area object
let myGameArea = {
    // creates a new canvas element
    canvas: document.createElement("canvas"),
    // function to start the game, being called by startGame()
    start: function() {
        //set the size of the canvas
        this.canvas.width = 480;
        this.canvas.height = 270;
        //get the 2d context
        this.context = this.canvas.getContext("2d");
        //inserts the canvas element as the first child of the body
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        // adding a property for counting frames
        this.frameNo = 0;
        // add an interval that will run the updateGameArea() every 20th milisecond
        this.interval = setInterval(updateGameArea, 20);

        // for the  keyboard use

        // // adding event listener that checks if the key is pressed
        // window.addEventListener('keydown', function(e){
        //     //I changed to a on deprecated e.code instead of keyCode
        //     myGameArea.key = e.code;
        // });
        // // if the key is let go, it makes it false
        // window.addEventListener('keyup', function(e){
        //     myGameArea.key = false;
        // })
        
    },
    // clear the entire canvas
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    // stop method, clearing the interval
    stop: function(){
        clearInterval(this.interval);
    }
}

// this is a function that returns true if the frameno is a certain interval. This is so we can add multiple obstacles
function everyInterval(n){
    // everytime the interval is the same as n it will return true.
    console.log((myGameArea.frameNo / n) % 1 === 0);
    if((myGameArea.frameNo / n) % 1 === 0) {
        console.log("true");
        return true;
    }
    return false;
    
}

// // the constructor, this will help control the players appearance, and movements when playing the game
function component(width, height, color, x, y, type){
    // add the text score
    this.type = type;
    // set the width and height of the red square
    this.width = width;
    this.height = height;
    //set the x,y positioning of the red square
    this.x = x;
    this.y = y;
    // these will be used as speed indicators
    this.speedX = 0;
    this.speedY = 0;
    // redrawing of the canvas
    this.update = function(){
        //get the context for the game area
        ctx = myGameArea.context;
        if(this.type == "text"){
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            //fill and color the square
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
    //checks if the component crashes with another component
    // called every 50frames
    this.crashWith = function(otherObj){
        // the box/player that is moving
        let myLeft = this.x;
        let myRight = this.x + (this.width);
        let myTop = this.y;
        let myBottom = this.y + (this.height);

        //the obstacles
        let obstacleLeft = otherObj.x;
        let obstacleRight = otherObj.x + (otherObj.width);
        let obstacleTop = otherObj.y;
        let obstacleBottom = otherObj.y + (otherObj.height);

        // set the crash to false if, as long as the square does not touch the top of an obstacle
        let crash = true;
        if((myBottom < obstacleTop) || 
        // or the top of the square doesnt touch the bottom of the obstacle
        (myTop > obstacleBottom) || 
        // or if the right of the square doesnt touch the left of the obstacle
        (myRight < obstacleLeft) || 
        // or if the left of the obstacle doesnt touch the right of the obstacle
        (myLeft > obstacleRight)){
            crash = false;
        }
        return crash;
    }
}

// // setting up the game for action
// create updateGameArea() function
function updateGameArea(){
    let x, y;
    // in order to have multiple types of obstacles, we need to iterate through the array of them to make sure that if we crash into those varying obstacles
    for(i = 0; i < myObstacles.length; i += 1 ){
        if(myGamePiece.crashWith(myObstacles[i])){
            console.log("crashed");
            myGameArea.stop();
            return;
        }
    }

    // clears the canvas before redrawing, otherwise we would see all of the movements
    myGameArea.clear();

    // increment the frameNo
    myGameArea.frameNo += 1;

    // if it is the first frame or it has been 150 frames, then add a new component (obstacle)
    if(myGameArea.frameNo == 1 || everyInterval(150)) {
        x = myGameArea.canvas.width;
        // set a min height and max height of the obstacle
        minHeight = 20;
        maxHeight = 200;
        // user the max and min heights to draw a random number betwen them
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        // set a min and max height for the gap between the obstacles
        minGap = 50;
        maxGap = 200;
        // use the max and min heights to generate a random number
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        // push these obstacles to the array
        myObstacles.push(new component(10, height, "green", x, 0))
        myObstacles.push(new component(10, x - height - gap, "green", x, height + gap));
    }

    // loop through the obstacles to see if there is a crash
    for (i = 0; i < myObstacles.length; i+=1){
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }
    myScore.text = "SCORE: " + myGameArea.frameNo;
    myScore.update();
    // // this will change the position
    myGamePiece.newPos();
    //redraws the canvas
    myGamePiece.update();

}
    // for the keyboard use:

    // myGamePiece.speedX = 0;
    // myGamePiece.speedY = 0;
    // if(myGameArea.key && myGameArea.key == 'ArrowLeft'){
    //     myGamePiece.speedX = -1;
    // }
    // if(myGameArea.key && myGameArea.key == 'ArrowRight'){
    //     myGamePiece.speedX = 1;
    // }
    // if(myGameArea.key && myGameArea.key == 'ArrowUp'){
    //     myGamePiece.speedY = -1;
    // }
    // if(myGameArea.key && myGameArea.key == 'ArrowDown'){
    //     myGamePiece.speedY = 1;
    // }


// these functions control the movement of the game piece relative to the x, y positioning
function moveUp(){
    myGamePiece.speedY -= 1;
}

function moveDown(){
    myGamePiece.speedY += 1;
}

function moveLeft(){
    myGamePiece.speedX -= 1;
}

function moveRight(){
    myGamePiece.speedX += 1;
}

// stop movement when the mouse has released
function stopMove(){
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
}

startGame();

// event listeners
// buttons move
document.getElementById("up").addEventListener("mousedown", moveUp);
document.getElementById("down").addEventListener("mousedown", moveDown);
document.getElementById("left").addEventListener("mousedown", moveLeft);
document.getElementById("right").addEventListener("mousedown", moveRight);

// stop movement
document.getElementById("up").addEventListener("mouseup", stopMove);
document.getElementById("down").addEventListener("mouseup", stopMove);
document.getElementById("left").addEventListener("mouseup", stopMove);
document.getElementById("right").addEventListener("mouseup", stopMove);

