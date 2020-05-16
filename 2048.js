
let Game = {
    board: [],
    changed: false,
    score : 0,
    init :  function() {
        let mainGameContainer = document.querySelector(".main-game-container");
        for (let i = 0; i < 4; i++) {
            let row = document.createElement('div');
            row.className = 'grid-row';
            row.id = `row ${i}`;
            for (let j = 0; j < 4; j++) {
                let cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.id = `cell ${(4 * i) + j}`;
                row.appendChild(cell);
            }
            mainGameContainer.appendChild(row);
        }
    },
    newBox : function() {
        let vacantBoard = this.empty();
        if(vacantBoard.length) {
            let number = ( Math.random(1) < 0.5 )? 2: 4;
            var randomIndex = Math.floor(Math.random() * vacantBoard.length);
            let row = Math.floor(vacantBoard[randomIndex]/4);
            let col = vacantBoard[randomIndex]- 4*row ;
            this.board[row][col] = number;
        }
    },
    checkRows: function() {
        for(let i=0;i<4;i++){
          [row, changed] =  this.merge(this.board[i])
          if(changed)
            return true;
        }
        return false;
    },
    checkColumns: function() {
        this.transpose();
        for(let i=0;i<4;i++){
            [row, changed] =  this.merge(this.board[i])
            if(changed) {
              this.transpose();
              return true;
            }
          }
        this.transpose();
        return false;      
    },
    empty: function () {
        let vacantBoard = [];
        for(let i =0; i<4; i++)
            for(let j=0; j<4; j++)
                if(this.board[i][j] === 0)
                    vacantBoard.push(4*i+j);  

        if(!vacantBoard.length){
            let canMergeInRows = this.checkRows();
            let canMergeInColumns = this.checkColumns();
            if(!canMergeInColumns && !canMergeInRows)
                this.gameOver();
        }
        return vacantBoard;
    },
    gameOver: function() {
        alert("Game Over");
    },
    merge: function (row) {
        let score = 0;
        let changed = false
        for(let i=row.length-1; i>0; i--){
            if(row[i] && row[i] === row[i-1]) {
                score = score + 2*row[i];
                row[i] = row[i] + row[i-1];
                row[i-1] = 0;
                changed = true;
            } 
        }    
        return [row, changed, score]   
    },
    slide: function (row) {
        let copyRow = [...row];
        let changed = false;
        copyRow = copyRow.filter(x=>x);
        let newArr = Array(4-copyRow.length).fill(0)
        copyRow = newArr.concat(copyRow)
        for(let i=0;i<copyRow.length; i++)
            if(copyRow[i] != row[i])
                changed = true;
        return [copyRow, changed]
    },
    move : function (row) {
        let changed = false;
        [row , changedS1] = this.slide(row);
        [row , changedM, score] = this.merge(row);
        [row , changedS2] = this.slide(row);
        if(changedS1 || changedS2 || changedM)
            changed = true;
        
        return [row, changed, score]
    },
    transpose: function() {
        for(let i=0; i<4; i++)
            for(let j=0; j<i; j++){
                const tmp = this.board[i][j]; 
                      this.board[i][j] = this.board[j][i]; 
                      this.board[j][i] = tmp; 
            }
    },
    moveRight : function () {
        let scoreOfAllRows = 0;
        for(let i=0; i<this.board[0].length; i++)  {   
            let [row , changed, scoreOfRow] = this.move(this.board[i])
            scoreOfAllRows += scoreOfRow
            if(changed){
                this.changed = true
            }
            this.board[i]  = row
        }      
        this.score += scoreOfAllRows  
    },
    moveLeft : function () {
        let scoreOfAllRows = 0;
        for(let i=0; i<this.board[0].length; i++)  {   
            let [row , changed, scoreOfRow] = this.move(this.board[i].reverse())
            scoreOfAllRows += scoreOfRow
            if(changed){
                this.changed = true
            }
            this.board[i]  = row.reverse();
        }    
        this.score += scoreOfAllRows     
    },
    moveUp: function() {
        let scoreOfAllRows = 0;
        this.transpose();
        for(let i=0; i<this.board[0].length; i++)  {   
            let [row , changed, scoreOfRow] = this.move(this.board[i].reverse())
            scoreOfAllRows += scoreOfRow
            if(changed){
                this.changed = true
            }
            this.board[i]  = row.reverse();
        } 
        this.score += scoreOfAllRows  
    },
    moveDown: function() {
        let scoreOfAllRows = 0;
        this.transpose();
        for(let i=0; i<this.board[0].length; i++)  {   
            let [row , changed, scoreOfRow] = this.move(this.board[i])
            scoreOfAllRows += scoreOfRow
            if(changed){
                this.changed = true
            }
            this.board[i]  = row;
        } 
        this.score += scoreOfAllRows  
    },
    mappingBoard: function() {
        for (let i = 0; i < 4; i++) 
            for (let j = 0; j < 4; j++) { 
                let pos = 4*i+j;
                let cell = document.getElementById(`cell ${pos}`);
                cell.className='';
                cell.innerHTML='';
                cell.classList.add('grid-cell');
                if(this.board[i][j]) {             
                    cell.classList.add("grid-cell-active")
                    cell.classList.add(`num${this.board[i][j]}`)
                    let newCell = document.createElement('span');
                    newCell.innerText= this.board[i][j];
                    cell.appendChild(newCell)
                }
            }     
    }
}

let initBoard = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];
document.addEventListener("keydown", handleKeyEvents);
let scoreDiv = document.querySelector(".score");

function start() {  
    Game.init();
    Game.board = initBoard.map((arr) => arr.slice()) 
    Game.changed = false;
    Game.score=0
    Game.newBox();
    Game.newBox();
    Game.mappingBoard(); 
}

function handleKeyEvents(e) {
    Game.changed = false;
    if(e.keyCode === 39){
        Game.moveRight()
        if(Game.changed)
            Game.newBox();
        Game.mappingBoard();
        Game.empty()
    }else if(e.keyCode === 37){
        Game.moveLeft()
        if(Game.changed)
            Game.newBox();
        Game.mappingBoard();
        Game.empty()      
    }else if(e.keyCode === 38){
        Game.moveUp()
        Game.transpose()
        if(Game.changed)
            Game.newBox();
        Game.mappingBoard();
        Game.empty()
       
    }else if(e.keyCode === 40){
        Game.moveDown()
        Game.transpose()
        if(Game.changed)
            Game.newBox();
        Game.mappingBoard();
        Game.empty()      
    }
    scoreDiv.innerHTML = Game.score
}


start();
