let board;
let boardWidth = 1280;
let boardHeight = 720;
let context;

//bird
let birdWidth = 34; 
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight,
    velocityY: 0,
    rotation: 0
}

//pipes
let pipeArray = [];
let pipeWidth = 64; 
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let gravity = 0.4;
let jump = -6;
let velocityX = -2; 

let gameOver = false;
let gameStarted = false; 
let score = 0;
let pipeInterval; 

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); 

    birdImg = new Image();
    birdImg.src = "./flappybird.png";
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    requestAnimationFrame(update);
    document.addEventListener("mousedown", handleMouseDown); 
}

function update() {
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    if (!gameStarted) {
        context.fillStyle = "white";
        context.font = "30px 'Press Start 2P', sans-serif";
        context.textAlign = "center";
        context.fillText("Click to Play", boardWidth / 2, boardHeight / 2);
        return;
    }

    if (gameOver) {
        context.fillText("GAME OVER", boardWidth / 2, boardHeight / 2);
        return;
    }

    //bird
    bird.velocityY += gravity;
    bird.y = Math.max(bird.y + bird.velocityY, 0); 

    bird.rotation = Math.min(Math.PI / 4, bird.velocityY / 10);

    context.save();
    context.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
    context.rotate(bird.rotation);
    context.drawImage(birdImg, -bird.width / 2, -bird.height / 2, bird.width, bird.height);
    context.restore();

    if (bird.y > board.height) {
        gameOver = true;
    }

    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; 
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    //clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); 
    }

    //score
    context.fillStyle = "white";
    context.font = "30px 'Press Start 2P', sans-serif";
    context.textAlign = "center";
    context.fillText(score, boardWidth / 2, 50);
}

function placePipes() {
    if (gameOver) {
        return;
    }


    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 4;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(bottomPipe);
}

function moveBird() {
    bird.velocityY = jump;
}

function handleMouseDown() {
    if (!gameStarted) {
        gameStarted = true;
        pipeInterval = setInterval(placePipes, 1500); 
        return;
    }

    if (gameOver) {
        bird.y = birdY;
        bird.velocityY = 0;
        pipeArray = [];
        score = 0;
        gameOver = false;
        gameStarted = false; 
        clearInterval(pipeInterval); 
        return;
    }

    moveBird();
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   
        a.x + a.width > b.x &&   
        a.y < b.y + b.height &&  
        a.y + a.height > b.y;   
}
