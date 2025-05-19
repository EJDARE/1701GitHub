// Game configuration
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
let BACKGROUND_COLOR;

// Spaceship properties
const SPACESHIP_WIDTH = 40;
const SPACESHIP_HEIGHT = 55;
const SPACESHIP_SPEED = 5;

// Alien properties
const ALIEN_WIDTH = 40;
const ALIEN_HEIGHT = 55;
const ALIEN_SPEED = 3;

// Power-up properties
const POWER_UP_WIDTH = 20;
const POWER_UP_HEIGHT = 20;

// Game variables
let playerX = GAME_WIDTH / 2;
let playerY = GAME_HEIGHT - SPACESHIP_HEIGHT;
let score = 0;
let gameOver = false;
let started = false;
let aliens = [];
let powerUps = [];
let bullets = [];
let music;
let deathSound;
let playerSpaceshipSprite;
let alienSprite;
let shieldPowerUpSprite;
let speedBoostPowerUpSprite;
let extraLifePowerUpSprite;
let startVideo;
let bulletSprite;
let startMenu = true;
let gameOverMenu = false;

function preload() {
  music = loadSound("./js/phonk-phonk-2025-mix-313052.mp3");
  deathSound = loadSound("./js/death-sound.mp3");
  playerSpaceshipSprite = loadImage("./images/PlayerShip.png");
  alienSprite = loadImage("./images/alien.jpg");
  shieldPowerUpSprite = loadImage("./images/ShieldPowerUp.png");
  speedBoostPowerUpSprite = loadImage("./images/SpeedBoostPowerUp.png");
  extraLifePowerUpSprite = loadImage("./images/ExtraLifePowerUp.png");
  bulletSprite = loadImage('./images/bulletSprite.png');
}

function setup() {
  console.log("Setup function called");
  createCanvas(GAME_WIDTH, GAME_HEIGHT);
  frameRate(60);
  BACKGROUND_COLOR = color(0, 0, 0); // Initialize BACKGROUND_COLOR here
  music.setVolume(0.008); // Set the music volume to 50%
  deathSound.setVolume(0.01); // Set the death sound effect volume to 1%
  startVideo = createVideo("./js/StartVideo.mp4");
  startVideo.loop();
  startVideo.volume(0);
  startVideo.hide();
}

function draw() {
    console.log("Draw function called");
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

function startMenuScreen() {
    background(0);
    // Draw the video on the canvas rather than showing the DOM element
    image(startVideo, 0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    // Draw title
    fill(0);
    textSize(32);
    textStyle(BOLD);
    text("R-Type Game", GAME_WIDTH / 2 - 100, GAME_HEIGHT / 2 - 100);
    textSize(18);
    text("Press 'Start' to begin", GAME_WIDTH / 2 - 120, GAME_HEIGHT / 2 - 70);
    
    // Draw start button
    fill(0, 255, 0); // Green
    rect(GAME_WIDTH / 2 - 100, GAME_HEIGHT / 2 - 25, 200, 50);
    fill(0);
    textSize(24);
    textStyle(BOLD);
    text("Start", GAME_WIDTH / 2 - 35, GAME_HEIGHT / 2);
}

function mousePressed() {
    if (startMenu) {
        if (GAME_WIDTH / 2 - 100 < mouseX && mouseX < GAME_WIDTH / 2 + 100 && GAME_HEIGHT / 2 - 25 < mouseY && mouseY < GAME_HEIGHT / 2 + 25) {
        startMenu = false;
        leaderboardMenu = false;
        music.loop(); 
        startVideo.hide(); // Hide the video element
    }
  }
}

function gameLoop() {
    background(BACKGROUND_COLOR);
    
    // Move and draw player spaceship
    image(playerSpaceshipSprite, playerX, playerY, SPACESHIP_WIDTH, SPACESHIP_HEIGHT);
    
    // Move player spaceship
    if (keyIsDown(RIGHT_ARROW) && playerX < GAME_WIDTH - SPACESHIP_WIDTH) {
        playerX += SPACESHIP_SPEED;
    }
    if (keyIsDown(LEFT_ARROW) && playerX > 0) {
        playerX -= SPACESHIP_SPEED;
    }
    if (keyIsDown(UP_ARROW) && playerY > 0) {
        playerY -= SPACESHIP_SPEED;
    }
    if (keyIsDown(DOWN_ARROW) && playerY < GAME_HEIGHT - SPACESHIP_HEIGHT) {
        playerY += SPACESHIP_SPEED;
    }
    
    // Update and draw aliens
    if (frameCount % 60 === 0) {
        let newX = random(0, GAME_WIDTH - ALIEN_WIDTH);
        let newY = -ALIEN_HEIGHT;
        aliens.push({
        x: newX,
        y: newY,
        speed: ALIEN_SPEED,
        sprite: alienSprite,
        draw: function() {
            image(this.sprite, this.x, this.y, ALIEN_WIDTH, ALIEN_HEIGHT);
        },
        move: function() {
            this.y += this.speed;
            if (this.y > GAME_HEIGHT) {
            this.y = -ALIEN_HEIGHT;
            this.x = random(0, GAME_WIDTH - ALIEN_WIDTH);
            }
        }
        });
    }
    
    for (let alien of aliens) {
        alien.move();
        alien.draw();
    
        // Collision detection
        if (
        playerX + SPACESHIP_WIDTH > alien.x &&
        playerX < alien.x + ALIEN_WIDTH &&
        playerY + SPACESHIP_HEIGHT > alien.y &&
        playerY < alien.y + ALIEN_HEIGHT
        ) {
        deathSound.play(); // Play the death sound
        background(255, 0, 0); // Red background on collision
        gameOverScreen(); // Show the game over screen
        gameOverMenu = true;
        music.stop(); // Stop the phonk music
        noLoop(); // Stop the game loop
        }
    }
    
    // Update and draw power-ups
    if (frameCount % 120 === 0) {
        let newX = random(0, GAME_WIDTH - POWER_UP_WIDTH);
        let newY = -POWER_UP_HEIGHT;
        let powerUpType = random(["shield", "speedBoost", "extraLife"]);
        let powerUpSprite;
        if (powerUpType === "shield") {
        powerUpSprite = shieldPowerUpSprite;
        } else if (powerUpType === "speedBoost") {
        powerUpSprite = speedBoostPowerUpSprite;
        } else if (powerUpType === "extraLife") {
        powerUpSprite = extraLifePowerUpSprite;
        }
        powerUps.push({
        x: newX,
        y: newY,
        speed: 2,
        sprite: powerUpSprite,
        draw: function() {
            image(this.sprite, this.x, this.y, POWER_UP_WIDTH, POWER_UP_HEIGHT);
        },
        move: function() {
            this.y += this.speed;
            if (this.y > GAME_HEIGHT) {
            this.y = -POWER_UP_HEIGHT;
            this.x = random(0, GAME_WIDTH - POWER_UP_WIDTH);
            }
        }
        });
    }
    
    for (let powerUp of powerUps) {
        powerUp.move();
        powerUp.draw();
    
        // Collision detection
        if (
        playerX + SPACESHIP_WIDTH > powerUp.x &&
        playerX < powerUp.x + POWER_UP_WIDTH &&
        playerY + SPACESHIP_HEIGHT > powerUp.y &&
        playerY < powerUp.y + POWER_UP_HEIGHT
        ) {
        // Apply power-up effect
        if (powerUp.sprite === shieldPowerUpSprite) {
            // Shield power-up effect
        } else if (powerUp.sprite === speedBoostPowerUpSprite) {
            // Speed boost power-up effect
        } else if (powerUp.sprite === extraLifePowerUpSprite) {
            // Extra life power-up effect
        }
        powerUps.splice(powerUps.indexOf(powerUp), 1);
        }
    }
    
    // Update and draw bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].move();
        bullets[i].draw();

        // Collision detection with aliens
        for (let j = aliens.length - 1; j >= 0; j--) {
        if (bullets[i].collidesWith(aliens[j])) {
            score += 10;
            aliens.splice(j, 1);
            bullets.splice(i, 1);
            break;
        }
        }
    }
    
    // Draw score
    fill(255);
    textSize(24);
    text(`Score: ${score}`, 10, 30);
    }

function keyPressed() {
    if (key === ' ') {
        bullets.push(new Bullet(playerX, playerY));
  }
}

class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 5;
        this.width = 30; 
        this.height = 40; 
    }
    
    move() {
        this.y -= this.speed;
    }
    
    draw() {
        image(bulletSprite, this.x, this.y, this.width, this.height);
    }

    
    collidesWith(alien) {
        return (
        this.x + this.width > alien.x &&
        this.x < alien.x + ALIEN_WIDTH &&
        this.y + this.height > alien.y &&
        this.y < alien.y + ALIEN_HEIGHT
        );
    }
    }