// Constants
const BORDER_COLOR = "white";
const BACKGROUND_COLOR = "white";

let gc = document.getElementById("gameCanvas");
let ctx = gc.getContext("2d");

let snake = [{
        x: 150,
        y: 150
    },
    {
        x: 140,
        y: 150
    },
    {
        x: 130,
        y: 150
    },
    {
        x: 120,
        y: 150
    },
    {
        x: 110,
        y: 150
    }
];

let dx = 10;
let dy = 0;

let foodX = 0;
let foodY = 0;

let score = 0;
let pause = false;

// Style it a bit
ctx.fillStyle = BACKGROUND_COLOR;

ctx.fillRect(0, 0, gc.width, gc.height);


document.addEventListener("keydown", changeDirection);





gc.width = window.innerWidth / 2;
gc.height = window.innerHeight / 2;






// Variables used in the interval
let deadCheck = false; // Only check if youre dead once after pause;

function main() {
    drawSnake();

    let interval = setInterval(function () {
        if (pause == false) {
            clearCanvas();
            drawFood();
            advanceSnake();
            drawSnake();
        } else if (pause == true) {
            if (deadCheck == true) {
                console.log("YOU DIED THIS IS MENU");
                clearInterval(interval);
            } else {
                console.log("whale whale whale you can pause");
            }
        }
    }, 100);
}












// Functions, names will change later



function drawSnake() {
    snake.forEach(drawSnakePart);
}

function drawSnakePart(sp) {
    ctx.fillStyle = "lightgreen";
    ctx.strokeStyle = "darkgreen";

    ctx.fillRect(sp.x, sp.y, 10, 10);
    ctx.strokeRect(sp.x, sp.y, 10, 10);
}

function advanceSnake() {
    const head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };
    snake.unshift(head);

    let didEatFood = snake[0].x === foodX && snake[0].y === foodY;

    if (didEatFood) {
        createFood();
        score += 10;
    } else if (didGameEnd()) {
        pause = true;
        deadCheck = true;
    } else {
        snake.pop();
    }
}

function clearCanvas() {
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";

    ctx.fillRect(0, 0, gc.width, gc.height);
    //ctx.strokeRect(0, 0, gc.width, gc.height);
}

function changeDirection(e) {
    const pressed = e.keyCode;
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;

    switch (pressed) {
        case 37: // left
            if (!goingRight) {
                dx = -10;
                dy = 0;
            }
            break;
        case 39: // Right
            if (!goingLeft) {
                dx = 10;
                dy = 0;
            }
            break;
        case 38: // Up
            if (!goingDown) {
                dx = 0;
                dy = -10;
            }
            break;
        case 40: // Down
            if (!goingUp) {
                dx = 0;
                dy = 10;
            }
            break;
        case 32:
            // Space/Pause
            deadCheck = didGameEnd();
            console.log(deadCheck);
            pause = !pause;
            break;
    }
}

function rand(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function createFood() {
    foodX = rand(0, gc.width - 10);
    foodY = rand(0, gc.height - 10);

    snake.forEach(function isFoodOnSnake(part) {
        let foodIsOnSnake = part.x == foodX && part.y == foodY;
        if (foodIsOnSnake) {
            createFood();
        }
    });
}

// Change this to a more general "powerup" function
function drawFood() {
    ctx.fillStyle = "red";
    ctx.strokeStyle = "darkred";
    ctx.fillRect(foodX, foodY, 10, 10);
    ctx.strokeRect(foodX, foodY, 10, 10);
}

function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        let didCollide = snake[i].x === snake[0].x && snake[i].y === snake[0].y;

        if (didCollide) return true;
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > gc.width - 10;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > gc.height - 10;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}