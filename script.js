const game = () => {
  init(30, 20, 7);
};

const createField = (width, height) => {
  const main = document.getElementById('main');
  let html = '<div class="field">'

  for (let i = 0; i < height; i++) {
    html = `${html} <div class="line">`;
    for (var j = 0; j < width; j++) {
      html = `${html} <div class="${i}_${j}"></div>`
    }
    html = `${html} </div>`;
  }

  for (let i = 0; i < length; i++) {
    html = html.replace(`0_${i}`, `0_${i} s`);
  }

  main.innerHTML = `${html}</div>`;
};

const init = (width, height, lengthInit, milliseconds = 60) => {
  let length = lengthInit;
  let dx = 1, dy = 0;
  let hasFood = false;
  let hasMoved = false;
  let current = 1;
  let currentY = 0;
  let currentX = length - 1;
  const score = document.getElementById('score');

  document.addEventListener('keydown', (e) => {
    if (!hasMoved && e.keyCode >= 37 && e.keyCode <= 40) {
      if (e.keyCode === 39) { // right
        dx = dx === 0 ? 1 : dx;
        dy = 0;
      } else if (e.keyCode === 37) { // left
        dx = dx === 0 ? -1 : dx;
        dy = 0;
      } else if (e.keyCode === 38) { // up
        dx = 0;
        dy = dy === 0 ? -1 : dy;
      } else if (e.keyCode === 40) { // down
        dx = 0;
        dy = dy === 0 ? 1 : dy;
      }
      hasMoved = true;
    }
  });

  createField(width, height);

  const timer = setInterval(() => {
    currentX = (currentX + dx) < 0 ? width - 1 : (currentX + dx) % width;
    currentY = (currentY + dy) < 0 ? height - 1 : (currentY + dy) % height;
    const newEl = document.getElementsByClassName(`${currentY}_${currentX}`)[0];

    // if you run into food
    if (newEl.classList.contains('food') > 0) {
      newEl.classList.remove('food');
      length++;
      score.innerHTML = (length - lengthInit);
      hasFood = false;
    }

    // removing 'snake cell' from the tail
    let item;
    let items = document.getElementsByClassName('snake');
    for (let i = 0, min = Infinity, len = items.length; i < len && len > length; i++) {
      if (+items[i].getAttribute('data-n') < min) {
        min = +items[i].getAttribute('data-n');
        item = items[i];
      }
    }
    if (!!item) {
      item.classList.remove('snake');
    }

    // if you run into yourself, you lost
    if (newEl.classList.contains('snake')) {
      clearInterval(timer);
      alert(`Game Over!\nScore: ${length - lengthInit}`);
      document.location.href = document.location.href
    };

    // else, new 'snake cell' is created and new food added'
    newEl.classList.add('snake');
    newEl.setAttribute('data-n', current++);
    for (let fItem, fX, fY; !hasFood; fX = Math.random() * width | 0, fY = Math.random() * height | 0) {
      const newFoodEl = document.getElementsByClassName(`${fY}_${fX}`)[0];
      if (!!fX && !!fY && !newFoodEl.classList.contains('snake')) {
        hasFood = true;
        newFoodEl.classList.add('food');
      }
    }
    hasMoved = false;

  }, milliseconds);
};
