let skierX, skierY, skierSpeed;
let obstacles = [];
let score = 0;
let currency = 0;
let isJumping = false;
let jumpTime = 0;
let isAccelerating = false;
let accelTime = 0;
let isGameOver = false;
let lastMouseX = 0;
let activeSkin = { color: 'blue' }; // По умолчанию синий лыжник
let purchasedSkins = [];

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight - 150);
  canvas.parent('game-container');
  resetGame();
  
  // Обработчики кнопок
  select('#jump-btn').mousePressed(() => {
    if (!isGameOver && !isJumping) {
      isJumping = true;
      jumpTime = 0;
    }
  });
  select('#accel-btn').mousePressed(() => {
    if (!isGameOver && !isAccelerating) {
      isAccelerating = true;
      accelTime = 0;
    }
  });
  select('#shop-btn').mousePressed(() => {
    if (!isGameOver) {
      select('#shop').style('display', 'block');
      noLoop(); // Приостановить игру
    }
  });
  select('#close-shop').mousePressed(() => {
    select('#shop').style('display', 'none');
    loop(); // Возобновить игру
  });
  select('#restart-btn').mousePressed(resetGame);
  
  // Обработчики покупки скинов
  let skinElements = selectAll('.skin');
  skinElements.forEach(skin => {
    skin.mousePressed(() => {
      let id = skin.attribute('data-id');
      let price = parseInt(skin.attribute('data-price'));
      if (currency >= price && !purchasedSkins.includes(id)) {
        currency -= price;
        purchasedSkins.push(id);
        activeSkin = { color: id === '1' ? 'red' : id === '2' ? 'blue' : 'brown' };
        updateUI();
      }
    });
  });
}

function resetGame() {
  skierX = width / 2;
  skierY = 100;
  skierSpeed = 5;
  obstacles = [];
  score = 0;
  isGameOver = false;
  isJumping = false;
  isAccelerating = false;
  select('#game-over').style('display', 'none');
  loop();
  updateUI();
}

function updateUI() {
  select('#score').html(`Очки: ${floor(score)}`);
  select('#currency').html(`Валюта: ${currency}`);
  select('#final-score').html(`Финальные очки: ${floor(score)}`);
}

function draw() {
  if (!isGameOver) {
    // Обновление
    skierY += skierSpeed;
    if (isJumping) {
      jumpTime++;
      if (jumpTime > 30) isJumping = false;
    }
    if (isAccelerating) {
      skierSpeed = 10;
      accelTime++;
      if (accelTime > 60) {
        isAccelerating = false;
        skierSpeed = 5;
      }
    }
    score += skierSpeed / 2;
    if (random(100) < 5) {
      obstacles.push({ x: random(width), y: 0 });
    }
    obstacles.forEach(o => o.y += skierSpeed);
    obstacles = obstacles.filter(o => o.y < height);
    obstacles.forEach(o => {
      if (!isJumping && abs(skierX - o.x) < 50 && abs(skierY - o.y) < 50) {
        isGameOver = true;
        select('#game-over').style('display', 'block');
        noLoop();
      }
    });
    if (score % 1000 < 5 && score > 0) currency += 10;
    updateUI();
  }

  // Отрисовка
  background(255);
  fill(activeSkin.color);
  ellipse(skierX, skierY, 20);
  fill('red');
  obstacles.forEach(o => rect(o.x - 25, o.y - 25, 50, 50));
}

function mouseDragged() {
  if (!isGameOver) {
    let deltaX = mouseX - lastMouseX;
    skierX += deltaX * 0.5;
    skierSpeed = 5 - abs(deltaX) * 0.01;
    lastMouseX = mouseX;
  }
}

function mousePressed() {
  lastMouseX = mouseX;
}

function keyPressed() {
  if (!isGameOver) {
    if (key === ' ') {
      if (!isJumping) {
        isJumping = true;
        jumpTime = 0;
      }
    }
    if (key === 'f' || key === 'F') {
      if (!isAccelerating) {
        isAccelerating = true;
        accelTime = 0;
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight - 150);
}
