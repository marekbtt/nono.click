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
var maxRowSeq = 5;
var maxColSeq = 5;

// above trashold easify function will be applies once
var numRowSeqTreshold = 3;
var numColSeqTreshold = 3;

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
    for ( var row = 1; row <= side; row++ ){
        var rowInfo = [];
        var c = 0;
        for ( var col = 1; col <= side; col++ ){

            if ( col == 1 ){
                var previous = gameArr[row+'-'+col];
                var current = previous;
            }
            else {
                var current = gameArr[row+'-'+col];
            }

            if ( current == previous ){
                c++;
                if ( col == side && current == 'full' ){
                    rowInfo.push(c);
                }
            }
            else {
                if ( previous == 'full' ){
                    rowInfo.push(c);
                }
                c = 1;
                if ( col == side && current == 'full' ){
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
    for ( var col = 1; col <= side; col++ ){
        var colInfo = [];
        var c = 0;

        for ( var row = 1; row <= side; row++ ){

            if ( row == 1 ){
                var previous = gameArr[row+'-'+col];
                var current = previous;
            }
            else {
                var current = gameArr[row+'-'+col];
            }

            if ( current == previous ){
                c++;
                if ( row == side && current == 'full' ){
                    colInfo.push(c);
                }
            }
            else {
                if ( previous == 'full' ){
                    colInfo.push(c);
                }
                c = 1;
                if ( row == side && current == 'full' ){
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
    for ( var row = 0; row <= side; row++ ){
        for ( var col = 0; col <= side; col++ ){
            if ( (Math.floor(Math.random()*10)+1) % 2 == 0 ){
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

//#####################

function getRandomInt(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getSeq(currRow){
    seqNum = 0;
    currCell = '';
    prevCell = '';
    for (i = 0; i < currRow.length; i++) { 
        if ( currRow[i] == 'full' && currRow[i] != prevCell ){
            seqNum ++;
        }
        prevCell = currRow[i];
    }
    return seqNum;
}

function reduceRows(){
    console.log('function:reduceRows');
    currRow = [];
    for ( var row = 1; row <= side; row++ ){
        currRow = [];
        for ( var col = 1; col <= side; col++ ){
            currRow.push(gameArr[row+'-'+col]);
        }
        console.log('row:'+row);
        console.log(currRow);

        // reduce number of sequences to max 5
        var seqNum = getSeq(currRow);
        while ( seqNum >= 4 ){
            console.log('sequences:'+seqNum);
            var rnd = getRandomInt(0, 9);
            if ( currRow[rnd] == 'empty' ){
                console.log('found empty one:'+rnd);
                gameArr[row+'-'+(rnd+1)] = 'full';
                currRow[rnd] = 'full';
            }
            seqNum = getSeq(currRow);
            console.log('sequences after reduce:'+seqNum);
        }

        // run it one more time if there are >= 3 sequences
        if ( seqNum >= 3 ){
            console.log('still more than 3 sequences:'+seqNum);
            while (1){
                var rnd = getRandomInt(0, 9);
                console.log('rnd:'+rnd);
                if ( currRow[rnd] == 'empty' ){
                    console.log('found empty one:'+rnd);
                    gameArr[row+'-'+(rnd+1)] = 'full';
                    currRow[rnd] = 'full';
                    break;
                } 
            }
        }
        console.log(currRow);
        seqNum = getSeq(currRow);
        console.log('sequences:'+seqNum);
        seqNum = 0;
        console.log('*************************************');
    }
}

function reduceCols(){

}

function gameOver(){
    console.log('Game over :-(');
    for ( var row = 1; row <= side; row++ ){
        for ( var col = 1; col <= side; col++ ){
            var squareId = row+'-'+col;
            if ( gameArr[squareId] == 'full' ){
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
    if ( gameArr[squareId] != '-' ){
        if ( cursorMode == 'hint' ){
            if ( currentHints > 0 ){
                if ( gameArr[squareId] == 'full' ){
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
            if ( gameArr[squareId] == cursorMode ){
                if ( cursorMode == 'full' ){
                    document.getElementById(squareId).classList.add("full");
                    console.log('OK - full');
                }
                else {
                    document.getElementById(squareId).innerHTML = 'X';
                    console.log('OK - X');
                }
                
            }
            else {
                if ( gameArr[squareId] == 'full' ){
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
    gameArr[squareId] = '-';
}

function removeHeart(){
    currentHearts -= 1;
    heartsOut = '';
    for ( i = 1; i <= currentHearts; i++ ){
        heartsOut += '<i class="fas fa-heart"></i> ';
    }
    if ( currentHearts != maxHearts ){
        for ( i = 1; i <= (maxHearts - currentHearts); i++ ){
            heartsOut += '<i class="fas fa-times"></i> ';
        }
    }
    document.getElementById('hearts').innerHTML = heartsOut;
    if ( currentHearts == 0 ){
        gameOver();
    }
}

function removeHint(){
    if ( currentHints > 0 ){
       currentHints -= 1;
        hintsOut = '';
        for ( i = 1; i <= currentHints; i++ ){
            hintsOut += '<i class="fas fa-lightbulb"></i> ';
        }
        if ( currentHints != maxHints ){
            for ( i = 1; i <= (maxHints - currentHints); i++ ){
                hintsOut += '<i class="fas fa-times"></i> ';
            }
        }
        document.getElementById('hints').innerHTML = hintsOut;     
    }
}

function setCursor(targetState){
    if ( targetState == 'empty' ){
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
    for ( i = 1; i <= currentHints; i++ ){
        hintsOut += '<i class="fas fa-lightbulb"></i> ';
    }
    document.getElementById('hints').innerHTML = hintsOut;     
}

function resetHearts(){
    currentHearts = maxHearts;
    heartsOut = '';
    for ( i = 1; i <= currentHearts; i++ ){
        heartsOut += '<i class="fas fa-heart"></i> ';
    }
    document.getElementById('hearts').innerHTML = heartsOut;
}

function deepCopyObj(sourceObj){
    return JSON.parse(JSON.stringify(sourceObj));
}

function newGameWrapper(newMode, reset){
    if ( reset == 1 ){
        gameArr = {};
        console.log(gameArr);
        console.log(gameArrOrig);
        gameArr = deepCopyObj(gameArrOrig);
        cols = colsOrig;
        rows = rowsOrig;
        setCursor('full');
        resetHearts();
        resetHints();
    }
    else {
        mode = newMode;
        if ( newMode == 'veasy' ){
            side = 10;
        }
        else if ( newMode == 'easy' ){
            side = 10;
        }
        else if ( newMode == 'medium' ){
            side = 15;
        }
        else {
            side = 15;
        }
        // create gameArr
        createGameState();
    }
    newGame();
}

function newGame(){

    countRows(rows);
    countCols(cols);

    // create game table HTML
    var out = "<table id=\"game\">\n<tbody>\n";

    if ( mode == 'veasy' ){
        var bg_class = 'bg-success';
    }
    else if ( mode == 'easy' ){
        var bg_class = 'bg-primary';
    }
    else if ( mode == 'medium' ) {
        var bg_class = 'bg-warning';
    }
    else {
        var bg_class = 'bg-danger';
    }

    for ( var row = 0; row <= side; row++ ){

        var td_row_class = '';

        if ( row == 1 ){ td_row_class += 'td_r_1 '; }
        if ( row % 5 == 0 ){ td_row_class += 'td_r_5 '; }

        out += "<tr>\n";
        if ( row == 0 ){
            for ( var col = 0; col <= side; col++ ){
                var td_col_class = '';
                if ( col == 1 ){ td_col_class += 'td_c_1 '; }
                if ( col % 5 == 0 ){ td_col_class += 'td_c_5 '; }

                td_row_class += 'td_r_1 ';

                if ( col == 0 ){
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

            for ( var col = 0; col <= side; col++ ){

                if ( col == 1 || col == 0 ){ td_col_class += 'td_c_1 '; }
                if ( col % 5 == 0 ){ td_col_class += 'td_c_5 '; }

                if ( col == 0 ){
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
