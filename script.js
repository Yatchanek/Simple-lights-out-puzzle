const container = document.querySelector('.board-container');
const startBtn = document.getElementById('start-button');
const rowCountBtn = document.getElementById('row-count');
const winMessage = document.getElementById('win-message');
const colorPicker = document.getElementById('color-picker');
let gridSize = 5;
let gameWon = false;
let color = '#2F0505';
let cells = [];
let cellSize, leftUpper, rightUpper, leftBottom, rightBottom, upperBorder, rightBorder, bottomBorder, leftBorder;

startBtn.addEventListener('click', restart);
startBtn.addEventListener('touchstart', restart);

colorPicker.addEventListener('change', (e) => {
    document.documentElement.style.setProperty('--tile-color', e.target.value);
});

function collapse() {
    for (cell of cells) {
        cell.style.transition = `transform ${Math.random() * 2 + 0.5}s ease-out`;
        cell.style.transform = `translateY(${Math.random() * 100 + 100}vmin)`;
    }
}

function formatGrid(size = gridSize) {
    cellSize = 85 / size;
    container.style.gridTemplateColumns = `repeat(${size}, ${cellSize}vmin)`;
    container.style.gridTemplateRows = `repeat(${size}, ${cellSize}vmin)`;
    for(let i = 0; i < size * size; i++) {
        let cell = document.createElement('div');
        cell.classList.add('cell');
        cell.style.width = cell.style.height = `${cellSize}vmin`;
        container.appendChild(cell);
    }
    container.classList.remove('transparent');
    cells = Array.from(document.querySelectorAll('.cell'));
    cells.forEach(cell => {
        cell.addEventListener('click', toggleCell);
        cell.addEventListener('touchstart', toggleCell);
    })
}

function findBorderCells(size = gridSize) {
    cells.forEach(cell => cell.style.order = `${cells.indexOf(cell)}`);
    leftUpper = 0;
    rightUpper = leftUpper + size - 1;
    leftBottom = leftUpper + (size-1) * size;
    rightBottom = rightUpper + (size-1) * size;
    upperBorder = [];
    rightBorder = [];
    bottomBorder = [];
    leftBorder = [];
    for (let i = 1; i < rightUpper; i++) {
        upperBorder.push(i);
    }
    for (let i = leftBottom+1; i < rightBottom; i++) {
        bottomBorder.push(i);
    }
    for (let i = size; i < leftBottom; i+=size) {
        leftBorder.push(i);
    }
    for (let i = rightUpper + size; i < leftBottom; i+=size) {
        rightBorder.push(i);
    }
}



function toggleCell(e) {
    if (!gameWon) {
    e.preventDefault();
    let cell = e.target;
    let order = parseInt(cell.style.order);
    cell.classList.toggle('on');
    if (order === leftUpper) {
        cells[order+1].classList.toggle('on');
        cells[order+gridSize].classList.toggle('on');
    }
    else if (order === rightUpper) {
        cells[order-1].classList.toggle('on');
        cells[order+gridSize].classList.toggle('on');
    }
    else if (order === leftBottom) {
        cells[order+1].classList.toggle('on');
        cells[order-gridSize].classList.toggle('on');
    }
    else if (order === rightBottom) {
        cells[order-1].classList.toggle('on');
        cells[order-gridSize].classList.toggle('on');
    }
    else if (upperBorder.indexOf(order) >= 0) {
        cells[order+1].classList.toggle('on');
        cells[order-1].classList.toggle('on');
        cells[order+gridSize].classList.toggle('on');
    }

    else if (bottomBorder.indexOf(order) >= 0) {
        cells[order+1].classList.toggle('on');
        cells[order-1].classList.toggle('on');
        cells[order-gridSize].classList.toggle('on');
    }

    else if (leftBorder.indexOf(order) >= 0) {
        cells[order+1].classList.toggle('on');
        cells[order-gridSize].classList.toggle('on');
        cells[order+gridSize].classList.toggle('on');
    }

    else if (rightBorder.indexOf(order) >= 0) {
        cells[order-1].classList.toggle('on');
        cells[order-gridSize].classList.toggle('on');
        cells[order+gridSize].classList.toggle('on');
    }
    else {
        cells[order-1].classList.toggle('on');
        cells[order+1].classList.toggle('on');
        cells[order-gridSize].classList.toggle('on');
        cells[order+gridSize].classList.toggle('on');        
    }
    checkForWin();
    }    
}

function checkForWin() {
    let off = [];
    off = cells.filter(cell => cell.classList.contains('on') === false);
    if (off.length === 0) {
        gameWon = true;
        setTimeout(() => {
            winMessage.style.opacity = '0.8';
        }, 500);
        
    }
}

function restart() {
    container.classList.add('transparent');
    collapse();
    gameWon = false;
    setTimeout(() => {
        container.innerHTML = '';
        cells = [];
        winMessage.style.opacity = '0';
        gridSize = parseInt(rowCountBtn.value);
        formatGrid(gridSize);
        findBorderCells(gridSize);
    }, 1500);
};

winMessage.style.opacity = '0';
colorPicker.value = color;
formatGrid(gridSize);
findBorderCells(gridSize);
