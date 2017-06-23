$(document).ready(function() {

// regex test function
/*-------------------------------------------------------------------\\
    let pattern = /\$?\s*?\.?[0-9]+(?:,?[0-9]+)*(?:\.[0-9]+)?/,

        strList = ['$1.00', '12', '.0009', '$.123', '$123,456.789',
                   '999999', 'a4', '4a. 00a', 'abc ', '!@#$%^&*()',
                   '$  4. 000', '$!^$%5..00', '$ 1, 234, 567 . 000 11'];

    function testRegEx(strs, reg) {
        return strs.filter(function(str) {
            return str.match(reg);
        }).map(function(str) {
            return str
                .replace(/\.+/, '.')
                .replace(/[^0-9.]/g, '');
        });
    }

    testRegEx(strList, pattern);
//-------------------------------------------------------------------*/

// HIGHSCORE GLOBALS
//====================
    let globalHigh = {
        initBet:  0,
        amtLeft:  0,
        amtMax:   0,
        totRolls: 0,
        maxRolls: 0
    };
//====================


// input validation helper function
// simulates HTML5 'number' field behavior
//-------------------------------------------------------------------\\
    function validate(str) {
        
        // match integers or floats, with formatting accommodations
        // ex: $1, $1.00, 10, 1.00000, $.10, .00001, $ 1,234 . 00, etc.
        let pattern = /^\$?\s*?\.?[0-9]+(?:,?[0-9]+)*(?:\.[0-9]+)?$/,
            numStr  = '';
        
        if (!str.match(pattern)) {
            alert("Starting bet must be a positive number.")
            return false;
        } else {
            numStr = str.replace(/\.+/, '.') // condense decimals
                        .replace(/[^0-9.]/g, ''); // strip non-numeric
            
            if (parseInt(numStr) > 9999999) {
                alert("Integer-part of bet cannot exceed length of 7."
                      + "\n\nCalculation is too resource-intensive."
                      + "\n\nFractional-part can be any length.");
                return false;
            } else {
                return numStr;
            }
        }
    }
//-------------------------------------------------------------------//


// score comparison helper function
//-------------------------------------------------------------------\\
    function compScores(cur, top) {
        
        // assign current scores to high scores when former > latter
        for (let key in cur) {
            if (cur[key] > top[key]) {
                top[key] = cur[key];
            }
        }
        return top;
    }
//-------------------------------------------------------------------//

    
// main game logic loop
//-------------------------------------------------------------------\\
    function calcResults(bet) {
        
        let initBet  = 0,
            amtLeft  = 0,
            amtMax   = 0,
            totRolls = 0,
            maxRolls = 0,
            die1     = 0,
            die2     = 0;
        
        initBet = amtLeft = amtMax = parseFloat(bet);
        
        while (amtLeft > 0) { // game is active
            
            // get random dice values
            die1 = Math.ceil(Math.random() * 6);
            die2 = Math.ceil(Math.random() * 6);
            
            totRolls++; // increment roll count
            
            // iterate game rule
            (die1 + die2 === 7) ? amtLeft += 4 : amtLeft--;
            
            // set new max values
            if (amtLeft > amtMax) {
                amtMax = amtLeft;
                maxRolls = totRolls;
            }
        }
        return {
            initBet: initBet,
            amtLeft: amtLeft,
            amtMax: amtMax,
            totRolls: totRolls,
            maxRolls: maxRolls
        }
    }
//-------------------------------------------------------------------//


// event handlers
//-------------------------------------------------------------------\\
    $("#results").hide();
    
    $("#play").on('click', function(event) {
        
        let input = $("#bet_input").val(),
            valid = validate(input);
        
        if (valid) { // run game only if input validated
            let curScores = calcResults(valid),
                topScores = compScores(curScores, globalHigh);
            
            // update UI: current scores
            $("#bet_amt").text("$" + curScores.initBet.toFixed(2));
            $("#num_rolls").text(curScores.totRolls);
            $("#max_won").text("$" + curScores.amtMax.toFixed(2));
            $("#max_rolls").text(curScores.maxRolls);
            
            // update UI: top scores
            $("#bet_amt_top").text("$" + topScores.initBet.toFixed(2));
            $("#num_rolls_top").text(topScores.totRolls);
            $("#max_won_top").text("$" + topScores.amtMax.toFixed(2));
            $("#max_rolls_top").text(topScores.maxRolls);
            
            $("#results").slideDown("slow");
            $("#play").prop('value', 'Play Again');
        }
    });
    
    $("#reset").on('click', function(event) {
        globalHigh = {
            initBet:  0,
            amtLeft:  0,
            amtMax:   0,
            totRolls: 0,
            maxRolls: 0
        }
        $("#results").hide("fast");
        $("#bet_input").val('');
        $("#bet_input").focus();
    });
//-------------------------------------------------------------------//
}); // EOF