// Game configuration
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const ROAD_WIDTH = 600;
const ROAD_COLOR = 50;

// Car properties
const CAR_WIDTH = 40;
const CAR_HEIGHT = 55;
const CAR_SPEED = 5;

// Enemy car properties
const ENEMY_CAR_WIDTH = 40;
const ENEMY_CAR_HEIGHT = 55;
const ENEMY_CAR_SPEED = 8;

// Hedge properties
const HEDGE_WIDTH = 50;
const HEDGE_HEIGHT = 200;
const HEDGE_SPEED = 8;

// Game variables
let playerX = GAME_WIDTH / 2;
let playerY = GAME_HEIGHT - CAR_HEIGHT;
let score = 0;
let gameOver = false;
let started = false;
let enemyCars = [];
let hedges = [];
let bullets = [];
let music;
let deathSound;
let EnemyCarRed;
let EnemyCarYellow;
let EnemyPolice;
let playerCarSprite;
let crashVideo;
let carSpeed = 10;
let startMenu = false;
let leaderboardMenu = false;
let gameOverMenu = false;
let highScores = [];
let videoPlayed = false;

function preload() {
  music = loadSound("./js/phonk-phonk-2025-mix-313052.mp3");
  music.setVolume(0.5); // Set the music volume to 50%
  
  deathSound = loadSound("./js/death-sound.mp3");
  deathSound.setVolume(0.01); // Set the death sound effect volume to 1%
  
  EnemyCarRed = loadImage("./images/EnemyCarRed.png");
  EnemyCarYellow = loadImage("./images/EnemyCarYellow.png");
  EnemyPolice = loadImage("./images/EnemyPolice.png");
  playerCarSprite = loadImage("./images/PlayerCar.png");
  crashVideo = createVideo("./js/StartVideo.mp4");
  crashVideo.hide();

  BMWCrashGUI = loadImage("./images/BMWCrashGUI.jpg");
}

function setup() {
  createCanvas(GAME_WIDTH, GAME_HEIGHT);
  frameRate(60);
  crashVideo.show();
  crashVideo.play();
  crashVideo.onended(() => {
    videoPlayed = true;
    startMenu = true;
    crashVideo.hide();
  });

  // Initialize hedges
  for (let i = 0; i < 2; i++) {
    hedges.push({
      x: i === 0 ? 50 : 700,
      y: i === 0 ? 0 : -200,
      speed: HEDGE_SPEED,
      draw: function() {
        fill(0, 128, 0);
        rect(this.x, this.y, HEDGE_WIDTH, HEDGE_HEIGHT);
      },
      move: function() {
        this.y += this.speed;
        if (this.y > GAME_HEIGHT) {
          this.y = -200;
        }
      }
    });
  }

  // Initialize high scores
  highScores = JSON.parse(localStorage.getItem("highScores")) || [];
}

function draw() {
  if (videoPlayed) {
    if (startMenu) {
      startMenuScreen();
    } else if (leaderboardMenu) {
      leaderboardScreen();
    } else if (gameOverMenu) {
      gameOverScreen();
    } else {
      gameLoop();
    }
  }
}

// Rest of the code remains the same

function startMenuScreen() {
  image(BMWCrashGUI, 0, 0, GAME_WIDTH, GAME_HEIGHT);

  // Draw title
  fill(255);
  textSize(32);
  text("Average BMW Driver Game", GAME_WIDTH / 2 - 150, GAME_HEIGHT / 2 - 100);
  textSize(18);
  text("Don't Crash or You Violate the Law", GAME_WIDTH / 2 - 120, GAME_HEIGHT / 2 - 70);

  // Draw credits
  textSize(14);
  text("Created by Ethan Davis", GAME_WIDTH / 2 - 80, GAME_HEIGHT / 2 + 120);

  // Draw start button
  fill(0, 255, 0); // Green
  rect(GAME_WIDTH / 2 - 100, GAME_HEIGHT / 2 - 25, 200, 50);
  fill(255);
  textSize(24);
  text("Start", GAME_WIDTH / 2 - 35, GAME_HEIGHT / 2);

  // Draw leaderboard button
  fill(255, 255, 0); // Yellow
  rect(GAME_WIDTH / 2 - 100, GAME_HEIGHT / 2 + 50, 200, 50);
  fill(255);
  textSize(24);
  text("Leaderboard", GAME_WIDTH / 2 - 75, GAME_HEIGHT / 2 + 75);
}

function mousePressed() {
  if (startMenu) {
    if (GAME_WIDTH / 2 - 100 < mouseX && mouseX < GAME_WIDTH / 2 + 100 && GAME_HEIGHT / 2 - 25 < mouseY && mouseY < GAME_HEIGHT / 2 + 25) {
      startMenu = false;
      music.loop();
    } else if (GAME_WIDTH / 2 - 100 < mouseX && mouseX < GAME_WIDTH / 2 + 100 && GAME_HEIGHT / 2 + 50 < mouseY && mouseY < GAME_HEIGHT / 2 + 100) {
      startMenu = false;
      leaderboardMenu = true;
    }
  } else if (leaderboardMenu) {
    if (GAME_WIDTH / 2 - 100 < mouseX && mouseX < GAME_WIDTH / 2 + 100 && GAME_HEIGHT / 2 + 150 < mouseY && mouseY < GAME_HEIGHT / 2 + 200) {
      leaderboardMenu = false;
      startMenu = true;
    }
  }
}

function leaderboardScreen() {
  background(135, 206, 235); // Sky blue

  // Draw title
  fill(255);
  textSize(32);
  text("Leaderboard", GAME_WIDTH / 2 - 75, GAME_HEIGHT / 2 - 100);

  // Draw high scores
  textSize(24);
  for (let i = 0; i < highScores.length; i++) {
    text(`${i + 1}. ${highScores[i].name} - ${highScores[i].score}`, GAME_WIDTH / 2 - 150, GAME_HEIGHT / 2 - 50 + i * 30);
  }

  // Draw back button
  fill(255, 0, 0); // Red
  rect(GAME_WIDTH / 2 - 100, GAME_HEIGHT / 2 + 150, 200, 50);
  fill(255);
  textSize(24);
  text("Back", GAME_WIDTH / 2 - 30, GAME_HEIGHT / 2 + 175);
}

function gameLoop() {
  background(135, 206, 235); // Sky blue

  // Draw road
  fill(ROAD_COLOR);
  rect((GAME_WIDTH - ROAD_WIDTH) / 2, 0, ROAD_WIDTH, GAME_HEIGHT);

  // Draw road lines
  stroke(255);
  let laneWidth = ROAD_WIDTH / 4;
  for (let i = 0; i < GAME_HEIGHT; i += 50) {
    line((GAME_WIDTH - ROAD_WIDTH) / 2 + laneWidth, i, (GAME_WIDTH - ROAD_WIDTH) / 2 + laneWidth, i + 20); // Lane 1
    line((GAME_WIDTH - ROAD_WIDTH) / 2 + laneWidth * 2, i, (GAME_WIDTH - ROAD_WIDTH) / 2 + laneWidth * 2, i + 20); // Lane 2
    line((GAME_WIDTH - ROAD_WIDTH) / 2 + laneWidth * 3, i, (GAME_WIDTH - ROAD_WIDTH) / 2 + laneWidth * 3, i + 20); // Lane 3
  }

  // Move and draw player car
  image(playerCarSprite, playerX, playerY, CAR_WIDTH, CAR_HEIGHT);

  // Move player car
  if (keyIsDown(RIGHT_ARROW) && playerX < (GAME_WIDTH - ROAD_WIDTH) / 2 + ROAD_WIDTH - CAR_WIDTH) {
    playerX += carSpeed;
  }
  if (keyIsDown(LEFT_ARROW) && playerX > (GAME_WIDTH - ROAD_WIDTH) / 2) {
    playerX -= carSpeed;
  }
  if (keyIsDown(UP_ARROW) && playerY > 0) {
    playerY -= carSpeed;
  }
  if (keyIsDown(DOWN_ARROW) && playerY < GAME_HEIGHT - CAR_HEIGHT) {
    playerY += carSpeed;
  }

  // Speed up and slow down
  if (keyIsDown(87) && carSpeed < 20) {
    carSpeed += 1;
  }
  if (keyIsDown(83) && carSpeed > 5) {
    carSpeed -= 1;
  }

  // Update and draw enemy cars
  if (frameCount % 60 === 0) {
    let lane = floor(random(4));
    let newX = (GAME_WIDTH - ROAD_WIDTH) / 2 + lane * (ROAD_WIDTH / 4) + (ROAD_WIDTH / 8) - (ENEMY_CAR_WIDTH / 2);
    let newY = -ENEMY_CAR_HEIGHT;
    let enemySprite;

    let enemyType = random(["red", "yellow", "police"]);
    if (enemyType === "red") {
      enemySprite = EnemyCarRed;
    } else if (enemyType === "yellow") {
      enemySprite = EnemyCarYellow;
    } else if (enemyType === "police") {
      enemySprite = EnemyPolice;
    }

    enemyCars.push({
      x: newX,
      y: newY,
      speed: ENEMY_CAR_SPEED,
      sprite: enemySprite,
      draw: function() {
        image(this.sprite, this.x, this.y, ENEMY_CAR_WIDTH, ENEMY_CAR_HEIGHT);
      },
      move: function() {
        this.y += this.speed;
        if (this.y > GAME_HEIGHT) {
          this.y = -ENEMY_CAR_HEIGHT;
          let lane = floor(random(4));
          this.x = (GAME_WIDTH - ROAD_WIDTH) / 2 + lane * (ROAD_WIDTH / 4) + (ROAD_WIDTH / 8) - (ENEMY_CAR_WIDTH / 2);
        }
      }
    });
  }

  for (let enemy of enemyCars) {
    enemy.move();
    enemy.draw();

// Collision detection
for (let enemy of enemyCars) {
  if (
    playerX + CAR_WIDTH > enemy.x &&
    playerX < enemy.x + ENEMY_CAR_WIDTH &&
    playerY + CAR_HEIGHT > enemy.y &&
    playerY < enemy.y + ENEMY_CAR_HEIGHT
  ) {
    gameOverMenu = true;
    crashVideo.show();
    crashVideo.play();
    music.stop(); // Stop the phonk music
    setTimeout(() => {
      crashVideo.hide();
      crashVideo.pause();
      crashVideo.currentTime = 0;
    }, crashVideo.duration() * 1000);
    noLoop(); // Stop the game loop
  }
}
  }

  // Move and draw hedges
  for (let hedge of hedges) {
    hedge.move();
    hedge.draw();
  }

  // Move and draw bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].move();
    bullets[i].draw();

// Check collision with enemy cars
enemyCars = enemyCars.filter((enemy, index) => {
  if (
    bullets.some((bullet) =>
      bullet.collidesWith({ x: enemy.x, y: enemy.y, width: ENEMY_CAR_WIDTH, height: ENEMY_CAR_HEIGHT })
    )
  ) {
    score += 10;
    return false;
  }
  return true;
});

    // Remove bullet if it goes off screen
    if (bullets[i].y < 0) {
      bullets.splice(i, 1);
    }
  }

  // Display score
  fill(255);
  textSize(32);
  text(`Score: ${score}`, 20, 40);
}

function keyPressed() {
  if (key === ' ') {
    // Shoot bullet
    bullets.push(new Bullet(playerX, playerY));
  }
  if (key === 's' || key === 'S') {
    if (gameOver) {
      gameOver = false;
      startMenu = true;
      score = 0;
      playerX = GAME_WIDTH / 2;
      playerY = GAME_HEIGHT - CAR_HEIGHT;
      enemyCars = [];
      hedges = [];
      bullets = [];
      music.loop(); // Restart the phonk music
      crashVideo.stop(); // Stop the video
      loop(); // Restart the draw loop
    }
  }
}

function gameOverScreen() {
  background(255, 0, 0); // Red background on collision
  fill(255);
  textSize(32);
  text("You Lose!", GAME_WIDTH / 2 - 75, GAME_HEIGHT / 2);
  textSize(24);
  text("Taking you back to the start menu...", GAME_WIDTH / 2 - 150, GAME_HEIGHT / 2 + 40);

  // Save high score
  let playerName = "Player";
  let playerScore = score;
  let newHighScore = { name: playerName, score: playerScore };

  highScores.push(newHighScore);
  highScores.sort((a, b) => b.score - a.score);
  highScores = highScores.slice(0, 5);
  localStorage.setItem("highScores", JSON.stringify(highScores));

  // Take the player back to the start menu after a short delay
  setTimeout(() => {
    gameOver = false;
    startMenu = true;
    score = 0;
    playerX = GAME_WIDTH / 2;
    playerY = GAME_HEIGHT - CAR_HEIGHT;
    enemyCars = [];
    hedges = [];
    bullets = [];
    music.loop(); // Restart the phonk music
  }, 3000); // Delay for 3 seconds
}

class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 10;
    this.width = 10;
    this.height = 20;
  }

  move() {
    this.y -= this.speed;
  }

  draw() {
    fill(255, 0, 0);
    rect(this.x, this.y, this.width, this.height);
  }

  collidesWith(enemyCar) {
    return (
      this.x + this.width > enemyCar.x &&
      this.x < enemyCar.x + ENEMY_CAR_WIDTH &&
      this.y + this.height > enemyCar.y &&
      this.y < enemyCar.y + ENEMY_CAR_HEIGHT
    );
  }
}