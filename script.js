/*DECLARE CONSTANTS*/
const WELCOME_MESSAGE = "Welcome to ASTEROIDS' BELT";
const FPS = 30;
const FRICTION = 0.5;
const LIVES = 3;
const POINTS = 10;
const ASTEROIDS_NUMBER = 20;
const ASTEROID_SIZES = [1, 2, 3, 4];
const ASTEROID_SPEED = 50;
const SHIP_SIZE = 35;
const SHIP_SPEED = 5;
const TURN_SPEED = 360;
const EXPLOSION_DUR = 0.01;
const SAFE_TIME = 2.5;
const BLINK = 0.125;
const ROCKET_SIZE = 3;
const ROCKET_SPEED = 500;
const ROCKET_MAX = 3;
const ROCKET_LIFESPAN = 0.9;
const BUFFER = 200;
const TEXT_FADE = 5
const TEXT_SIZE = 18;

/*SAVE KEYS FOR LOCAL STORAGE*/
const BEST_SCORE = "highestscore";
const SECOND_SCORE = "secondscore";
const THIRD_SCORE = "thirdscore";
const GOLD_WINNER = "playerno1";
const SILVER_WINNER = "playerno2";
const BRONZE_WINNER = "playerno3";

/*SET UP CANVAS*/
/** @type {HTMLCanvasElement} */
let canvas = document.getElementById("gameCanvas");
let context = canvas.getContext("2d");

/*DECLARE GLOBAL VARIABLES*/
let asteroid, asteroids, ship, player, lives, score, bestPlayer, secondPlayer, thirdPlayer, highestScore, secondScore, thirdScore, text, textAlpha;

/*GAME LOOP*/
function newGame(){
    lives = LIVES;
    score = 0;
    ship = createShip ();
    asteroid = createAsteroid(Math.round(Math.random() * canvas.width, Math.round(Math.random() * canvas.height), 10 * ASTEROID_SIZES[Math.floor(Math.random() * ASTEROID_SIZES.length)]));
    text = WELCOME_MESSAGE;
    textAlpha = 1.0;

    createAsteroids();

    let scoreValue1 = highestScore = localStorage.getItem(BEST_SCORE);
    let scoreValue2 = secondScore = localStorage.getItem(SECOND_SCORE);
    let scoreValue3 = thirdScore = localStorage.getItem(THIRD_SCORE);
    let playerName1 = bestPlayer = localStorage.getItem(GOLD_WINNER);
    let playerName2 = secondPlayer = localStorage.getItem(SILVER_WINNER);
    let playerName3 = thirdPlayer = localStorage.getItem(BRONZE_WINNER);

    if (playerName1 == null  && scoreValue1 == null) {
        bestPlayer = '- ';
        highestScore = 0;
    } else {
        bestPlayer = playerName1;
        highestScore = parseInt(scoreValue1);
    }
    if (playerName2 == null  && scoreValue2 == null) {
        secondPlayer = '- ';
        secondScore = 0;
    } else {
        secondPlayer = playerName2;
        secondScore = parseInt(scoreValue2);
    }
    if (playerName3 == null  && scoreValue3 == null) {
        thirdPlayer = '- ';
        thirdScore = 0;
    } else {
        thirdPlayer = playerName3;
        thirdScore = parseInt(scoreValue3);
    }
    getPlayerName();
}

function createShip() {
    return {
        x:canvas.width / 2,
        y:canvas.height / 2,
        r: SHIP_SIZE / 2,
        a: 90 / 180 * Math.PI,
        blinkTime: Math.ceil(BLINK * FPS), //3.75 sec
        blinkNum: Math.ceil(SAFE_TIME / BLINK), //20 blinks
        safeTime: Math.ceil(BLINK * FPS), ////3.75 sec
        canShoot: true,
        destroyed: false,
        destroyTime: 0,
        rockets: [],
        rotation: 0,
        movingUp: false,
        movingDown: false,
        movingLeft: false,
        movingRight: false,
        move: {
            x:0,
            y:0
        }
    }
};

function createAsteroid(x, y, r) {
    return {
        x: x,
        y: y,
        xv: Math.random() * ASTEROID_SPEED / FPS * (Math.random() < 0.5 ? 1 : -1),
        yv: Math.random() * ASTEROID_SPEED / FPS * (Math.random() < 0.5 ? 1 : -1),
        radius: r,
        a: Math.random() * Math.PI * 2
    }
};

function createAsteroids() {
    asteroids = [];
    let x, y;

    for (let i = 0; i < ASTEROIDS_NUMBER; i++) {
        do {
            x = Math.round(Math.random() * canvas.width);
            y = Math.round(Math.random() * canvas.height);
        } while(distanceBetweenObjects(ship.x, ship.y, x, y) < BUFFER);
        let asteroidSize = 10 * ASTEROID_SIZES[Math.floor(Math.random() * ASTEROID_SIZES.length)];
        asteroids.push(createAsteroid(x, y, asteroidSize));
    }  
};

function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}

function getPlayerName() {
    player = document.getElementById("playerName").value;
    return player;
}

function distanceBetweenObjects(x1, y1, x2, y2) {
    let distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    return distance;
};

function destroyShip() {
    ship.destroyTime = Math.ceil(EXPLOSION_DUR) * FPS;
};

function gameWon() {
    text = "You won!";
    textAlpha = 1.0;
    setTimeout(() => {newGame()}, 3000);     
}

function gameOver() {
    ship.destroyed = true;
    text = "Game over!";
    textAlpha = 1.0;
}

function calculateRanking () {
    if (score > highestScore) {
        let tempPlayer = bestPlayer;
        let tempScore = highestScore;
        bestPlayer = player;
        highestScore = score;
        localStorage.setItem(GOLD_WINNER, bestPlayer);
        localStorage.setItem(BEST_SCORE, highestScore);
        localStorage.setItem(SILVER_WINNER, tempPlayer);
        localStorage.setItem(SECOND_SCORE, tempScore);
    }

    else if ((score <= highestScore && score > secondScore)) {
        let tempPlayer = secondPlayer;
        let tempScore = secondScore;
        secondPlayer = player;
        secondScore = score;
        localStorage.setItem(SILVER_WINNER, secondPlayer);
        localStorage.setItem(SECOND_SCORE, secondScore);
        localStorage.setItem(BRONZE_WINNER, tempPlayer);
        localStorage.setItem(THIRD_SCORE, tempScore);
    }

    else if ((score <= secondScore  && score > thirdScore)) {
        thirdPlayer = player;
        thirdScore = score;
        localStorage.setItem(BRONZE_WINNER, thirdPlayer);
        localStorage.setItem(THIRD_SCORE, thirdScore);
    }
}

function destroyAsteroid(i) {
    let x = asteroids[i].x;
    let y = asteroids[i].y;
    let radius = asteroids[i].radius;

    switch(radius) {
        case 40:
            asteroids.push(createAsteroid(x, y, 30));
            break;

        case 30:
            asteroids.push(createAsteroid(x, y, 20));
            break;
            
        case 20:
            asteroids.push(createAsteroid(x, y, 10));
            break;
            
    }
    asteroids.splice(i, 1);
    score += POINTS;

    if(score % 160 == 0) {
        lives++;
    }
    
    if (asteroids.length == 0) {
        calculateRanking();
        gameWon();
    }
}

function launchRocket() {
    if (ship.canShoot && ship.rockets.length < ROCKET_MAX) {
        ship.rockets.push({
            x: ship.x + 4/3 * ship.r * Math.cos(ship.a),
            y: ship.y - 4/3 * ship.r * Math.sin(ship.a),
            xv: ROCKET_SPEED * Math.cos(ship.a) / FPS,
            yv: -ROCKET_SPEED * Math.sin(ship.a) / FPS,
            lifespan:0
        });
    }
    ship.canShoot = false;
}

function updateCanvas() {
    let exploding = ship.destroyTime  > 0;
    let blinking = ship.blinkNum % 2 == 0;
    
    context.fillStyle = "#000222";
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    if (ship.movingUp && !ship.destroyed) {
        ship.move.x += SHIP_SPEED * Math.cos(ship.a) / FPS;
        ship.move.y -= SHIP_SPEED * Math.sin(ship.a) / FPS;
    } else {
        ship.move.x -= FRICTION * ship.move.x / FPS;
        ship.move.y -= FRICTION * ship.move.y / FPS;
    }

    if(ship.movingDown && !ship.destroyed) {
        ship.move.x -= SHIP_SPEED * Math.cos(ship.a) / FPS;
        ship.move.y += SHIP_SPEED * Math.sin(ship.a) / FPS;
    } else {
        ship.move.x -= FRICTION * ship.move.x / FPS;
        ship.move.y -= FRICTION * ship.move.y / FPS;
    }

    if(ship.movingLeft && !ship.destroyed) {
    ship.move.x -= SHIP_SPEED * Math.sin(ship.a) / FPS;
    ship.move.y -= SHIP_SPEED * Math.cos(ship.a) / FPS;
    } else {
        ship.move.x -= FRICTION * ship.move.x / FPS;
        ship.move.y -= FRICTION * ship.move.y / FPS;
    }

    if(ship.movingRight && !ship.destroyed) {
        ship.move.x += SHIP_SPEED * Math.sin(ship.a) / FPS;
        ship.move.y += SHIP_SPEED * Math.cos(ship.a) / FPS;
    } else {
        ship.move.x -= FRICTION * ship.move.x / FPS;
        ship.move.y -= FRICTION * ship.move.y / FPS;
    }

    if(!exploding) {
        if (blinking && !ship.destroyed) {
            context.strokeStyle = "#FFFFF0";
            context.lineWidth = SHIP_SIZE / 10;
            context.beginPath();
            context.moveTo (
                ship.x + ship.r * Math.cos(ship.a),
                ship.y - ship.r * Math.sin(ship.a),
            );
            context.lineTo(
                ship.x - ship.r * (Math.cos(ship.a) + Math.sin(ship.a)),
                ship.y + ship.r * (Math.sin(ship.a) - Math.cos(ship.a)),
            );   
            context.lineTo(
                ship.x - ship.r * (Math.cos(ship.a) - Math.sin(ship.a)),
                ship.y + ship.r * (Math.sin(ship.a) + Math.cos(ship.a)),
            );
            context.closePath();
            context.stroke();
        }

        if(ship.blinkNum > 0) {
            ship.blinkTime--;
            if (ship.blinkTime == 0) {
                ship.blinkTime = Math.ceil(BLINK * FPS);
                ship.blinkNum--;
            }
        }
    }
    
    for (let i = 0; i < asteroids.length; i++) {
        x = asteroids[i].x;
        y = asteroids[i].y;
        radius = asteroids[i].radius;
        displaySize = Math.round(radius / 10);
        a = asteroids[i].a;

        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        switch(radius) {
            case 40:
                context.strokeStyle = "#008B8B";
                context.fillStyle = "#008B8B";
                break;
            case 30:
                context.strokeStyle = "#8FBC8F";
                context.fillStyle = "#8FBC8F";
                break;
            case 20:
                context.strokeStyle = "#FFA07A";
                context.fillStyle = "#FFA07A";
                break;
            case 10:
                context.strokeStyle = "#FFFACD";
                context.fillStyle = "#FFFACD";
                break;
        }
        context.fill();
        context.closePath();
        context.stroke();
        
        for (let i = 0; i < asteroids.length; i++)
        {
            context.textAlign = "center"
            context.textBaseline = "middle"
            context.fillStyle = "#000222";
            context.font = '18px verdana';
            context.fillText(displaySize.toString(), x, y);
        }
    }

    for (let i = 0; i < ship.rockets.length; i++) {
        context.fillStyle = "#B22222";
        context.beginPath();
        context.arc(ship.rockets[i].x, ship.rockets[i].y, ROCKET_SIZE, 0, Math.PI * 2, false);
        context.fill();
        context.closePath();  
    }

    if(textAlpha >= 0) {
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = "rgba(255, 255, 255, " + textAlpha + ")";
        context.font = (TEXT_SIZE * 1.8) + "px verdana";
        context.fillText(text, canvas.width / 2, canvas.height * 0.2)
        textAlpha -= (1.0 / TEXT_FADE / FPS);
    }
    else if (ship.destroyed){
        newGame();
    }

    for (let i = 0; i < lives; i++) {
        context.textAlign = "left";
        context.textBaseline = "middle";
        context.fillStyle = "#FFFFF0";
        context.font = TEXT_SIZE + "px verdana";
        context.fillText("LIVES: " + lives.toString(), 25, 25)
    }

    context.textAlign = "right";
    context.textBaseline = "middle";
    context.fillStyle = "#FFFFF0";
    context.font = TEXT_SIZE + "px verdana";
    context.fillText("SCORE: "+ score.toString(), canvas.width - 25, 25);
    
    context.textAlign = "left";
    context.textBaseline = "middle";
    context.fillStyle = "#FFFFF0";
    context.font = (TEXT_SIZE) + "px verdana";
    context.fillText(bestPlayer + ": " + highestScore, canvas.width / 2, 25);
    context.fillText(secondPlayer + ": " + secondScore, canvas.width / 2, 50);
    context.fillText(thirdPlayer + ": " + thirdScore, canvas.width / 2, 75);
    
    context.beginPath();
    context.arc((canvas.width / 2.05), 25, 7, 0, Math.PI * 2);
    context.strokeStyle = "#FFD700";
    context.fillStyle = "#FFD700";
    context.fill();
    context.closePath();
    context.stroke();

    context.beginPath();
    context.arc((canvas.width / 2.05), 50, 7, 0, Math.PI * 2);
    context.strokeStyle = "#C0C0C0";
    context.fillStyle = "#C0C0C0";
    context.fill();
    context.closePath();
    context.stroke();

    context.beginPath();
    context.arc((canvas.width / 2.05), 75, 7, 0, Math.PI * 2);
    context.strokeStyle = "#CD7F32";
    context.fillStyle = "#CD7F32";
    context.fill();
    context.closePath();
    context.stroke();

    let astX, astY, astR, rockX, rockY;
    for (let i = asteroids.length - 1; i >= 0; i--) {
        astX = asteroids[i].x;
        astY = asteroids[i].y;
        astR = asteroids[i].radius;
        
        for (let j = ship.rockets.length - 1; j >= 0; j--) {
            rockX = ship.rockets[j].x;
            rockY = ship.rockets[j].y;
            if(distanceBetweenObjects(astX, astY, rockX, rockY) < astR) {
                ship.rockets.splice(j, 1);
                destroyAsteroid(i);
                break;
            }
        }
    }

    let ast1X, ast1Y, ast1R, ast2X, ast2Y, ast2R;
    for (let i = asteroids.length - 1; i >= 0; i--) {
        ast1X = asteroids[i].x;
        ast1Y = asteroids[i].y;
        ast1R = asteroids[i].radius;

        for (let j = asteroids.length - 1; j >= 0; j--) {
            ast2X = asteroids[j].x;
            ast2Y = asteroids[j].y;
            ast2R = asteroids[j].radius;

            if(distanceBetweenObjects(ast1X, ast1Y, ast2X, ast2Y) < ast1R + ast2R) {
                asteroids[i].xv *= -1;
                asteroids[i].yv *= -1;
                asteroids[j].xv *= -1;
                asteroids[j].yv *= -1;
                asteroids[j].x=asteroids[j].x-1;
                asteroids[j].y=asteroids[j].y-1;
                asteroids[i].x=asteroids[i].x+1;
                asteroids[i].y=asteroids[i].y+1;
                break;
            }
        }
    }

    if(!exploding) {
        if(ship.blinkNum == 0 && !ship.destroyed) {
            for (let i = 0; i < asteroids.length; i++) {
                if(distanceBetweenObjects
                (ship.x, ship.y, asteroids[i].x, asteroids[i].y) < ship.r + asteroids[i].radius) {
                destroyShip();
                destroyAsteroid(i);
                break;
                }
            }
        }

        ship.a += ship.rotation / 3;
        ship.x += ship.move.x;
        ship.y += ship.move.y;
    } else {
        ship.destroyTime--;
        if(ship.destroyTime == 0) {
            lives--;
            if (lives == 0) {
                gameOver();
            } else {
                ship = createShip();
            }
        }
    }

    //manage screen edge
    if (ship.x < 0 - ship.r) {
        ship.x = canvas.width + ship.r;
    } else if ((ship.x > canvas.width + ship.r)) {
        ship.x = 0 - ship.r; 
    }
    if (ship.y < 0 - ship.r) {
        ship.y = canvas.height + ship.r;
    } else if ((ship.y > canvas.height + ship.r)) {
        ship.y = 0 - ship.r;        
    }

    for (let i = ship.rockets.length - 1; i >=0; i--) {
        if(ship.rockets[i].lifespan > ROCKET_LIFESPAN * canvas.height) {
            ship.rockets.splice(i, 1);
            continue;
        }

        if (!exploding){
        ship.rockets[i].x += ship.rockets[i].xv;
        ship.rockets[i].y += ship.rockets[i].yv;
        }
        ship.rockets[i].lifespan += Math.sqrt(Math.pow(ship.rockets[i].xv, 2) + Math.pow(ship.rockets[i].yv,2));

        if (ship.rockets[i].x < 0) {
            ship.rockets[i].x = canvas.width;
        }
        else if (ship.rockets[i].x > canvas.width){
            ship.rockets[i].x = 0;
        }
        if (ship.rockets[i].y < 0) {
            ship.rockets[i].y = canvas.height;
        }
        else if (ship.rockets[i].y > canvas.height){
            ship.rockets[i].y = 0;
        }
    }

    for (let i = 0; i < asteroids.length; i++) {
        asteroids[i].x += asteroids[i].xv;
        asteroids[i].y += asteroids[i].yv;

        if (asteroids[i].x < 0 - asteroids[i].radius) {
            asteroids[i].x = canvas.width + asteroids[i].radius;
        }
        else if (asteroids[i].x > canvas.width + asteroids[i].radius) {
            asteroids[i].x = 0 - asteroids[i].radius;
        }
        if (asteroids[i].y < 0 - asteroids[i].radius) {
            asteroids[i].y = canvas.height + asteroids[i].radius;
        }
        else if (asteroids[i].y > canvas.height + asteroids[i].radius) {
            asteroids[i].y = 0 - asteroids[i].radius;
        }
    }  
}