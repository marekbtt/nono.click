// set defaults
var gameArr = {};
var gameArrOrig = {};

var mode = '';

var side = '';

var maxHearts = 3;
var currentHearts = 3;

var maxHints = 3;
var currentHints = maxHints;

var cursorMode = 'full';

var rows = []; 
var cols = [];

var colsOrig = [];
var rowsOrig = [];

// max number of 'full' sequences in rows and cols
var maxRowSeq = 0;
var maxColSeq = 0;

var maxRowSeqV = 3;
var maxRowSeqE = 4;
var maxRowSeqM = 4;
var maxRowSeqH = 5;

var maxColSeqV = 3;
var maxColSeqE = 4;
var maxColSeqM = 4;
var maxColSeqH = 5;

function confirmNewGame(mode){
    var r = confirm("Are you sure you want to generate new game?");
    if (r == true) {
        newGameWrapper(mode, 0);
    }
}

function confirmResetGame(){
    var r = confirm("Are you sure you want to restart current game?");
    if (r == true) {
        newGameWrapper(mode, 1);
    }
}

function countRows(){
    rows = [];
    for (var row = 1; row <= side; row++){
        var rowInfo = [];
        var c = 0;
        for (var col = 1; col <= side; col++){

            if (col == 1){
                var previous = gameArr[row+'-'+col];
                var current = previous;
            }
            else {
                var current = gameArr[row+'-'+col];
            }

            if (current == previous){
                c++;
                if (col == side && current == 'full'){
                    rowInfo.push(c);
                }
            }
            else {
                if (previous == 'full'){
                    rowInfo.push(c);
                }
                c = 1;
                if (col == side && current == 'full'){
                    rowInfo.push(c);
                }
            }
            var previous = current;
        }
        rows.push(rowInfo);
        rowsOrig = rows;
    }
}

function countCols(){
    cols = [];
    for (var col = 1; col <= side; col++){
        var colInfo = [];
        var c = 0;

        for (var row = 1; row <= side; row++){

            if (row == 1){
                var previous = gameArr[row+'-'+col];
                var current = previous;
            }
            else {
                var current = gameArr[row+'-'+col];
            }

            if (current == previous){
                c++;
                if (row == side && current == 'full'){
                    colInfo.push(c);
                }
            }
            else {
                if (previous == 'full'){
                    colInfo.push(c);
                }
                c = 1;
                if (row == side && current == 'full'){
                    colInfo.push(c);
                }
            }
            var previous = current;
        }
        cols.push(colInfo);
        colsOrig = cols;
    }
}

function createGameState(){
    gameArr = {};
    for (var row = 1; row <= side; row++){
        for (var col = 1; col <= side; col++){
            if ((Math.floor(Math.random()*10)+1) % 2 == 0){
                var state = 'empty';
            }
            else {
                var state = 'full';
            }
            gameArr[row+'-'+col] = state;
        }
    }
    reduceRows();
    reduceCols();
    gameArrOrig = deepCopyObj(gameArr);
}

function getRandomInt(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRowSeq(currRow){
    seqNum = 0;
    var prevCell = '';
    for (var i = 0; i < currRow.length; i++) {
        var currCell = currRow[i]; 
        if (currCell == 'full' && currCell != prevCell){
            seqNum ++;
        }
        prevCell = currCell;
    }
    return seqNum;
}

function getColSeq(currCol){
    seqNum = 0;
    var prevCell = '';
    for (var i = 0; i < currCol.length; i++) {
        var currCell = currCol[i]; 
        if (currCell == 'full' && currCell != prevCell){
            seqNum ++;
        }
        prevCell = currCell;
    }
    return seqNum;
}

function reduceRows(){
    for (var row = 1; row <= side; row++){
        var currRow = [];
        for (var col = 1; col <= side; col++){
            currRow.push(gameArr[row+'-'+col]);
        }

        // reduce number of sequences to maxRowSeq
        var seqNum = getRowSeq(currRow);
        while (seqNum > maxRowSeq){
            var rnd = getRandomInt(0, (side -1));
            if (currRow[rnd] == 'empty'){
                gameArr[row+'-'+(rnd+1)] = 'full';
                currRow[rnd] = 'full';
            }
            seqNum = getRowSeq(currRow);
        }

        seqNum = getRowSeq(currRow);
        seqNum = 0;
    }
}

function reduceCols(){
    for (var col = 1; col <= side; col++){
        var currCol = [];
        for (var row = 1; row <= side; row++){
            currCol.push(gameArr[row+'-'+col]);
        }

        // reduce number of sequences to maxColSeq
        var seqNum = getColSeq(currCol);
        while (seqNum > maxColSeq){
            var rnd = getRandomInt(0, (side -1));
            if (currCol[rnd] == 'empty'){
                gameArr[(rnd+1)+'-'+col] = 'full';
                currCol[rnd] = 'full';
            }
            seqNum = getColSeq(currCol);
        }

        seqNum = getColSeq(currCol);
        seqNum = 0;
    }
}

function gameOver(){
    console.log('Game over :-(');
    for (var row = 1; row <= side; row++){
        for (var col = 1; col <= side; col++){
            var squareId = row+'-'+col;
            if (gameArrOrig[squareId] == 'full'){ // can't use gameArr, since value of the revealed full squares is not 'full' anymore
                document.getElementById(squareId).classList.add("full");
                document.getElementById(squareId).innerHTML = '&nbsp;';
            }
            else {
                document.getElementById(squareId).innerHTML = 'X';
            }
            gameArr[squareId] = '-';
        }
    }
}

function checkSquare(squareId){
    if (gameArr[squareId] != '-'){
        if (cursorMode == 'hint'){
            if (currentHints > 0){
                if (gameArr[squareId] == 'full'){
                    document.getElementById(squareId).classList.add("full");
                    removeHint();
                    console.log('Hint - full');
                }
                else {
                    document.getElementById(squareId).innerHTML = 'X';
                    removeHint();
                    console.log('Hint - X');
                }  
            }
        }
        else {
            if (gameArr[squareId] == cursorMode){
                if (cursorMode == 'full'){
                    document.getElementById(squareId).classList.add("full");
                    console.log('OK - full');
                }
                else {
                    document.getElementById(squareId).innerHTML = 'X';
                    console.log('OK - X');
                }
                
            }
            else {
                if (gameArr[squareId] == 'full'){
                    document.getElementById(squareId).classList.add("full");
                    removeHeart();
                    console.log('ERROR - full');
                }
                else {
                        document.getElementById(squareId).innerHTML = 'X';
                        removeHeart();
                        console.log('ERROR - X');
                }
            }
        }

    }
    else {
        gameArr[squareId] = '-';
    }
}

function removeHeart(){
    currentHearts -= 1;
    heartsOut = '';
    for (var i = 1; i <= currentHearts; i++){
        heartsOut += '<i class="fas fa-heart"></i> ';
    }
    if (currentHearts != maxHearts){
        for (var i = 1; i <= (maxHearts - currentHearts); i++){
            heartsOut += '<i class="fas fa-times"></i> ';
        }
    }
    document.getElementById('hearts').innerHTML = heartsOut;
    if (currentHearts == 0){
        gameOver();
    }
}

function removeHint(){
    if (currentHints > 0){
       currentHints -= 1;
        hintsOut = '';
        for (var i = 1; i <= currentHints; i++){
            hintsOut += '<i class="fas fa-lightbulb"></i> ';
        }
        if (currentHints != maxHints){
            for (var i = 1; i <= (maxHints - currentHints); i++){
                hintsOut += '<i class="fas fa-times"></i> ';
            }
        }
        document.getElementById('hints').innerHTML = hintsOut;     
    }
}

function setCursor(targetState){
    if (targetState == 'empty'){
        cursorMode = targetState;
        document.getElementById('cursorSquare').style.color='#e0e0e0';
        document.getElementById('cursorEmpty').style.color='black';
        document.getElementById('cursorHint').style.color='#e0e0e0';
    }
    else if (targetState == 'hint'){
        cursorMode = targetState;
        document.getElementById('cursorSquare').style.color='#e0e0e0';
        document.getElementById('cursorEmpty').style.color='#e0e0e0';
        document.getElementById('cursorHint').style.color='black';
    }
    else {
        cursorMode = targetState;
        document.getElementById('cursorSquare').style.color='black';
        document.getElementById('cursorEmpty').style.color='#e0e0e0';
        document.getElementById('cursorHint').style.color='#e0e0e0';
    }
}

function resetHints(){
    currentHints = maxHints;
    hintsOut = '';
    for (var i = 1; i <= currentHints; i++){
        hintsOut += '<i class="fas fa-lightbulb"></i> ';
    }
    document.getElementById('hints').innerHTML = hintsOut;     
}

function resetHearts(){
    currentHearts = maxHearts;
    heartsOut = '';
    for (var i = 1; i <= currentHearts; i++){
        heartsOut += '<i class="fas fa-heart"></i> ';
    }
    document.getElementById('hearts').innerHTML = heartsOut;
}

function deepCopyObj(sourceObj){
    return JSON.parse(JSON.stringify(sourceObj));
}

function newGameWrapper(newMode, reset){
    console.clear();
    setCursor('full');
    resetHearts();
    resetHints();
    if (reset == 1){
        gameArr = {};
        gameArr = deepCopyObj(gameArrOrig);
        cols = colsOrig;
        rows = rowsOrig;
    }
    else {
        mode = newMode;
        if (newMode == 'veasy'){
            side = 10;
            maxRowSeq = maxRowSeqV;
            maxColSeq = maxColSeqV;
        }
        else if (newMode == 'easy'){
            side = 10;
            maxRowSeq = maxRowSeqE;
            maxColSeq = maxColSeqE;
        }
        else if (newMode == 'medium'){
            side = 15;
            maxRowSeq = maxRowSeqM;
            maxColSeq = maxColSeqM;
        }
        else {
            side = 15;
            maxRowSeq = maxRowSeqH;
            maxColSeq = maxColSeqH;
        }
        // create gameArr
        createGameState();
        console.log(gameArr);
    }
    newGame();
}

function newGame(){

    countRows(rows);
    countCols(cols);

    // create game table HTML
    var out = "<table id=\"game\">\n<tbody>\n";

    if (mode == 'veasy'){
        var bg_class = 'bg-success';
    }
    else if (mode == 'easy'){
        var bg_class = 'bg-primary';
    }
    else if (mode == 'medium') {
        var bg_class = 'bg-warning';
    }
    else {
        var bg_class = 'bg-danger';
    }

    for (var row = 0; row <= side; row++){

        var td_row_class = '';

        if (row == 1){ td_row_class += 'td_r_1 '; }
        if (row % 5 == 0){ td_row_class += 'td_r_5 '; }

        out += "<tr>\n";
        if (row == 0){
            for (var col = 0; col <= side; col++){
                var td_col_class = '';
                if (col == 1){ td_col_class += 'td_c_1 '; }
                if (col % 5 == 0){ td_col_class += 'td_c_5 '; }

                td_row_class += 'td_r_1 ';

                if (col == 0){
                    td_col_class += 'td_c_1 ';
                    out += "<td style=\"width: 110px; height: 100px;\" class=\""+td_row_class+" "+td_col_class+" "+bg_class+" align-middle text-center th\">&nbsp;</td>\n";
                    td_col_class = '';
                }
                else {
                    var colHTML = cols[col-1].join('<br>');
                    out += "<td class=\""+td_row_class+" "+td_col_class+" align-bottom text-center bg-light th\">"+colHTML+"</td>\n";
                    td_col_class = '';
                }
            }
        }
        else {
            var rowHTML = rows[row-1].join('&nbsp;&nbsp');

            for (var col = 0; col <= side; col++){

                if (col == 1 || col == 0){ td_col_class += 'td_c_1 '; }
                if (col % 5 == 0){ td_col_class += 'td_c_5 '; }

                if (col == 0){
                    out += "<td class=\""+td_row_class+" "+td_col_class+" text-right bg-light th\" style=\"width: 110px;\">"+rowHTML+"&nbsp;</td>\n";
                    td_col_class = '';
                }
                else {
                    out += "<td class=\""+td_row_class+" "+td_col_class+" td align-middle text-center\" id=\""+row+"-"+col+"\" onclick=\"checkSquare('"+row+"-"+col+"');\">&nbsp;&nbsp;</td>\n";
                    td_col_class = '';
                }
            }
        }
        out += "</tr>";
    }
    out += "</tbody>\n</table>\n";

    document.getElementById('game').innerHTML = out;
}
