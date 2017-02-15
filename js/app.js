function randomDice() { // Random number from 1-6, decides dice.
  return Math.ceil(Math.random() * 6);
}

function arrayToInt(array) { // Changes the string numbers in an array to integers
  return array.map(function (x) {
    return parseInt(x, 10);
  });
}

function removeValue(array, value) { // Removes all instances of a specific value from an array
  for(var i = array.length; i--;){
    if (array[i] === value) {
      array.splice(i, 1);
    }
  }
  return array;
}

function arraySum(array) { // Converts all strings to integers then adds them all together
  const result = arrayToInt(array);
  return result.reduce((a, b) => a + b, 0);
}

function fullHouse(array) { // Full house logic, 2 pair and 3 of a kind.
  if (array.length < 5) {
    return false;
  } else if ((array[0] === array[1] && array[1] === array[2] && array[3] === array[4]) || (array[0] === array[1] && array[2] === array[3] && array[3] === array[4])) {
    return true;
  }
  return false;
}

function smallStraight(array) { // Logic for a large straight (4 unique numbers from 1-4,2-5,3-6)
  if (array.length < 4) {
    return false;
  } else if ((array[0] === 1 && array[1] === 2 && array[2] === 3 && array[3] === 4) || (array[0] === 2 && array[1] === 3 && array[2] === 4 && array[3] === 5) || (array[0] === 3 && array[1] === 4 && array[2] === 5 && array[3] === 6)) {
    return true;
  }
  return false;
}

function largeStraight(array) { // Logic for a large straight (5 unique numbers from 1-5,2-6), only works for 1-6
  if (array.length < 5) {
    return false;
  } else if ((array[0] === 1 && array[1] === 2 && array[2] === 3 && array[3] === 4 && array[4] === 5) || (array[0] === 2 && array[1] === 3 && array[2] === 4 && array[3] === 5 && array[4] === 6)) {
    return true;
  }
  return false;
}

function yahtzee(array) { // Five of a kind, simples! Filters duplicates, so if only 1 value is left, the rest were the same!
  array = removeDuplicates(array);
  if (array.length === 1) {
    return true;
  }
  return false;
}

function removeDuplicates(array) { //Used for straights, removes duplicate values (duh)
  return array.filter(function(element, index) {
    return array.indexOf(element) === index;
  });
}

function bonusCalc(array) { // Calculates the bonus which only counts the scores in the 1-6 category
  array = arrayToInt(array);
  array = array.splice(Number, 6);
  return arraySum(array);
}

// values used to determine the score of player 1 and 2, defined here for easy reassignment
let one = 0;
let two = 0;
let three = 0;
let four = 0;
let five = 0;
let six = 0;
// Used as a way to ignore the loop in the large logic function, using the falsy-ness of 0 compared to positive numbers
let threeKindCheck = 0;
let fourKindCheck = 0;

let diceInPlay = [];
let player = 1; // Player 1 is the number 1, 2 is 2. Used to also decide who's turn and what scoreboard to update.

$(() => {
  const $playingDice = $('.big'); // Finds the dice used to play. Already added with this class in the html.

  // The area where each player can hold dice so that it doesn't reroll
  const $board1 = $('div.player1');
  const $board2 = $('div.player2');

  const $scrambler = $('.scrambler'); // The area where the dice can be rolled
  const $button = $('button'); // The button to roll it
  const $rolls = $('#rolls'); // The span that holds the text for amount of rolls left
  let rollsLeft = $rolls.text();

   // The specific spans around the bonus and upper totals, as they are only calculated at the end.
  const $bonus1 = $('.bonus.p1');
  const $bonus2 = $('.bonus.p2');
  const $upper1 = $('.upper.p1');
  const $upper2 = $('.upper.p2');

  let turn = 0;
  let $p1on = $('.p1.on');
  let $p2on = $('.p2.on');
  // Score identifiers
  let $ones = null;
  let $twos = null;
  let $threes = null;
  let $fours = null;
  let $fives = null;
  let $sixes = null;
  let $fullHouse = null;
  let $threeKind = null;
  let $fourKind = null;
  let $yahtzee = null;
  let $smallStraight = null;
  let $largeStraight = null;
  let $chance = null;
  const $total1 = $('.grandtotal.p1');
  const $total2 = $('.grandtotal.p2');

  function generateDice() { //Generate a random number, which sets the data attribute and image as the same thing
    $.each($playingDice, (index, element) => {
      const num = randomDice(); // Sets this every time so that it generates a new number
      $(element).attr({'src': `images/${num}.png`, 'data-dice': num});
    });
  }

  function initialRoll() {
    const multiple = setInterval(() => {
      generateDice();
    }, 200);
    setTimeout(() => {
      clearInterval(multiple);
      $button.on('click', rollDice);
      pushArray();
    }, 2000);
  }

  function redifineValues(player) { // Changes the variables depending on the player number (1 = player1(p1), 2 = player2(p2))
    $ones = $(`.p${player}.ones.on`);
    $twos = $(`.p${player}.twos.on`);
    $threes = $(`.p${player}.threes.on`);
    $fours = $(`.p${player}.fours.on`);
    $fives = $(`.p${player}.fives.on`);
    $sixes = $(`.p${player}.sixes.on`);
    $fullHouse = $(`.p${player}.fullHouse.on`);
    $threeKind = $(`.p${player}.threeKind.on`);
    $fourKind = $(`.p${player}.fourKind.on`);
    $yahtzee = $(`.p${player}.yahtzee.on`);
    $smallStraight = $(`.p${player}.smallStraight.on`);
    $largeStraight = $(`.p${player}.largeStraight.on`);
    $chance = $(`.p${player}.chance.on`);
  }

  function rollDice() {
    if (player === 1) {
      $p1on.off();
      $p1on.on('click', lockScore);
    } else {
      $p2on.off();
      $p2on.on('click', lockScore);
    }
    $('.big').off();
    $('.big').on('click', keepDice);
    rollsLeft = $rolls.text();
    rollsLeft--;
    $rolls.text(rollsLeft);
    if (rollsLeft === 0) {
      $.each($scrambler.find($('.big')), (index, element) => {
        const num = randomDice();
        $(element).attr({'src': `images/${num}.png`, 'data-dice': num});
      });
      $button.off();
      $rolls.text('NOPE');
      pushArray();
      checkScoring(player);
    } else {
      $.each($scrambler.find($('.big')), (index, element) => {
        const num = randomDice();
        $(element).attr({'src': `images/${num}.png`, 'data-dice': num});
      });
      pushArray();
      checkScoring(player);
    }
  }

  function pushArray() {
    diceInPlay = [];
    for (let i = 0; i < 5; i++) {
      diceInPlay.push($playingDice.eq(i).attr('data-dice'));
    }
    diceInPlay = diceInPlay.sort();
  }

  function disableBoards() {
    const $board1img = $board1.find($('.big'));
    $board1img.off();
    $board1img.on('click', (e) => {
      $scrambler.append($(e.target));
      pushToScrambler();
    });
    const $board2img = $board2.find($('.big'));
    $board2img.off();
    $board2img.on('click', (e) => {
      $scrambler.append($(e.target));
      pushToScrambler();
    });
  }

  function keepDice(e) {
    if (player === 1) {
      $board1.append($(e.target));
    } else {
      $board2.append($(e.target));
    }
    disableBoards();
  }

  function pushToScrambler() {
    const $img = $scrambler.find('.big');
    $img.off();
    $img.on('click', keepDice);
  }

  function checkScoring(player) {
    // Reinitialising the values every time so that they don't accumulate and keep adding up.
    one = two = three = four = five = six = threeKindCheck = fourKindCheck = 0;

    const sum = arraySum(diceInPlay); // The sum of numbers of the dice in play (duh)
    diceInPlay = arrayToInt(diceInPlay); // Turning the array of dice numbers to integers
    const filteredDice = removeDuplicates(diceInPlay); // Adding a filtered version where duplicates are removed for easier calculation of straights
    redifineValues(player);
    // Yahtzee diceInPlay (five of the same number)
    if (yahtzee(diceInPlay)) {
      $yahtzee.addClass('green');
      $yahtzee.text(50);
    } else {
      $yahtzee.removeClass('green');
      $yahtzee.text(0);
    }
    // Full house (2 of a kind and 3 of a kind)
    if (fullHouse(diceInPlay)) {
      $fullHouse.addClass('green');
      $fullHouse.text(25);
    } else {
      $fullHouse.removeClass('green');
      $fullHouse.text(0);
    }
    // Small straight (4 cosecutive incremental numbers)
    if (smallStraight(filteredDice)) {
      $smallStraight.addClass('green');
      $smallStraight.text(30);
    } else {
      $smallStraight.removeClass('green');
      $smallStraight.text(0);
    }
    // Large straight (5 consecutive incremental numbers)
    if (largeStraight(filteredDice)) {
      $largeStraight.addClass('green');
      $largeStraight.text(40);
    } else {
      $largeStraight.removeClass('green');
      $largeStraight.text(0);
    }
    // Chance logic (seriously its just an accumulation of all numbers it aint even logic like seriously)
    $chance.addClass('green');
    $chance.text(sum);
    diceInPlay.forEach(function(element, i, array) {
      const index = i;
      // Single numbers
      if (element === 1) {
        $ones.text(0);
        one++;
        $ones.addClass('green');
        $ones.text(one);
      } else if (!array.includes(1)) {
        $ones.text(0);
        $ones.removeClass('green');
      }
      if (element === 2) {
        $twos.text(0);
        two += 2;
        $twos.addClass('green');
        $twos.text(two);
      } else if (!array.includes(2)) {
        $twos.text(0);
        $twos.removeClass('green');
      }
      if (element === 3) {
        $threes.text(0);
        three += 3;
        $threes.addClass('green');
        $threes.text(three);
      } else if (!array.includes(3)) {
        $threes.text(0);
        $threes.removeClass('green');
      }
      if (element === 4) {
        $fours.text(0);
        four += 4;
        $fours.addClass('green');
        $fours.text(four);
      } else if (!array.includes(4)) {
        $fours.text(0);
        $fours.removeClass('green');
      }
      if (element === 5) {
        $fives.text(0);
        five += 5;
        $fives.addClass('green');
        $fives.text(five);
      } else if (!array.includes(5)) {
        $fives.text(0);
        $fives.removeClass('green');
      }
      if (element === 6) {
        $sixes.text(0);
        six += 6;
        $sixes.addClass('green');
        $sixes.text(six);
      } else if (!array.includes(6)) {
        $sixes.text(0);
        $sixes.removeClass('green');
      }
      // Three of a kind
      if (array[index] === array[index + 1] && array[index + 1] === array[index + 2] && !$threeKind.attr('id')) {
        $threeKind.addClass('green');
        $threeKind.text(sum);
        threeKindCheck++;
      } else if (!threeKindCheck && !$threeKind.attr('id')) {
        $threeKind.removeClass('green');
        $threeKind.text(0);
      }
      // Four of a kind
      if (array[index] === array[index + 1] && array[index + 1] === array[index + 2] && array[index + 2] === array[index + 3] && !$fourKind.attr('id')) {
        $fourKind.addClass('green');
        $fourKind.text(sum);
        fourKindCheck++;
      } else if (!fourKindCheck && !$fourKind.attr('id')) {
        $fourKind.removeClass('green');
        $fourKind.text(0);
      }
    });
  }

  function returnToScrambler() {
    $scrambler.append($board1.find('.big'));
    $scrambler.append($board2.find('.big'));
  }

  function tallyScores() {
    let p1grandtotal = $('.p1').map(function() {
      return $(this).text();
    }).get();
    if (bonusCalc(p1grandtotal) >= 63) {
      $bonus1.text(35);
      p1grandtotal.push(35);
    } else {
      $bonus1.text(0);
      $bonus1.addClass('grey');
    }
    $upper1.text(bonusCalc(p1grandtotal));
    p1grandtotal = removeValue(p1grandtotal, '-');
    p1grandtotal = arraySum(p1grandtotal);
    $total1.text(p1grandtotal);
    let p2grandtotal = $('.p2').map(function() {
      return $(this).text();
    }).get();
    if (bonusCalc(p2grandtotal) >= 63) {
      $bonus2.text(35);
      p2grandtotal.push(35);
    } else {
      $bonus2.text(0);
      $bonus2.addClass('grey');
    }
    $upper2.text(bonusCalc(p2grandtotal));
    p2grandtotal = removeValue(p2grandtotal, '-');
    p2grandtotal = arraySum(p2grandtotal);
    $total2.text(p2grandtotal);
    if (p1grandtotal > p2grandtotal) {
      $total1.attr('id', 'winner');
      $total2.attr('id', 'loser');
    } else {
      $total2.attr('id', 'winner');
      $total1.attr('id', 'loser');
    }
  }

  function lockScore(e) { //Locks the score of the category you click, also changes players. It currently does an extra bit of everything but will be refactored later.
    returnToScrambler();
    $rolls.text(3);
    $button.off();
    $button.on('click', rollDice);
    $(e.target).attr('id', 'completed');
    if ($(e.target).text() === '0') {
      $(e.target).attr('id', 'fail');
    }
    $(e.target).removeClass('on');
    if (player === 1) {
      player++;
      $('.big').off();
      $p1on = $('.p1.on');
      $p1on.removeClass('green');
      $p1on.text(0);
      $p1on.off();
    } else {
      player--;
      $p2on = $('.p2.on');
      $p2on.removeClass('green');
      $p2on.text(0);
      $p2on.off();
    }
    turn++;
    if (turn === 26) {
      tallyScores();
    }
  }

  initialRoll();

});
