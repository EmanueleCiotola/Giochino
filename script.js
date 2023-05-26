document.addEventListener("DOMContentLoaded", function () {
    var canvas = document.getElementById("gameCanvas");
    var context = canvas.getContext("2d");
    
    var isPaused = true;

    var ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 10,
        color: "red",
        speed: 2,
        dx: 0,
        dy: 0
    };

    var objects = [];
    var objectSize = 40;
    var objectSpeed = 2;
    var score = 0;
    var objectInterval = 3000;

    function drawBall() {
        context.beginPath();
        context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
        context.fillStyle = ball.color;
        context.fill();
        context.closePath();
    }

    function drawObjects() {
        for (var i = 0; i < objects.length; i++) {
            context.beginPath();
            context.rect(objects[i].x, objects[i].y, objectSize, objectSize);
            context.fillStyle = "blue";
            context.fill();
            context.closePath();
        }
    }

    function generateObject() {
        if (isPaused) return;
        var object = {
            x: Math.random() * (canvas.width - objectSize),
            y: -objectSize
        };

        objects.push(object);
    
        setTimeout(generateObject, objectInterval); //Genera ostacolo ogni tot millisecondi
    }

    function moveBall() {
        if (isPaused) return;
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Controllo limite sinistro
        if (ball.x - ball.radius < 0) {
            ball.x = ball.radius;
            // Game over
            resetGame();
        }

        // Controllo limite destro
        if (ball.x + ball.radius > canvas.width) {
            ball.x = canvas.width - ball.radius;
            // Game over
            resetGame();
        }

        // Controllo limite superiore
        if (ball.y - ball.radius < 0) {
            ball.y = ball.radius;
            // Game over
            resetGame();
        }

        // Controllo limite inferiore
        if (ball.y + ball.radius > canvas.height) {
            ball.y = canvas.height - ball.radius;
            // Game over
            resetGame();
        }
    }

    function moveObjects() {
        if (isPaused) return;
        for (var i = 0; i < objects.length; i++) {
            objects[i].y += objectSpeed;

            if (objects[i].y > canvas.height) {
                objects.splice(i, 1); // Elimina ostacolo da array se supera bordo inferiore
                i--;
                updateScore();
            }
        }
    }

    function collisionDetection() {
        for (var i = 0; i < objects.length; i++) {
            var obj = objects[i];
            var ballRight = ball.x + ball.radius;
            var ballLeft = ball.x - ball.radius;
            var ballBottom = ball.y + ball.radius;
            var ballTop = ball.y - ball.radius;
            var objRight = obj.x + objectSize;
            var objLeft = obj.x;
            var objBottom = obj.y + objectSize;
            var objTop = obj.y;

            if (
                // Il +-3.2 dà un minimo di tolleranza
                ballRight -3.2 > objLeft &&
                ballLeft + 3.2 < objRight &&
                ballBottom - 3.2 > objTop &&
                ballTop + 3.2 < objBottom
            ) {
                // Game over
                resetGame();
            }
        }
    }

    function updateScore() {
        score++;
        if (score % 10 === 0) {
            objectInterval -= 300;
            objectInterval = Math.max(objectInterval, 300); // Assicurati che l'intervallo non scenda sotto i 500ms
            if (score % 30 === 0) {
                ball.speed += 0.3
                objectSpeed += 0.5;
            }
        }
        document.getElementById("score").textContent = score.toString();
    }

    function togglePause() {
        isPaused = !isPaused; // Inverte lo stato di pausa (da pausa a gioco e viceversa)
        if (isPaused == true) {
            buttonText.textContent = "Continua"
        } else buttonText.textContent = "Pausa"

        //TODO diminuire velocità pallina e ostacoli di 1.5 dopo la pausa e riaumentarla gradualmente in 3s
        //TODO durante la pausa bloccare il timer di generazione di ostacoli
    }

    function resetGame() {
        alert("Hai perso! Punteggio: " + score);
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.dx = 0;
        ball.dy = 0;
        objects = [];
        score = 0;
        objectInterval = 2000;
        document.location.reload();
    }

    function gameLoop() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        drawBall();
        drawObjects();
        if (objects.length == 0) generateObject();

        moveBall();
        moveObjects();
        collisionDetection();

        requestAnimationFrame(gameLoop);
    }
    
    function handleKeyDown(event) {
        if (event.key === "w") {
            ball.dy = -ball.speed;
        } else if (event.key === "a") {
            ball.dx = -ball.speed;
        } else if (event.key === "s") {
            ball.dy = ball.speed;
        } else if (event.key === "d") {
            ball.dx = ball.speed;
        }
    }

    //! Implementare per dover tenere premuto wasd
    // function handleKeyUp(event) {
    //     if (event.key === "w" || event.key === "s") {
    //         ball.dy = 0;
    //     } else if (event.key === "a" || event.key === "d") {
    //         ball.dx = 0;
    //     }
    // }

    document.getElementById("pauseButton").addEventListener("click", togglePause);
    buttonText = document.getElementById("pauseButton");
    document.getElementById("resetButton").addEventListener("click", resetGame);

    document.addEventListener("keydown", function (event) {
        if (event.key === "p" && buttonText.textContent != "Gioca") {
            togglePause(); // Quando viene premuto il tasto "p", si attiva o disattiva la pausa
        } else if (buttonText.textContent == "Gioca") {
            if (event.key === "Enter" || event.key === "w" || event.key === "a" || event.key === "s" || event.key === "d") {
                togglePause();
            }
        } else if (event.key === "Escape") {
            resetGame();
        }
    });
    document.addEventListener("keydown", handleKeyDown);
    //! Implementare per dover tenere premuto wasd
    // document.addEventListener("keyup", handleKeyUp);

    gameLoop();
});
