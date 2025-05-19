const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const GAME_SPEED = 2;

const PLAYER_WIDTH = 55;
const PLAYER_HEIGHT = 40;
let PLAYER_SPEED = 5;


const ENEMY_WIDTH = 40;
const ENEMY_HEIGHT = 40;
const DEFAULT_ENEMY_SPEED = 3;


const BULLET_WIDTH = 15;
const BULLET_HEIGHT = 6;
const BULLET_SPEED = 8;

const FORCE_SIZE = 30;

let playerX = 100;
let playerY = GAME_HEIGHT / 2;
let score = 0;
let gameOver = false;
let started = false;
let enemies = [];
let bullets = [];
let powerUps = [];
let bgElements = [];
let forceModule = null;
let chargingShot = false;
let chargeLevel = 0;
let gameLevel = 1;

let gameDifficulty = "medium";
let difficultySettings = {
  easy: {
    enemySpawnRate: 90,
    enemyHealth: 0.75,
    enemySpeed: 0.8,
    powerUpFrequency: 450,
    playerLives: 3,
    playerSpeed: 6
  },
  medium: {
    enemySpawnRate: 60,
    enemyHealth: 1,
    enemySpeed: 1,
    powerUpFrequency: 600,
    playerLives: 2,
    playerSpeed: 5
  },
  hard: {
    enemySpawnRate: 45,
    enemyHealth: 1.5,
    enemySpeed: 1.2,
    powerUpFrequency: 900,
    playerLives: 1,
    playerSpeed: 4
  }
};

let playerLives = 2; 

let music;
let deathSound;
let shootSound;
let powerUpSound;
let explosionSound;
let enemySprites = [];
let playerSprite;
let bulletSprite;
let forceSprite;
let backgroundImg;
let powerUpSprites = [];
let startVideo;
let bgX = 0;


let startMenu = true;
let difficultyMenu = false;
let leaderboardMenu = false;
let gameOverMenu = false;
let highScores = [];
let powerUpTypes = ["speed", "multishot", "force", "laser"];
let bulletType = "normal";

function preload() {

  music = loadSound("./sounds/r-type-theme.mp3");
  music.setVolume(0.02);
  
  deathSound = loadSound("./sounds/explosion.mp3");
  deathSound.setVolume(0.05);
  
  shootSound = loadSound("./sounds/shoot.mp3");
  shootSound.setVolume(0.05);
  
  powerUpSound = loadSound("./sounds/powerup.mp3");
  powerUpSound.setVolume(0.05);
  
  explosionSound = loadSound("./sounds/explosion.mp3");
  explosionSound.setVolume(0.03);
  

  playerSprite = loadImage("./images/playerShip.png");
  bulletSprite = loadImage("./images/bulletSprite.png");
  forceSprite = loadImage("./images/force.png");
  backgroundImg = loadImage("./images/space-bg.jpg");
  
  
  enemySprites.push(loadImage("./images/alien.png"));
  enemySprites.push(loadImage("./images/alien2.png"));
  enemySprites.push(loadImage("./images/alien3.png"));
  

  powerUpSprites.push(loadImage("./images/SpeedBoostPowerUp.png"));
  powerUpSprites.push(loadImage("./images/powerup-multishot.png"));
  powerUpSprites.push(loadImage("./images/powerup-force.png"));
  powerUpSprites.push(loadImage("./images/powerup-laser.png"));
  

  startVideo = createVideo("./js/r-type-intro.mp4");
  startVideo.hide();
}

function setup() {
  createCanvas(GAME_WIDTH, GAME_HEIGHT);
  frameRate(60);
  startVideo.loop();
  startVideo.volume(0);
  

  loadHighScores();
  

  createBackgroundElements();
}

function draw() {
  if (startMenu) {
    startMenuScreen();
  } else if (difficultyMenu) {
    difficultyMenuScreen();
  } else if (leaderboardMenu) {
    leaderboardScreen();
  } else if (gameOverMenu) {
    gameOverScreen();
  } else {
    gameLoop();
  }
}

function createBackgroundElements() {
  for (let i = 0; i < 100; i++) {
    bgElements.push({
      x: random(GAME_WIDTH),
      y: random(GAME_HEIGHT),
      size: random(1, 3),
      speed: random(0.5, 1.5),
      type: "star"
    });
  }
  
  for (let i = 0; i < 5; i++) {
    bgElements.push({
      x: random(GAME_WIDTH),
      y: random(GAME_HEIGHT),
      size: random(20, 50),
      speed: random(0.2, 0.8),
      type: "asteroid"
    });
  }
}

function startMenuScreen() {
  drawBackground();
  
  image(startVideo, 0, 0, GAME_WIDTH, GAME_HEIGHT);
  
  fill(255);
  textSize(40);
  textStyle(BOLD);
  text("R-TYPE DEFENDER", GAME_WIDTH / 2 - 180, GAME_HEIGHT / 2 - 100);
  textSize(18);
  text("Defend Earth against the Bydo Empire", GAME_WIDTH / 2 - 140, GAME_HEIGHT / 2 - 70);
  
  textSize(14);
  textStyle(NORMAL);
  text("Adapted by Ethan Davis", GAME_WIDTH / 2 - 80, GAME_HEIGHT / 2 + 170);
  
  fill(0, 255, 0, 200); 
  rect(GAME_WIDTH / 2 - 100, GAME_HEIGHT / 2 - 25, 200, 50, 10);
  fill(255);
  textSize(24);
  textStyle(BOLD);
  text("PLAY GAME", GAME_WIDTH / 2 - 60, GAME_HEIGHT / 2 + 5);
  
  fill(255, 165, 0, 200);
  rect(GAME_WIDTH / 2 - 100, GAME_HEIGHT / 2 + 35, 200, 50, 10);
  fill(255);
  textSize(24);
  textStyle(BOLD);
  text("DIFFICULTY", GAME_WIDTH / 2 - 60, GAME_HEIGHT / 2 + 65);
  
  fill(255, 255, 0, 200);
  rect(GAME_WIDTH / 2 - 100, GAME_HEIGHT / 2 + 95, 200, 50, 10);
  fill(255);
  textSize(24);
  textStyle(BOLD);
  text("LEADERBOARD", GAME_WIDTH / 2 - 85, GAME_HEIGHT / 2 + 125);
  
  textSize(16);
  textStyle(NORMAL);
  text("Current Difficulty: " + gameDifficulty.toUpperCase(), GAME_WIDTH / 2 - 90, GAME_HEIGHT - 75);
  
  textSize(16);
  textStyle(NORMAL);
  text("CONTROLS: Arrow keys to move, SPACE to shoot, SHIFT to charge", 
       GAME_WIDTH / 2 - 200, GAME_HEIGHT - 50);
  text("Z to detach/attach Force module", GAME_WIDTH / 2 - 100, GAME_HEIGHT - 30);
}

function difficultyMenuScreen() {
  drawBackground();
  
  fill(0, 0, 50, 240);
  rect(GAME_WIDTH / 2 - 250, GAME_HEIGHT / 2 - 200, 500, 400, 20);
  
  fill(255);
  textSize(36);
  textStyle(BOLD);
  text("DIFFICULTY SETTINGS", GAME_WIDTH / 2 - 180, GAME_HEIGHT / 2 - 150);
  
  fill(gameDifficulty === "easy" ? color(100, 255, 100, 200) : color(0, 255, 0, 150));
  rect(GAME_WIDTH / 2 - 200, GAME_HEIGHT / 2 - 100, 400, 60, 10);
  fill(255);
  textSize(28);
  textStyle(BOLD);
  text("EASY", GAME_WIDTH / 2 - 40, GAME_HEIGHT / 2 - 60);
  textSize(14);
  textStyle(NORMAL);
  text("Easy challenege for most players", GAME_WIDTH / 2 - 90, GAME_HEIGHT / 2 - 45);
  
  fill(gameDifficulty === "medium" ? color(255, 165, 100, 200) : color(255, 165, 0, 150));
  rect(GAME_WIDTH / 2 - 200, GAME_HEIGHT / 2 - 20, 400, 60, 10);
  fill(255);
  textSize(28);
  textStyle(BOLD);
  text("MEDIUM", GAME_WIDTH / 2 - 60, GAME_HEIGHT / 2 + 20);
  textSize(14);
  textStyle(NORMAL);
  text("Balanced challenge for most players", GAME_WIDTH / 2 - 90, GAME_HEIGHT / 2 + 35);
  
  fill(gameDifficulty === "hard" ? color(255, 100, 100, 200) : color(255, 0, 0, 150));
  rect(GAME_WIDTH / 2 - 200, GAME_HEIGHT / 2 + 60, 400, 60, 10);
  fill(255);
  textSize(28);
  textStyle(BOLD);
  text("HARD", GAME_WIDTH / 2 - 40, GAME_HEIGHT / 2 + 100);
  textSize(14);
  textStyle(NORMAL);
  text("Intense challenge, faster and tougher enemies", GAME_WIDTH / 2 - 120, GAME_HEIGHT / 2 + 115);
  
  fill(128, 128, 255, 200);
  rect(GAME_WIDTH / 2 - 100, GAME_HEIGHT / 2 + 150, 200, 50, 10);
  fill(255);
  textSize(24);
  textStyle(BOLD);
  text("BACK", GAME_WIDTH / 2 - 35, GAME_HEIGHT / 2 + 180);
}

function mousePressed() {
  if (startMenu) {
    if (GAME_WIDTH / 2 - 100 < mouseX && mouseX < GAME_WIDTH / 2 + 100 && 
        GAME_HEIGHT / 2 - 25 < mouseY && mouseY < GAME_HEIGHT / 2 + 25) {
      startMenu = false;
      difficultyMenu = false;
      leaderboardMenu = false;
      gameOverMenu = false;
      resetGame();
      applyDifficultySettings();
      music.loop(); 
      startVideo.stop();
    } 
    else if (GAME_WIDTH / 2 - 100 < mouseX && mouseX < GAME_WIDTH / 2 + 100 && 
             GAME_HEIGHT / 2 + 35 < mouseY && mouseY < GAME_HEIGHT / 2 + 85) {
      startMenu = false;
      difficultyMenu = true;
      startVideo.stop();
    }
    else if (GAME_WIDTH / 2 - 100 < mouseX && mouseX < GAME_WIDTH / 2 + 100 && 
             GAME_HEIGHT / 2 + 95 < mouseY && mouseY < GAME_HEIGHT / 2 + 145) {
      startMenu = false;
      leaderboardMenu = true;
      startVideo.stop();
    }
  } 
  else if (difficultyMenu) {
    if (GAME_WIDTH / 2 - 200 < mouseX && mouseX < GAME_WIDTH / 2 + 200 && 
        GAME_HEIGHT / 2 - 100 < mouseY && mouseY < GAME_HEIGHT / 2 - 40) {
      gameDifficulty = "easy";
    }
    else if (GAME_WIDTH / 2 - 200 < mouseX && mouseX < GAME_WIDTH / 2 + 200 && 
             GAME_HEIGHT / 2 - 20 < mouseY && mouseY < GAME_HEIGHT / 2 + 40) {
      gameDifficulty = "medium";
    }
    else if (GAME_WIDTH / 2 - 200 < mouseX && mouseX < GAME_WIDTH / 2 + 200 && 
             GAME_HEIGHT / 2 + 60 < mouseY && mouseY < GAME_HEIGHT / 2 + 120) {
      gameDifficulty = "hard";
    }
    else if (GAME_WIDTH / 2 - 100 < mouseX && mouseX < GAME_WIDTH / 2 + 100 && 
             GAME_HEIGHT / 2 + 150 < mouseY && mouseY < GAME_HEIGHT / 2 + 200) {
      difficultyMenu = false;
      startMenu = true;
      startVideo.loop();
      startVideo.volume(0);
    }
  } 
  else if (leaderboardMenu) {
    if (GAME_WIDTH / 2 - 100 < mouseX && mouseX < GAME_WIDTH / 2 + 100 && 
        GAME_HEIGHT / 2 + 150 < mouseY && mouseY < GAME_HEIGHT / 2 + 200) {
      leaderboardMenu = false;
      startMenu = true;
      startVideo.loop();
      startVideo.volume(0);
    }
  }
}

function applyDifficultySettings() {
  let settings = difficultySettings[gameDifficulty];
  playerLives = settings.playerLives;
  PLAYER_SPEED = settings.playerSpeed;
}

function addScoreToLeaderboard() {
  let playerName = prompt('Enter your name for the leaderboard:');
  if (playerName !== null && playerName.trim() !== '') {
    highScores.push({ 
      name: playerName, 
      score: score, 
      level: gameLevel,
      difficulty: gameDifficulty 
    });
    highScores.sort((a, b) => b.score - a.score);
    if (highScores.length > 10) {
      highScores.pop();
    }
    saveHighScores();
  }
}

function saveHighScores() {
  localStorage.setItem('rTypeHighScores', JSON.stringify(highScores));
}

function loadHighScores() {
  let storedHighScores = localStorage.getItem('rTypeHighScores');
  if (storedHighScores !== null) {
    highScores = JSON.parse(storedHighScores);
  }
}

function leaderboardScreen() {
  drawBackground();
  
  fill(0, 0, 50, 240);
  rect(GAME_WIDTH / 2 - 250, GAME_HEIGHT / 2 - 200, 500, 400, 20);
  
  fill(255);
  textSize(36);
  textStyle(BOLD);
  text("LEADERBOARD", GAME_WIDTH / 2 - 130, GAME_HEIGHT / 2 - 150);
  
  textSize(20);
  textStyle(BOLD);
  text("PILOT", GAME_WIDTH / 2 - 220, GAME_HEIGHT / 2 - 100);
  text("SCORE", GAME_WIDTH / 2 - 100, GAME_HEIGHT / 2 - 100);
  text("LEVEL", GAME_WIDTH / 2, GAME_HEIGHT / 2 - 100);
  text("DIFFICULTY", GAME_WIDTH / 2 + 80, GAME_HEIGHT / 2 - 100);
  
  stroke(100, 100, 255);
  line(GAME_WIDTH / 2 - 220, GAME_HEIGHT / 2 - 90, GAME_WIDTH / 2 + 220, GAME_HEIGHT / 2 - 90);
  noStroke();
  
  if (highScores.length === 0) {
    textAlign(CENTER);
    textSize(20);
    text("No scores yet. Be the first!", GAME_WIDTH / 2, GAME_HEIGHT / 2);
    textAlign(LEFT);
  } else {
    for (let i = 0; i < highScores.length; i++) {
      if (i < 10) {
        textSize(18);
        textStyle(NORMAL);
        fill(i === 0 ? color(255, 215, 0) : (i === 1 ? color(192) : (i === 2 ? color(176, 141, 87) : color(255))));
        text(`${i + 1}.`, GAME_WIDTH / 2 - 230, GAME_HEIGHT / 2 - 60 + i * 30);
        text(`${highScores[i].name}`, GAME_WIDTH / 2 - 200, GAME_HEIGHT / 2 - 60 + i * 30);
        text(`${highScores[i].score}`, GAME_WIDTH / 2 - 100, GAME_HEIGHT / 2 - 60 + i * 30);
        text(`${highScores[i].level || 1}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 - 60 + i * 30);
        
        let diff = highScores[i].difficulty || "medium";
        text(`${diff.toUpperCase()}`, GAME_WIDTH / 2 + 80, GAME_HEIGHT / 2 - 60 + i * 30);
      }
    }
  }
  
  fill(255, 0, 0, 200);
  rect(GAME_WIDTH / 2 - 100, GAME_HEIGHT / 2 + 150, 200, 50, 10);
  fill(255);
  textSize(24);
  textStyle(BOLD);
  text("BACK", GAME_WIDTH / 2 - 35, GAME_HEIGHT / 2 + 180);
}

function resetGame() {
  playerX = 100;
  playerY = GAME_HEIGHT / 2;
  score = 0;
  gameOver = false;
  enemies = [];
  bullets = [];
  powerUps = [];
  forceModule = null;
  bulletType = "normal";
  gameLevel = 1;
  bgX = 0;
  applyDifficultySettings();
}

function drawBackground() {

  image(backgroundImg, bgX, 0, GAME_WIDTH, GAME_HEIGHT);
  image(backgroundImg, bgX + GAME_WIDTH, 0, GAME_WIDTH, GAME_HEIGHT);
  
  bgX -= GAME_SPEED;
  if (bgX <= -GAME_WIDTH) {
    bgX = 0;
  }
  
  for (let element of bgElements) {
    if (element.type === "star") {
      fill(255);
      noStroke();
      ellipse(element.x, element.y, element.size, element.size);
      
      element.x -= element.speed;
      
      if (element.x < 0) {
        element.x = GAME_WIDTH;
        element.y = random(GAME_HEIGHT);
      }
    } else if (element.type === "asteroid") {
      fill(100, 100, 100, 150);
      noStroke();
      ellipse(element.x, element.y, element.size, element.size);
      
      element.x -= element.speed;
      
      if (element.x < -element.size) {
        element.x = GAME_WIDTH + element.size;
        element.y = random(GAME_HEIGHT);
        element.size = random(20, 50);
      }
    }
  }
}

function gameLoop() {
  drawBackground();
  
  let settings = difficultySettings[gameDifficulty];
  
  if (frameCount % (settings.enemySpawnRate - min(gameLevel * 3, 30)) === 0) {
    spawnEnemy();
  }

  if (frameCount % 600 == 0) {
    spawnWave();
  }
  
  if (frameCount % settings.powerUpFrequency === 0) {
    spawnPowerUp();
  }

  updatePlayer();
  
  updateBullets();
  
  updateEnemies();
  
  updatePowerUps();
  
  if (forceModule) {
    updateForceModule();
  }
  
  if (score > 0 && score % 500 === 0) {
    gameLevel = floor(score / 500) + 1;
  }
  
  drawHUD();
}

function spawnEnemy() {
  let enemyType = floor(random(enemySprites.length));
  let movementPattern = floor(random(4));
  let settings = difficultySettings[gameDifficulty];
  let speed = DEFAULT_ENEMY_SPEED * settings.enemySpeed + random(-0.5, 0.5);
  
  enemies.push({
    x: GAME_WIDTH,
    y: random(50, GAME_HEIGHT - 50),
    width: ENEMY_WIDTH,
    height: ENEMY_HEIGHT,
    type: enemyType,
    speed: speed,
    movementPattern: movementPattern,
    health: (enemyType + 1) * settings.enemyHealth,
    angle: 0,
    fireRate: random(80, 200) / settings.enemySpeed,
    lastShot: frameCount
  });
}

function spawnPowerUp() {
  let type = random(powerUpTypes);
  let spriteIndex = powerUpTypes.indexOf(type);
  
  powerUps.push({
    x: GAME_WIDTH,
    y: random(50, GAME_HEIGHT - 50),
    width: 30,
    height: 30,
    type: type,
    sprite: powerUpSprites[spriteIndex],
    speed: 2
  });
}

function updatePlayer() {
  push();
  translate(playerX, playerY);
  if (chargingShot) {
    stroke(0, 255, 255, 150);
    strokeWeight(3 + chargeLevel/10);
    noFill();
    ellipse(0, 0, PLAYER_WIDTH + chargeLevel/2, PLAYER_HEIGHT + chargeLevel/2);
  }
  imageMode(CENTER);
  image(playerSprite, 0, 0, PLAYER_WIDTH, PLAYER_HEIGHT);
  imageMode(CORNER);
  pop();
  
  if (keyIsDown(UP_ARROW) && playerY > PLAYER_HEIGHT/2) {
    playerY -= PLAYER_SPEED;
  }
  if (keyIsDown(DOWN_ARROW) && playerY < GAME_HEIGHT - PLAYER_HEIGHT/2) {
    playerY += PLAYER_SPEED;
  }
  if (keyIsDown(LEFT_ARROW) && playerX > PLAYER_WIDTH/2) {
    playerX -= PLAYER_SPEED;
  }
  if (keyIsDown(RIGHT_ARROW) && playerX < GAME_WIDTH/2) {
    playerX += PLAYER_SPEED;
  }
  
  if (keyIsDown(SHIFT) && !chargingShot) {
    chargingShot = true;
    chargeLevel = 0;
  }
  
  if (chargingShot) {
    chargeLevel = min(chargeLevel + 1, 100);
  }
}

function updateBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    let bullet = bullets[i];
    
    bullet.x += bullet.speed;
    
    if (bullet.type === "normal") {
      image(bulletSprite, bullet.x, bullet.y, bullet.width, bullet.height);
    } else if (bullet.type === "laser") {
      fill(0, 255, 255);
      rect(bullet.x, bullet.y, bullet.width + 10, bullet.height - 2);
      fill(255);
      rect(bullet.x, bullet.y + 1, bullet.width, bullet.height - 4);
    } else if (bullet.type === "force") {
      fill(255, 128, 0);
      ellipse(bullet.x, bullet.y, bullet.width, bullet.height);
    } else if (bullet.type === "charged") {
      fill(255, 0, 128);
      ellipse(bullet.x, bullet.y, bullet.width, bullet.height);
      noFill();
      stroke(255, 0, 128, 150);
      strokeWeight(2);
      ellipse(bullet.x, bullet.y, bullet.width + 10, bullet.height + 10);
      noStroke();
    }
    
    if (bullet.x > GAME_WIDTH) {
      bullets.splice(i, 1);
    } else {
      for (let j = enemies.length - 1; j >= 0; j--) {
        let enemy = enemies[j];
        if (collideRectRect(bullet.x, bullet.y, bullet.width, bullet.height,
                           enemy.x, enemy.y, enemy.width, enemy.height)) {
          
          let damage = 1;
          if (bullet.type === "laser") damage = 2;
          if (bullet.type === "charged") damage = min(5, floor(bullet.charge / 20) + 1);
          
          enemy.health -= damage;
          
          if (bullet.type !== "laser") {
            bullets.splice(i, 1);
          }
          
          if (enemy.health <= 0) {
            score += (enemy.type + 1) * 10;
            explosionSound.play();
            

            let dropChance = gameDifficulty === "easy" ? 0.15 : (gameDifficulty === "medium" ? 0.1 : 0.07);
            if (random() < dropChance) {
              let type = random(powerUpTypes);
              let spriteIndex = powerUpTypes.indexOf(type);
              
              powerUps.push({
                x: enemy.x,
                y: enemy.y,
                width: 30,
                height: 30,
                type: type,
                sprite: powerUpSprites[spriteIndex],
                speed: 2
              });
            }
            
            enemies.splice(j, 1);
          }
          
          break;
        }
      }
    }
  }
}

function updateEnemies() {
  let settings = difficultySettings[gameDifficulty];

  for (let i = enemies.length - 1; i >= 0; i--) {
    let enemy = enemies[i];
    
    switch(enemy.movementPattern) {
      case 0: 
        enemy.x -= enemy.speed;
        break;
      case 1: // Sine wave
        enemy.x -= enemy.speed;
        enemy.y += sin(frameCount * 0.05) * 2;
        break;
      case 2: // Homing toward player
        enemy.x -= enemy.speed * 0.8;
        if (playerY < enemy.y) enemy.y -= enemy.speed * 0.3;
        if (playerY > enemy.y) enemy.y += enemy.speed * 0.3;
        break;
      case 3: // Circular
        enemy.x -= enemy.speed * 0.8;
        enemy.angle += 0.05;
        enemy.y += sin(enemy.angle) * 2;
        break;
    }
    
    if (enemy.type > 0 && frameCount - enemy.lastShot > enemy.fireRate) {
      let angle = atan2(playerY - enemy.y, playerX - enemy.x);
      let enemyBullet = {
        x: enemy.x,
        y: enemy.y,
        width: 10,
        height: 5,
        speed: -5 * settings.enemySpeed,
        angle: angle,
        type: "enemy"
      };
      bullets.push(enemyBullet);
      enemy.lastShot = frameCount;
    }
    
    image(enemySprites[enemy.type], enemy.x, enemy.y, enemy.width, enemy.height);
    
    if (enemy.x < -enemy.width) {
      enemies.splice(i, 1);
    } else {
      if (collideRectRect(playerX - PLAYER_WIDTH/2, playerY - PLAYER_HEIGHT/2, 
                         PLAYER_WIDTH, PLAYER_HEIGHT,
                         enemy.x, enemy.y, enemy.width, enemy.height)) {
        handlePlayerHit();
      }
    }
  }
}

function updatePowerUps() {
  for (let i = powerUps.length - 1; i >= 0; i--) {
    let powerUp = powerUps[i];
    
    powerUp.x -= powerUp.speed;
    
    image(powerUp.sprite, powerUp.x, powerUp.y, powerUp.width, powerUp.height);
    
    if (frameCount % 10 < 5) {
      noFill();
      stroke(255, 255, 255, 150);
      strokeWeight(2);
      ellipse(powerUp.x + powerUp.width/2, powerUp.y + powerUp.height/2, 
              powerUp.width * 1.5, powerUp.height * 1.5);
      noStroke();
    }
    
    if (powerUp.x < -powerUp.width) {
      powerUps.splice(i, 1);
    } else {
      if (collideRectRect(playerX - PLAYER_WIDTH/2, playerY - PLAYER_HEIGHT/2, 
                         PLAYER_WIDTH, PLAYER_HEIGHT,
                         powerUp.x, powerUp.y, powerUp.width, powerUp.height)) {
        applyPowerUp(powerUp.type);
        powerUpSound.play();
        powerUps.splice(i, 1);
      }
    }
  }
}

function updateForceModule() {
  if (forceModule.attached) {
    if (forceModule.position === "front") {
      forceModule.x = playerX + PLAYER_WIDTH/2;
      forceModule.y = playerY;
    } else if (forceModule.position === "back") {
      forceModule.x = playerX - PLAYER_WIDTH/2;
      forceModule.y = playerY;
    } else if (forceModule.position === "top") {
      forceModule.x = playerX;
      forceModule.y = playerY - PLAYER_HEIGHT/2;
    } else if (forceModule.position === "bottom") {
      forceModule.x = playerX;
      forceModule.y = playerY + PLAYER_HEIGHT/2;
    }
  } else {

    forceModule.x += 3;
    
    forceModule.y += Math.sin(frameCount * 0.05) * 1.5;
    
    if (forceModule.y < 0) forceModule.y = 0;
    if (forceModule.y > GAME_HEIGHT) forceModule.y = GAME_HEIGHT;
    
    if (forceModule.x > GAME_WIDTH) {
      forceModule.x = 0;
    }
    
    if (dist(forceModule.x, forceModule.y, playerX, playerY) < PLAYER_WIDTH && 
        frameCount > forceModule.detachTime + 60) {
      forceModule.attached = true;
      forceModule.position = "front";
    }
  }
  
  image(forceSprite, forceModule.x - FORCE_SIZE/2, forceModule.y - FORCE_SIZE/2, 
        FORCE_SIZE, FORCE_SIZE);
  
  if (frameCount % 10 === 0) {
    bullets.push({
      x: forceModule.x + FORCE_SIZE/2,
      y: forceModule.y,
      width: BULLET_WIDTH,
      height: BULLET_HEIGHT,
      speed: BULLET_SPEED,
      type: "force"
    });
  }
}

function applyPowerUp(type) {
  switch(type) {
    case "speed":
      PLAYER_SPEED = min(PLAYER_SPEED + 1, 10);
      break;
    case "multishot":
      bulletType = "multishot";
      break;
    case "force":
      if (!forceModule) {
        forceModule = {
          x: playerX + PLAYER_WIDTH/2,
          y: playerY,
          attached: true,
          position: "front",
          detachTime: 0
        };
      }
      break;
    case "laser":
      bulletType = "laser";
      break;
  }
}

function handlePlayerHit() {
  deathSound.play();
  music.stop();
  gameOver = true;
  gameOverMenu = true;
  noLoop();
}

function drawHUD() {
  fill(255);
  textSize(20);
  text(`SCORE: ${score}`, 20, 30);
  
  text(`LEVEL: ${gameLevel}`, 20, 60);
  
  if (chargingShot) {
    fill(50);
    rect(20, GAME_HEIGHT - 40, 200, 20);
    fill(255, 0, 0);
    rect(20, GAME_HEIGHT - 40, chargeLevel * 2, 20);
    fill(255);
    text("CHARGE", 20, GAME_HEIGHT - 50);
  }
  
  let powerUpText = "POWER-UPS: ";
  if (bulletType !== "normal") powerUpText += bulletType + " ";
  if (forceModule) powerUpText += "force ";
  if (PLAYER_SPEED > 5) powerUpText += "speed(" + (PLAYER_SPEED - 5) + ") ";
  
  textSize(16);
  text(powerUpText, 20, 90);
}

function gameOverScreen() {
  background(0);
  fill(255, 0, 0);
  textSize(48);
  textStyle(BOLD);
  text("GAME OVER", GAME_WIDTH / 2 - 150, GAME_HEIGHT / 2 - 50);
  
  fill(255);
  textSize(24);
  text(`FINAL SCORE: ${score}`, GAME_WIDTH / 2 - 100, GAME_HEIGHT / 2);
  text(`LEVEL REACHED: ${gameLevel}`, GAME_WIDTH / 2 - 100, GAME_HEIGHT / 2 + 40);
  
  fill(0, 255, 0);
  textSize(20);
  text("PRESS 'S' TO SAVE SCORE AND RETURN TO MENU", GAME_WIDTH / 2 - 220, GAME_HEIGHT / 2 + 100);
}

function keyPressed() {
  if (key === ' ' && !gameOverMenu) {
    if (chargingShot) {
      bullets.push({
        x: playerX + PLAYER_WIDTH/2,
        y: playerY,
        width: 20,
        height: 20,
        speed: BULLET_SPEED,
        type: "charged",
        charge: chargeLevel
      });
      chargingShot = false;
      chargeLevel = 0;
    } else {
      if (bulletType === "multishot") {
        for (let angle = -15; angle <= 15; angle += 15) {
          let rad = radians(angle);
          bullets.push({
            x: playerX + PLAYER_WIDTH/2,
            y: playerY,
            width: BULLET_WIDTH,
            height: BULLET_HEIGHT,
            speed: BULLET_SPEED,
            type: "normal",
            vx: BULLET_SPEED * cos(rad),
            vy: BULLET_SPEED * sin(rad)
          });
        }
      } else if (bulletType === "laser") {
        bullets.push({
          x: playerX + PLAYER_WIDTH/2,
          y: playerY - 2,
          width: 30,
          height: 4,
          speed: BULLET_SPEED * 1.5,
          type: "laser"
        });
      } else {
        bullets.push({
          x: playerX + PLAYER_WIDTH/2,
          y: playerY,
          width: BULLET_WIDTH,
          height: BULLET_HEIGHT,
          speed: BULLET_SPEED,
          type: "normal"
        });
      }
      shootSound.play();
    }
  }
  
  if (key === 'z' || key === 'Z') {
    if (forceModule) {
      forceModule.attached = !forceModule.attached;
      
      if (!forceModule.attached) {
        forceModule.detachTime = frameCount;
      }
      
      if (forceModule.attached) {
        if (forceModule.position === "front") {
          forceModule.position = "back";
        } else if (forceModule.position === "back") {
          forceModule.position = "top";
        } else if (forceModule.position === "top") {
          forceModule.position = "bottom";
        } else {
          forceModule.position = "front";
        }
      }
    }
  }
  
  if ((key === 's' || key === 'S') && gameOverMenu) {
    gameOverMenu = false;
    startMenu = true;
    addScoreToLeaderboard();
    resetGame();
    startVideo.loop();
    startVideo.volume(0);
    loop();
  }
}

function keyReleased() {
  if (keyCode === SHIFT) {
    if (chargingShot) {
      bullets.push({
        x: playerX + PLAYER_WIDTH/2,
        y: playerY,
        width: 20,
        height: 20,
        speed: BULLET_SPEED,
        type: "charged",
        charge: chargeLevel
      });
      
      if (chargeLevel >= 100) {
        for (let angle = -30; angle <= 30; angle += 30) {
          if (angle === 0) continue; 
          let rad = radians(angle);
          bullets.push({
            x: playerX + PLAYER_WIDTH/2,
            y: playerY,
            width: 15,
            height: 15,
            speed: BULLET_SPEED * 0.8,
            type: "charged",
            charge: chargeLevel * 0.7,
            vx: BULLET_SPEED * 0.8 * cos(rad),
            vy: BULLET_SPEED * 0.8 * sin(rad)
          });
        }
      }
      
      shootSound.play();
      chargingShot = false;
      chargeLevel = 0;
    }
  }
}

function collideRectRect(x1, y1, w1, h1, x2, y2, w2, h2) {
  return x1 < x2 + w2 &&
         x1 + w1 > x2 &&
         y1 < y2 + h2 &&
         y1 + h1 > y2;
}

function spawnWave() {
  let waveType = floor(random(5));
  
  switch(waveType) {
    case 0:
      for (let i = 0; i < 5; i++) {
        enemies.push({
          x: GAME_WIDTH + i * 50,
          y: GAME_HEIGHT/2,
          width: ENEMY_WIDTH,
          height: ENEMY_HEIGHT,
          type: floor(random(enemySprites.length)),
          speed: DEFAULT_ENEMY_SPEED,
          movementPattern: 0,
          health: 2,
          angle: 0,
          fireRate: random(100, 200),
          lastShot: frameCount
        });
      }
      break;
      
    case 1:
      for (let i = 0; i < 5; i++) {
        enemies.push({
          x: GAME_WIDTH - i * 30,
          y: 100 + abs(i - 2) * 50,
          width: ENEMY_WIDTH,
          height: ENEMY_HEIGHT,
          type: floor(random(enemySprites.length)),
          speed: DEFAULT_ENEMY_SPEED - 1,
          movementPattern: 1,
          health: 2,
          angle: 0,
          fireRate: random(100, 200),
          lastShot: frameCount
        });
      }
      break;
      
    case 2: // Circle formation
      for (let i = 0; i < 8; i++) {
        let angle = i * (TWO_PI / 8);
        enemies.push({
          x: GAME_WIDTH + cos(angle) * 100,
          y: GAME_HEIGHT/2 + sin(angle) * 100,
          width: ENEMY_WIDTH,
          height: ENEMY_HEIGHT,
          type: floor(random(enemySprites.length)),
          speed: DEFAULT_ENEMY_SPEED - 1,
          movementPattern: 3,
          health: 2,
          angle: angle,
          fireRate: random(100, 200),
          lastShot: frameCount
        });
      }
      break;
      
    case 3: // Snake formation
      for (let i = 0; i < 10; i++) {
        enemies.push({
          x: GAME_WIDTH + i * 40,
          y: GAME_HEIGHT/2,
          width: ENEMY_WIDTH,
          height: ENEMY_HEIGHT,
          type: floor(random(enemySprites.length)),
          speed: DEFAULT_ENEMY_SPEED - 0.5,
          movementPattern: 1,
          health: 1,
          angle: i * 0.5,
          fireRate: random(100, 200),
          lastShot: frameCount
        });
      }
      break;
      
    case 4: // Boss wave
      if (gameLevel % 5 === 0) {
        spawnBoss();
      } else {
        for (let i = 0; i < 3; i++) {
          spawnEnemy();
        }
      }
      break;
  }
}

function spawnBoss() {
  enemies.push({
    x: GAME_WIDTH,
    y: GAME_HEIGHT/2,
    width: ENEMY_WIDTH * 3,
    height: ENEMY_HEIGHT * 3,
    type: min(floor(gameLevel / 5) - 1, enemySprites.length - 1),
    speed: 1,
    movementPattern: 1,
    health: 20 + (gameLevel * 5),
    isBoss: true,
    angle: 0,
    fireRate: 60,
    lastShot: frameCount
  });
}


function loadEnemyData(data) {

  enemyData = data;

}


function videoEnded() {
  if (startMenu) {
    startVideo.loop();
  }
}