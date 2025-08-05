const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
let gravity = 0.6;
let isJumping = false;
let jumpHeight = 0;

let dino = {
    x: 50,
    y: canvas.height - 50,
    width: 40,
    height: 50,
    color: "#00FF00",
    velocityY: 0
};

let obstacles = [];
let gameSpeed = 5;
let gameInterval;

// Função para desenhar o dinossauro
function drawDino() {
    ctx.fillStyle = dino.color;
    ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
}

// Função para desenhar os obstáculos (cactos)
function drawObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        ctx.fillStyle = "#00FF00";
        ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
    }
}

// Função para movimentar o dinossauro
function moveDino() {
    if (isJumping) {
        dino.velocityY = -10;
        jumpHeight = 20;
        isJumping = false;
    }

    dino.velocityY += gravity; // Gravidade
    dino.y += dino.velocityY;

    // Se o dinossauro chegar ao chão
    if (dino.y > canvas.height - 50) {
        dino.y = canvas.height - 50;
        dino.velocityY = 0;
        jumpHeight = 0;
    }
}

// Função para gerar obstáculos
function generateObstacle() {
    let height = Math.random() > 0.5 ? 20 : 40; // Dois tipos de cactos
    let obstacle = {
        x: canvas.width,
        y: canvas.height - height - 10,
        width: 20,
        height: height
    };
    obstacles.push(obstacle);
}

// Função para movimentar os obstáculos
function moveObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= gameSpeed; // Faz os obstáculos se moverem para a esquerda
        // Se o obstáculo sair da tela, removemos ele
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
            score++; // Pontuação aumenta quando um obstáculo sai da tela
        }
    }
}

// Função para detectar colisão entre o dinossauro e os obstáculos
function checkCollision() {
    for (let i = 0; i < obstacles.length; i++) {
        if (dino.x + dino.width > obstacles[i].x &&
            dino.x < obstacles[i].x + obstacles[i].width &&
            dino.y + dino.height > obstacles[i].y) {
            // Colisão detectada
            clearInterval(gameInterval);
            alert("Game Over! Pontuação final: " + score);
            document.location.reload(); // Reinicia o jogo
        }
    }
}

// Função para atualizar o jogo
function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa a tela

    drawDino();
    moveDino();
    moveObstacles();
    drawObstacles();
    checkCollision();

    // Atualiza a pontuação na tela
    document.getElementById("score").textContent = score;
}

// Função que é chamada a cada 10ms
function gameLoop() {
    updateGame();
}

// Inicia o jogo
function startGame() {
    gameInterval = setInterval(gameLoop, 1000 / 60); // 60 FPS
}

// Função para o pulo (ativado quando o jogador pressiona a tecla "Space")
window.addEventListener("keydown", function (event) {
    if (event.code === "Space" && dino.y === canvas.height - 50) {
        isJumping = true;
    }
});

// Gera obstáculos a cada 2 segundos
setInterval(generateObstacle, 2000);

// Inicia o jogo
startGame();
