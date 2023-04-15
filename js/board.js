gameEnd = false;

// game board cell
function placeCell(cellNumber) {
    $(".board").append("<div class='board-cell'>" + cellNumber + "</div>");
}
let cell = 100;
let progress = "";
while (cell > 0) {
    placeCell(cell);
    if (cell % 10 == 0) {
        progress = "minus";
        if (Math.floor(cell / 10) % 2 == 1) {
            cell -= 10;
            if (cell != 0) {
                placeCell(cell);
            }
        }
    }
    if (cell % 10 == 1) {
        progress = "plus";
        if (Math.floor(cell / 10) % 2 == 1) {
            cell -= 10;
            placeCell(cell);
        }
    }
    if (progress == "minus") {
        cell -= 1;
    }
    else {
        cell += 1;
    }
}





// tokens 
let tokens = {
    redToken: 0,
    greenToken: 0,
    blueToken: 0,
    yellowToken: 0
}
let tokenWidth = $(".board-cell").outerWidth();
let tokenHeight = $(".board-cell").outerHeight();
$(".token").css({ height: tokenHeight, width: tokenWidth });

function placeToken(token, position) {
    let tokenCordinate = calculateTokenPosition(position);
    $(token).css({ bottom: tokenCordinate.bottom, right: tokenCordinate.right })
}
function calculateTokenPosition(tokenCellNumber) {
    if (tokenCellNumber == 0) {
        return { "right": "100vw", "bottom": "0" };
    }
    let position = {};
    let checker = Math.floor(tokenCellNumber / 10);
    if (tokenCellNumber % 10 == 0) {
        if (checker % 2 == 1) {
            position.right = 0;
        }
        else {
            position.right = tokenWidth * 9;
        }
        position.bottom = tokenHeight * (checker - 1);

    }
    else {

        if (checker % 2 == 0) {
            position.right = tokenWidth * (10 - (tokenCellNumber % 10));
        }
        else {
            position.right = tokenWidth * ((tokenCellNumber % 10) - 1);

        }
        position.bottom = tokenHeight * checker;

    }

    return position;

}


// ladder script
let ladderBottoms = [7, 51, 65,41];
let ladderTops = [34,90,96,61];
let ladderStart, ladderEnd;
function addLadders(){
    for (let i = 0; i <= 4; i++) {
        ladderStart = calculateTokenPosition(ladderBottoms[i]);
        ladderEnd = calculateTokenPosition(ladderTops[i]);

        ladderHeight = Math.sqrt((ladderStart.bottom - ladderEnd.bottom) ** 2 - (ladderStart.right - ladderEnd.right) ** 2);
        let x = i+1;
        $("#ladder-"+ x).css({
            height: ladderHeight,
            width: tokenWidth,
            bottom: ladderStart.bottom + (tokenHeight / 2),
            right: ladderStart.right
        })

    }

}
addLadders();

//snake script
let snakeTops = [45,87,99];
let snakeBottoms = [16,47,2];
let snakeStart, snakeEnd;
function addSankes(){
    for (let i = 0; i <= 2; i++) {

        snakeStart = calculateTokenPosition(snakeBottoms[i]);
        snakeEnd = calculateTokenPosition(snakeTops[i]);
        snakeHeight = Math.sqrt((snakeStart.bottom - snakeEnd.bottom) ** 2 - (snakeStart.right - snakeEnd.right) **2);

        let x = i+1;
        $("#snake-"+x+" .snake-head").css({
            height: tokenHeight/1.6,
            width: tokenWidth
        });
        $("#snake-"+ x+" .snake-body").css({
            height: snakeHeight - (tokenHeight/1.6),
            width: tokenWidth
        });
        $("#snake-"+x).css({
            height: snakeHeight,
            width: tokenWidth,
            bottom: snakeStart.bottom + (tokenHeight / 2),
            right: snakeStart.right - (tokenWidth/4)
            
        })

    }

}
addSankes();





// game msg
function gameMessage(msgType, msgContent) {
    let color = "#198754";
    if (msgType == "danger") {
        color = "#dc3545";
    }
    $(".game-msg").css("background-color", color).text(msgContent).fadeIn(800).fadeOut(800);
}

//dice
let playerNumber;
$('#player-number > input[type="button"]').click(function(){
    playerNumber = $('#player-number > input[type="text"]').val();
    if($.isNumeric(playerNumber) && playerNumber <= 4 && playerNumber > 1){
        $("#player-number").parent().css("display","none");
        $(".board-main").css("opacity","1")
    } 
    else {
        $('#player-number > input[type="text"]').val("");
        gameMessage("danger","Not available please try Again!!!")
    }
});
let dicideTurn = 0;
function ladderCheck(position){
    let l = ladderBottoms.length;
    for(let i = 0; i < l; i++){
        if(position == ladderBottoms[i]){
            return i;
        }
    }
    return -1;

}
function snakecheck(position){
    let l = snakeTops.length;
    for(let i=0;i<l;i++)
        if(position == snakeTops[i])
            return i;
    return -1;    
}

function play(player, playerID, dice) {
    

    if (tokens[player] == 0 && dice != 6) {
        gameMessage("danger", "Need to 6 to start");
    }
    else if (tokens[player] == 0 && dice == 6) {
        tokens[player] = 1;
    }
    else {        
        let sum = tokens[player] + dice;
        let ladderExist = ladderCheck(sum);
        let snakeExist = snakecheck(sum);
        if (sum > 100) {
            gameMessage("danger", "exceeding 100!");
        }
        else if (sum == 100) {
            tokens[player] = sum;
            gameEnd = true;
            gameMessage("success", "You Won!!!");
        }
        else if(ladderExist != -1){
            tokens[player] = ladderTops[ladderExist];
            if(dice != 6){
                dicideTurn -= 1;
            }
        }
        else if(snakeExist != -1){
            tokens[player] = snakeBottoms[snakeExist];
            if(dice == 6){
                dicideTurn += 1;
            }
        }
        else {
            tokens[player] = sum;
        }
    }
    placeToken(playerID, tokens[player]);


}


$("#dice").click(function () {
    if(gameEnd){
        gameMessage("danger","game ended!")
        return 0;
    }  


    let diceout = Math.floor((Math.random() * 6) + 1);
    $(this).text(diceout);
    if (dicideTurn % playerNumber == 0) {
        //red player turn
        play("redToken", "#red-token", diceout);
        dicideTurn++;
    }
    else if (dicideTurn % playerNumber == 1) {
        //green palyer turn
        play("greenToken", "#green-token", diceout);
        dicideTurn++;
    }
    else if (dicideTurn % playerNumber == 2) {
        //blue players turn
        play("blueToken", "#blue-token", diceout);
        dicideTurn++;
    }
    else if (dicideTurn % playerNumber == 3) {
        //yellow Players turn
        play("yellowToken", "#yellow-token", diceout);
        dicideTurn++;
    }
    if (diceout == 6) {
        dicideTurn -= 1;
    }

});








$(window).resize(function () {
    tokenWidth = $(".board-cell").outerWidth();
    tokenHeight = $(".board-cell").outerHeight();
    $(".token").css({ height: tokenHeight, width: tokenWidth });
    placeToken("#red-token", tokens.redToken);
    placeToken("#green-token", tokens.greenToken);
    placeToken("#blue-token", tokens.blueToken);
    placeToken("#yellow-token", tokens.yellowToken);
    addLadders();
    addSankes();
});





