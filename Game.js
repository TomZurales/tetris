class Game{
  constructor(width, height){
    this.piece = new Piece(Math.floor(Math.random() * 7));
    this.pieceBoard = new PieceBoard(10, 20, this.piece);
    this.shownBoard = new ShownBoard(10, 20);
    this.draw(this.shownBoard, this.pieceBoard);
    this.lockTimer;
    this.timerOn = false;

    tick = setInterval(this.tickFunction.bind(this), tickSpeed);

    window.addEventListener('keydown', handleInput.bind(this));
  }

  draw(shown, piece){
    const SQUARE_SIZE = 20;

    let combinedBoard = combine(shown, piece);
    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');

    canvas.setAttribute("width", shown.board[0].length * SQUARE_SIZE);
    canvas.setAttribute("height", shown.board.length * SQUARE_SIZE - (OFFSET * SQUARE_SIZE));

    for(let i = OFFSET; i < combinedBoard.length; i++){
      for(let j = 0; j < combinedBoard[0].length; j++){
        context.fillStyle = combinedBoard[i][j];
        let startingX = j * SQUARE_SIZE;
        let startingY = (i - OFFSET) * SQUARE_SIZE;
        let endingX = startingX + SQUARE_SIZE;
        let endingY = startingY + SQUARE_SIZE;
        context.fillRect(startingX, startingY, endingX, endingY);
      }
    }
  }

  lock(shown, piece){
    if(this.noCollisions(shown, piece) && this.rowEmpty(shown.board[OFFSET - 1])){
      shown.combine(piece);
      this.shownBoard.clearFullRows();
      this.piece = new Piece(Math.floor(Math.random() * 7));
      piece.newPiece(this.piece);
    }
    else{
      console.log("Game over");
      this.gameOver();
    }
  }

  tickFunction(){
    this.draw(this.shownBoard, this.pieceBoard);
    this.pieceBoard.moveDown(this.shownBoard);
    if(this.pieceBoard.atBottom){
      if(!this.timerOn){
        this.timerOn = true;
        this.lockTimer = setTimeout(function(){
            this.lock(this.shownBoard, this.pieceBoard);
            this.timerOn = false;
        }.bind(this), TIME_TO_LOCK)
      }
    }
    clearInterval(tick);
    tick = setInterval(this.tickFunction.bind(this), tickSpeed);
  }

  noCollisions(shown, piece){
    for(let i = 0; i < shown.board.length; i++){
      for(let j = 0; j < shown.board[0].length; j++){
        if(shown.board[i][j] !== BACKGROUND_COLOR && piece.board[i][j] !== BACKGROUND_COLOR){
          console.log("OH NO At", i, j);
          return false;
        }
      }
    }
    return true;
  }

  rowEmpty(arr){
    arr.forEach(function(e){
      if(e !== BACKGROUND_COLOR){
        return false;
      }
    });
    return true;
  }

  gameOver(){
    clearInterval(tick);
  }
}
