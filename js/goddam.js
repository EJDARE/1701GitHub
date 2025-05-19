// Game configuration
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const GAME_SPEED = 2; // Background scroll speed

// Player properties
const PLAYER_WIDTH = 55;
const PLAYER_HEIGHT = 40;
const PLAYER_SPEED = 5;

// Enemy properties
const ENEMY_WIDTH = 40;
const ENEMY_HEIGHT = 40;
const DEFAULT_ENEMY_SPEED = 3;

// Bullet properties
const BULLET_WIDTH = 15;
const BULLET_HEIGHT = 6;
const BULLET_SPEED = 8;

// Force (R-Type power-up) properties
const FORCE_SIZE = 30;

// Game variables
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

// Asset variables
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

// Game state
let startMenu = true;
let leaderboardMenu = false;
let gameOverMenu = false;
let highScores = [];
let powerUpTypes = ["speed", "multishot", "force", "laser"];
let bulletType = "normal";

function preload() {
  // Load sounds
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
  
  // Load images
  playerSprite = loadImage("./images/playerShip.png");
  bulletSprite = loadImage("./images/bulletSprite.png");
  forceSprite = loadImage("./images/force.png");
  backgroundImg = loadImage("./images/space-bg.jpg");
  
  // Load enemy sprites
  enemySprites.push(loadImage("./images/alien.png"));
  enemySprites.push(loadImage("./images/alien.png"));
  enemySprites.push(loadImage("./images/alien.png"));
  
  // Load power-up sprites
  powerUpSprites.push(loadImage("./images/SpeedBoostPowerUp.png"));
  powerUpSprites.push(loadImage("./images/powerup-multishot.png"));
  powerUpSprites.push(loadImage("./images/powerup-force.png"));
  powerUpSprites.push(loadImage("./images/powerup-laser.png"));
  
  // Load video
  startVideo = createVideo("./js/r-type-intro.mp4");
  startVideo.hide();
}

function setup() {
  createCanvas(GAME_WIDTH, GAME_HEIGHT);
  frameRate(60);
  startVideo.loop();
  startVideo.volume(0);
  
  // Load high scores
  loadHighScores();
  
  // Create initial background elements
  createBackgroundElements();
}

function draw() {
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

function createBackgroundElements() {
  // Create stars and other background elements
  for (let i = 0; i < 100; i++) {
    bgElements.push({
      x: random(GAME_WIDTH),
      y: random(GAME_HEIGHT),
      size: random(1, 3),
      speed: random(0.5, 1.5),
      type: "star"
    });
  }
  
  // Create some larger background elements (asteroids, distant planets)
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
  // Draw scrolling background
  drawBackground();
  
  // Draw video
  image(startVideo, 0, 0, GAME_WIDTH, GAME_HEIGHT);
  
  // Draw title
  fill(255);
  textSize(40);
  textStyle(BOLD);
  text("R-TYPE DEFENDER", GAME_WIDTH / 2 - 180, GAME_HEIGHT / 2 - 100);
  textSize(18);
  text("Defend Earth against the Bydo Empire", GAME_WIDTH / 2 - 140, GAME_HEIGHT / 2 - 70);
  
  // Draw credits
  textSize(14);
  textStyle(NORMAL);
  text("Adapted by [Your Name]", GAME_WIDTH / 2 - 80, GAME_HEIGHT / 2 + 120);
  
  // Draw start button
  fill(0, 255, 0, 200); // Green with transparency
  rect(GAME_WIDTH / 2 - 100, GAME_HEIGHT / 2 - 25, 200, 50, 10);
  fill(255);
  textSize(24);
  textStyle(BOLD);
  text("START", GAME_WIDTH / 2 - 35, GAME_HEIGHT / 2 + 5);
  
  // Draw leaderboard button
  fill(255, 255, 0, 200); // Yellow with transparency
  rect(GAME_WIDTH / 2 - 100, GAME_HEIGHT / 2 + 50, 200, 50, 10);
  fill(255);
  textSize(24);
  textStyle(BOLD);
  text("LEADERBOARD", GAME_WIDTH / 2 - 85, GAME_HEIGHT / 2 + 80);
  
  // Draw controls info
  textSize(16);
  textStyle(NORMAL);
  text("CONTROLS: Arrow keys to move, SPACE to shoot, SHIFT to charge", 
       GAME_WIDTH / 2 - 200, GAME_HEIGHT - 50);
  text("Z to detach/attach Force module", GAME_WIDTH / 2 - 100, GAME_HEIGHT - 30);
}

function mousePressed() {
  if (startMenu) {
    // Check if start button is clicked
    if (GAME_WIDTH / 2 - 100 < mouseX && mouseX < GAME_WIDTH / 2 + 100 && 
        GAME_HEIGHT / 2 - 25 < mouseY && mouseY < GAME_HEIGHT / 2 + 25) {
      startMenu = false;
      leaderboardMenu = false;
      gameOverMenu = false;
      resetGame();
      music.loop(); 
      startVideo.stop();
    } 
    // Check if leaderboard button is clicked
    else if (GAME_WIDTH / 2 - 100 < mouseX && mouseX < GAME_WIDTH / 2 + 100 && 
             GAME_HEIGHT / 2 + 50 < mouseY && mouseY < GAME_HEIGHT / 2 + 100) {
      startMenu = false;
      leaderboardMenu = true;
      startVideo.stop();
    }
  } else if (leaderboardMenu) {
    // Check if back button is clicked
    if (GAME_WIDTH / 2 - 100 < mouseX && mouseX < GAME_WIDTH / 2 + 100 && 
        GAME_HEIGHT / 2 + 150 < mouseY && mouseY < GAME_HEIGHT / 2 + 200) {
      leaderboardMenu = false;
      startMenu = true;
      startVideo.loop();
      startVideo.volume(0);
    }
  }
}

function addScoreToLeaderboard() {
  let playerName = prompt('Enter your name for the leaderboard:');
  if (playerName !== null && playerName.trim() !== '') {
    highScores.push({ name: playerName, score: score, level: gameLevel });
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
  // Draw background
  drawBackground();
  
  // Draw panel background
  fill(0, 0, 50, 240);
  rect(GAME_WIDTH / 2 - 250, GAME_HEIGHT / 2 - 200, 500, 400, 20);
  
  // Draw title
  fill(255);
  textSize(36);
  textStyle(BOLD);
  text("LEADERBOARD", GAME_WIDTH / 2 - 130, GAME_HEIGHT / 2 - 150);
  
  textSize(20);
  textStyle(BOLD);
  text("PILOT", GAME_WIDTH / 2 - 200, GAME_HEIGHT / 2 - 100);
  text("SCORE", GAME_WIDTH / 2, GAME_HEIGHT / 2 - 100);
  text("LEVEL", GAME_WIDTH / 2 + 150, GAME_HEIGHT / 2 - 100);
  
  // Draw divider
  stroke(100, 100, 255);
  line(GAME_WIDTH / 2 - 200, GAME_HEIGHT / 2 - 90, GAME_WIDTH / 2 + 200, GAME_HEIGHT / 2 - 90);
  noStroke();
  
  // Draw high scores
  if (highScores.length === 0) {
    textAlign(CENTER);
    textSize(20);
    text("No scores yet. Be the first!", GAME_WIDTH / 2, GAME_HEIGHT / 2);
    textAlign(LEFT);
  } else {
    for (let i = 0; i < highScores.length; i++) {
      if (i < 10) { // Show top 10
        textSize(18);
        textStyle(NORMAL);
        fill(i === 0 ? color(255, 215, 0) : (i === 1 ? color(192) : (i === 2 ? color(176, 141, 87) : color(255))));
        text(`${i + 1}.`, GAME_WIDTH / 2 - 230, GAME_HEIGHT / 2 - 60 + i * 30);
        text(`${highScores[i].name}`, GAME_WIDTH / 2 - 200, GAME_HEIGHT / 2 - 60 + i * 30);
        text(`${highScores[i].score}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 - 60 + i * 30);
        text(`${highScores[i].level || 1}`, GAME_WIDTH / 2 + 150, GAME_HEIGHT / 2 - 60 + i * 30);
      }
    }
  }
  
  // Draw back button
  fill(255, 0, 0, 200); // Red with transparency
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
}

function drawBackground() {
  // Draw scrolling space background
  // We use two images to create seamless scrolling
  image(backgroundImg, bgX, 0, GAME_WIDTH, GAME_HEIGHT);
  image(backgroundImg, bgX + GAME_WIDTH, 0, GAME_WIDTH, GAME_HEIGHT);
  
  bgX -= GAME_SPEED;
  if (bgX <= -GAME_WIDTH) {
    bgX = 0;
  }
  
  // Draw background elements (stars, distant planets)
  for (let element of bgElements) {
    if (element.type === "star") {
      fill(255);
      noStroke();
      ellipse(element.x, element.y, element.size, element.size);
      
      // Move stars
      element.x -= element.speed;
      
      // Wrap stars around
      if (element.x < 0) {
        element.x = GAME_WIDTH;
        element.y = random(GAME_HEIGHT);
      }
    } else if (element.type === "asteroid") {
      fill(100, 100, 100, 150);
      noStroke();
      ellipse(element.x, element.y, element.size, element.size);
      
      // Move asteroids
      element.x -= element.speed;
      
      // Wrap asteroids around
      if (element.x < -element.size) {
        element.x = GAME_WIDTH + element.size;
        element.y = random(GAME_HEIGHT);
        element.size = random(20, 50);
      }
    }
  }
}

function gameLoop() {
  // Draw background
  drawBackground();
  
  // Generate enemies based on game level
  if (frameCount % (60 - min(gameLevel * 5, 50)) === 0) {
    spawnEnemy();
  }
  
  // Generate power-ups occasionally
  if (frameCount % 600 === 0) {
    spawnPowerUp();
  }

  // Draw and update player
  updatePlayer();
  
  // Update and draw bullets
  updateBullets();
  
  // Update and draw enemies
  updateEnemies();
  
  // Update and draw power-ups
  updatePowerUps();
  
  // Update Force module if it exists
  if (forceModule) {
    updateForceModule();
  }
  
  // Check for level advancement
  if (score > 0 && score % 500 === 0) {
    gameLevel = floor(score / 500) + 1;
  }
  
  // Draw HUD (score, level, charge meter)
  drawHUD();
}

function spawnEnemy() {
  let enemyType = floor(random(enemySprites.length));
  let movementPattern = floor(random(4));
  let speed = DEFAULT_ENEMY_SPEED + random(-1, 1);
  
  enemies.push({
    x: GAME_WIDTH,
    y: random(50, GAME_HEIGHT - 50),
    width: ENEMY_WIDTH,
    height: ENEMY_HEIGHT,
    type: enemyType,
    speed: speed,
    movementPattern: movementPattern,
    health: enemyType + 1, // Health based on enemy type
    angle: 0,
    fireRate: random(100, 200),
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
  // Draw player
  push();
  translate(playerX, playerY);
  if (chargingShot) {
    // Add glowing effect when charging
    stroke(0, 255, 255, 150);
    strokeWeight(3 + chargeLevel/10);
    noFill();
    ellipse(0, 0, PLAYER_WIDTH + chargeLevel/2, PLAYER_HEIGHT + chargeLevel/2);
  }
  imageMode(CENTER);
  image(playerSprite, 0, 0, PLAYER_WIDTH, PLAYER_HEIGHT);
  imageMode(CORNER);
  pop();
  
  // Handle player movement
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
  
  // Handle charge shot (hold SHIFT)
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
    
    // Move bullet
    bullet.x += bullet.speed;
    
    // Draw bullet based on its type
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
      // Add glow effect
      noFill();
      stroke(255, 0, 128, 150);
      strokeWeight(2);
      ellipse(bullet.x, bullet.y, bullet.width + 10, bullet.height + 10);
      noStroke();
    }
    
    // Remove bullets that go off screen
    if (bullet.x > GAME_WIDTH) {
      bullets.splice(i, 1);
    } else {
      // Check collision with enemies
      for (let j = enemies.length - 1; j >= 0; j--) {
        let enemy = enemies[j];
        if (collideRectRect(bullet.x, bullet.y, bullet.width, bullet.height,
                           enemy.x, enemy.y, enemy.width, enemy.height)) {
          
          // Calculate damage based on bullet type
          let damage = 1;
          if (bullet.type === "laser") damage = 2;
          if (bullet.type === "charged") damage = min(5, floor(bullet.charge / 20) + 1);
          
          enemy.health -= damage;
          
          // Remove bullet unless it's a penetrating type
          if (bullet.type !== "laser") {
            bullets.splice(i, 1);
          }
          
          // Check if enemy is destroyed
          if (enemy.health <= 0) {
            // Add score based on enemy type
            score += (enemy.type + 1) * 10;
            explosionSound.play();
            
            // Chance to spawn power-up when enemy is destroyed
            if (random() < 0.1) {
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
  for (let i = enemies.length - 1; i >= 0; i--) {
    let enemy = enemies[i];
    
    // Move enemy based on its pattern
    switch(enemy.movementPattern) {
      case 0: // Straight horizontal
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
    
    // Enemy shooting (for some enemy types)
    if (enemy.type > 0 && frameCount - enemy.lastShot > enemy.fireRate) {
      // Create enemy bullet
      let angle = atan2(playerY - enemy.y, playerX - enemy.x);
      let enemyBullet = {
        x: enemy.x,
        y: enemy.y,
        width: 10,
        height: 5,
        speed: -5,
        angle: angle,
        type: "enemy"
      };
      bullets.push(enemyBullet);
      enemy.lastShot = frameCount;
    }
    
    // Draw enemy
    image(enemySprites[enemy.type], enemy.x, enemy.y, enemy.width, enemy.height);
    
    // Remove enemies that go off screen
    if (enemy.x < -enemy.width) {
      enemies.splice(i, 1);
    } else {
      // Check collision with player
      if (collideRectRect(playerX - PLAYER_WIDTH/2, playerY - PLAYER_HEIGHT/2, 
                         PLAYER_WIDTH, PLAYER_HEIGHT,
                         enemy.x, enemy.y, enemy.width, enemy.height)) {
        // Player hit by enemy
        handlePlayerHit();
      }
    }
  }
}

function updatePowerUps() {
  for (let i = powerUps.length - 1; i >= 0; i--) {
    let powerUp = powerUps[i];
    
    // Move power-up
    powerUp.x -= powerUp.speed;
    
    // Draw power-up
    image(powerUp.sprite, powerUp.x, powerUp.y, powerUp.width, powerUp.height);
    
    // Add pulsing effect
    if (frameCount % 10 < 5) {
      noFill();
      stroke(255, 255, 255, 150);
      strokeWeight(2);
      ellipse(powerUp.x + powerUp.width/2, powerUp.y + powerUp.height/2, 
              powerUp.width * 1.5, powerUp.height * 1.5);
      noStroke();
    }
    
    // Remove power-ups that go off screen
    if (powerUp.x < -powerUp.width) {
      powerUps.splice(i, 1);
    } else {
      // Check collision with player
      if (collideRectRect(playerX - PLAYER_WIDTH/2, playerY - PLAYER_HEIGHT/2, 
                         PLAYER_WIDTH, PLAYER_HEIGHT,
                         powerUp.x, powerUp.y, powerUp.width, powerUp.height)) {
        // Apply power-up effect
        applyPowerUp(powerUp.type);
        powerUpSound.play();
        powerUps.splice(i, 1);
      }
    }
  }
}

function updateForceModule() {
  // If force is attached to player
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
    // Independent movement
    let targetX = playerX + 100;
    let targetY = playerY;
    
    // Move toward target position
    let dx = targetX - forceModule.x;
    let dy = targetY - forceModule.y;
    forceModule.x += dx * 0.1;
    forceModule.y += dy * 0.1;
    
    // Check if force should reattach to player
    if (dist(forceModule.x, forceModule.y, playerX, playerY) < PLAYER_WIDTH) {
      forceModule.attached = true;
      forceModule.position = "front";
    }
  }
  
  // Draw force module
  image(forceSprite, forceModule.x - FORCE_SIZE/2, forceModule.y - FORCE_SIZE/2, 
        FORCE_SIZE, FORCE_SIZE);
  
  // Force module fires bullets automatically every few frames
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
          position: "front"
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
  // Draw score
  fill(255);
  textSize(20);
  text(`SCORE: ${score}`, 20, 30);
  
  // Draw level
  text(`LEVEL: ${gameLevel}`, 20, 60);
  
  // Draw charge meter if charging
  if (chargingShot) {
    fill(50);
    rect(20, GAME_HEIGHT - 40, 200, 20);
    fill(255, 0, 0);
    rect(20, GAME_HEIGHT - 40, chargeLevel * 2, 20);
    fill(255);
    text("CHARGE", 20, GAME_HEIGHT - 50);
  }
  
  // Draw active power-ups
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
    // Fire bullet
    if (chargingShot) {
      // Fire charged shot
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
      // Fire normal bullet
      if (bulletType === "multishot") {
        // Fire 3 bullets in spread pattern
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
        // Fire laser beam
        bullets.push({
          x: playerX + PLAYER_WIDTH/2,
          y: playerY - 2,
          width: 30,
          height: 4,
          speed: BULLET_SPEED * 1.5,
          type: "laser"
        });
      } else {
        // Fire single bullet
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
  
  // Detach/attach Force module
  if (key === 'z' || key === 'Z') {
    if (forceModule) {
      forceModule.attached = !forceModule.attached;
      
      // Cycle through positions when reattaching
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
  
  // Restart game from game over screen
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

// Release charge shot when SHIFT is released
function keyReleased() {
  if (keyCode === SHIFT) {
    if (chargingShot) {
      // Fire charged shot
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
        // Full charge creates extra bullets
        for (let angle = -30; angle <= 30; angle += 30) {
          if (angle === 0) continue; // Skip center (already fired)
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

// Helper collision detection function
function collideRectRect(x1, y1, w1, h1, x2, y2, w2, h2) {
  return x1 < x2 + w2 &&
         x1 + w1 > x2 &&
         y1 < y2 + h2 &&
         y1 + h1 > y2;
}

// Wave spawning system
function spawnWave() {
  let waveType = floor(random(5));
  
  switch(waveType) {
    case 0: // Line formation from right
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
      
    case 1: // V formation from top right
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
      
    case 4: // Boss wave (every 5 levels)
      if (gameLevel % 5 === 0) {
        spawnBoss();
      } else {
        // Random enemies if not boss level
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

// For importing from external JSON
function loadEnemyData(data) {
  // Process enemy data from JSON
  enemyData = data;
  
  // Example of using the data to create custom enemy waves
  // This would be called from your game based on level or time
}

// Video ended callback
function videoEnded() {
  if (startMenu) {
    startVideo.loop();
  }
}