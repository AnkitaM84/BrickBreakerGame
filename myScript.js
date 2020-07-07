    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

    var x = canvas.width/2;
    var ballRadius = 10;
    var y = canvas.height-30;
    var dx = 2;
    var dy = -2;
    var paddleHeight = 10;
    var paddleWidth = 75;
    var paddleX = (canvas.width-paddleWidth)/2;
    var rightPressed = false;
    var leftPressed = false;
    var BRowCount = 4;
    var BColumnCount = 6;
    var brickWidth = 74;
    var brickHeight = 18;
    var brickPadding = 12;
    var BOffsetTop = 30;
    var BOffsetLeft = 30;

    var score = 0;
    var lives = 3;

    var bricks = [];
    for(var c=0; c<BColumnCount; c++) {
        bricks[c] = [];
        for(var r=0; r<BRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);

    function keyDownHandler(e) {
        if(e.key == "Right" || e.key == "ArrowRight") {
            rightPressed = true;
        }
        else if(e.key == "Left" || e.key == "ArrowLeft") {
            leftPressed = true;
        }
    }

    function keyUpHandler(e) {
        if(e.key == "Right" || e.key == "ArrowRight") {
            rightPressed = false;
        }
        else if(e.key == "Left" || e.key == "ArrowLeft") {
            leftPressed = false;
        }
    }

    function mouseMoveHandler(e) {
        var relativeX = e.clientX - canvas.offsetLeft;
        if(relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddleWidth/2;
        }
    }

    function drawScore() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Score: "+score, 8, 20);
    }

    function drawLives() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Lives: "+lives, canvas.width-65, 20);
    }

    function collisionDetection() {
        for (var c = 0; c < BColumnCount; c++) {
            for (var r = 0; r < BRowCount; r++) {
                var b = bricks[c][r];
                if (b.status == 1) {
                    if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                        dy = -dy;
                        b.status = 0;
                        score++;
                        if(score == BRowCount*BColumnCount) {
                            alert("YOU WIN, CONGRATULATIONS!");
                            document.location.reload();
                            clearInterval(interval); // Needed for Chrome to end game
                        }
                    }
                }
            }
        }
    }

    function drawBricks() {
        for (var c = 0; c < BColumnCount; c++) {
            for (var r = 0; r < BRowCount; r++) {
                if (bricks[c][r].status == 1) {
                    var brickX = (c * (brickWidth + brickPadding)) + BOffsetLeft;
                    var brickY = (r * (brickHeight + brickPadding)) + BOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = "#00FF7F";
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }


    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI*2);
        ctx.fillStyle = "#8A2BE2";
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }

    function draw() {
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawPaddle();
        drawScore();
        drawLives();
        drawBricks();
        collisionDetection();
        
        if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if(y + dy < ballRadius) {
            dy = -dy;
        } else if(y + dy > canvas.height-ballRadius) {
            if(x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            } else {
                lives--;
                if(!lives) {
                    alert("GAME OVER");
                    document.location.reload();
                    clearInterval(interval); // Needed for Chrome to end game
                }
                else {
                    x = canvas.width/2;
                    y = canvas.height-30;
                    dx = 2;
                    dy = -2;
                    paddleX = (canvas.width-paddleWidth)/2;
                }
            }
        }   

        if(rightPressed) {
            paddleX += 6;
            if (paddleX + paddleWidth > canvas.width){
                paddleX = canvas.width - paddleWidth;
            }
        }
        else if(leftPressed) {
            paddleX -= 6;
            if (paddleX < 0){
                paddleX = 0;
            }
        }

        x+=dx;
        y+=dy;
    }
    var interval = setInterval(draw,10);
