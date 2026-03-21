document.addEventListener("DOMContentLoaded", () => {
    candyCrushGame();
});

function restartGame() {
    location.reload();
}

function candyCrushGame() {
    const grid = document.querySelector(".grid");
    const scoreDisplay = document.getElementById("score");
    const timerDisplay = document.getElementById("timer");

    const width = 8;
    const squares = [];
    let score = 0;
    let timeLeft = 60;

    const candyColors = [
        "url(utils/blue-candy.png)",
        "url(utils/green-candy.png)",
        "url(utils/orange-candy.png)",
        "url(utils/purple-candy.png)",
        "url(utils/red-candy.png)",
        "url(utils/yellow-candy.png)"
    ];

    // Create Board
    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement("div");
            square.setAttribute("draggable", true);
            square.setAttribute("id", i);

            let randomColor = Math.floor(Math.random() * candyColors.length);
            square.style.backgroundImage = candyColors[randomColor];

            grid.appendChild(square);
            squares.push(square);
        }
    }
    createBoard();

    // Timer
    function startTimer() {
        const timer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;

            if (timeLeft === 0) {
                clearInterval(timer);
                alert("Game Over! Your score: " + score);
            }
        }, 1000);
    }
    startTimer();

    // Dragging
    let colorBeingDragged;
    let colorBeingReplaced;
    let squareIdBeingDragged;
    let squareIdBeingReplaced;

    squares.forEach(square => square.addEventListener("dragstart", dragStart));
    squares.forEach(square => square.addEventListener("dragend", dragEnd));
    squares.forEach(square => square.addEventListener("dragover", e => e.preventDefault()));
    squares.forEach(square => square.addEventListener("dragenter", e => e.preventDefault()));
    squares.forEach(square => square.addEventListener("dragleave", dragLeave));
    squares.forEach(square => square.addEventListener("drop", dragDrop));

    function dragStart() {
        colorBeingDragged = this.style.backgroundImage;
        squareIdBeingDragged = parseInt(this.id);
    }

    function dragLeave() {
        this.style.backgroundImage = "";
    }

    function dragDrop() {
        colorBeingReplaced = this.style.backgroundImage;
        squareIdBeingReplaced = parseInt(this.id);

        this.style.backgroundImage = colorBeingDragged;
        squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced;
    }

    function dragEnd() {
        let validMoves = [
            squareIdBeingDragged - 1,
            squareIdBeingDragged - width,
            squareIdBeingDragged + 1,
            squareIdBeingDragged + width
        ];

        let validMove = validMoves.includes(squareIdBeingReplaced);

        if (squareIdBeingReplaced && validMove) {
            squareIdBeingReplaced = null;
        } else if (squareIdBeingReplaced && !validMove) {
            squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced;
            squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
        } else {
            squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
        }
    }

    // Move down
    function moveIntoSquareBelow() {
        for (let i = 0; i < 55; i++) {
            if (squares[i + width].style.backgroundImage === "") {
                squares[i + width].style.backgroundImage = squares[i].style.backgroundImage;
                squares[i].style.backgroundImage = "";

                const firstRow = [0,1,2,3,4,5,6,7];
                if (firstRow.includes(i) && squares[i].style.backgroundImage === "") {
                    let randomColor = Math.floor(Math.random() * candyColors.length);
                    squares[i].style.backgroundImage = candyColors[randomColor];
                }
            }
        }
    }

    // Check matches
    function checkRowForThree() {
        for (let i = 0; i < 61; i++) {
            let row = [i, i+1, i+2];
            let color = squares[i].style.backgroundImage;

            const notValid = [6,7,14,15,22,23,30,31,38,39,46,47,54,55];
            if (notValid.includes(i)) continue;

            if (row.every(index => squares[index].style.backgroundImage === color && color !== "")) {
                score += 3;
                scoreDisplay.textContent = score;
                row.forEach(index => squares[index].style.backgroundImage = "");
            }
        }
    }

    function checkColumnForThree() {
        for (let i = 0; i < 47; i++) {
            let column = [i, i+width, i+width*2];
            let color = squares[i].style.backgroundImage;

            if (column.every(index => squares[index].style.backgroundImage === color && color !== "")) {
                score += 3;
                scoreDisplay.textContent = score;
                column.forEach(index => squares[index].style.backgroundImage = "");
            }
        }
    }

    // Game loop
    setInterval(() => {
        checkRowForThree();
        checkColumnForThree();
        moveIntoSquareBelow();
    }, 100);
}
