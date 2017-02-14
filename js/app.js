function randomDice() {
  return Math.ceil(Math.random() * 6);
}

function arrayToInt(array) {
  return array.map(function (x) {
    return parseInt(x, 10);
  });
}

function removeValue(array, value) {
  const regex = new RegExp(value, 'g');
  return array.join('').replace(regex, '').split('');
}

function arraySum(array) {
  const result = arrayToInt(array);
  return result.reduce((a, b) => a + b, 0);
}

function fullHouse(array) {
  if (array.length < 5) {
    return false;
  } else if ((array[0] === array[1] && array[1] === array[2] && array[3] === array[4]) || (array[0] === array[1] && array[2] === array[3] && array[3] === array[4])) {
    return true;
  }
  return false;
}

function smallStraight(array) {
  if (array.length < 4) {
    return false;
  } else if ((array[0] === 1 && array[1] === 2 && array[2] === 3 && array[3] === 4) || (array[0] === 2 && array[1] === 3 && array[2] === 4 && array[3] === 5) || (array[0] === 3 && array[1] === 4 && array[2] === 5 && array[3] === 6)) {
    return true;
  }
  return false;
}

function largeStraight(array) {
  if (array.length < 5) {
    return false;
  } else if ((array[0] === 1 && array[1] === 2 && array[2] === 3 && array[3] === 4 && array[4] === 5) || (array[0] === 2 && array[1] === 3 && array[2] === 4 && array[3] === 5 && array[4] === 6)) {
    return true;
  }
  return false;
}

function removeDuplicates(array) {
  return array.filter(function(element, index) {
    return array.indexOf(element) === index;
  });
}
// values used to determine the score of player 1 and 2
let one = 0;
let two = 0;
let three = 0;
let four = 0;
let five = 0;
let six = 0;
// used to ensure that it keeps these identifiers in check by using the falsy '0' against truthy numbers
let threeKindCheck = 0;
let fourKindCheck = 0;

let check = [];
let player = 1;

$(() => {
  // const audio = document.getElementsByTagName('audio')[0];
  const $board1 = $('div.player1');
  const $board2 = $('div.player2');
  const $scrambler = $('.scrambler');
  let $images = $scrambler.find($('img'));
  const $image1 = $('#1first');
  const $image2 = $('#1second');
  const $image3 = $('#1third');
  const $image4 = $('#1fourth');
  const $image5 = $('#1fifth');
  const $button = $('button');
  const $rolls = $('#rolls');
  let score = 0;
  let rollsLeft = $rolls.text();
  let $p1on = $('.p1.on');
  let $p2on = $('.p2.on');
  // Score identifiers
  let $ones = $('.ones');
  let $twos = $('.twos');
  let $threes = $('.threes');
  let $fours = $('.fours');
  let $fives = $('.fives');
  let $sixes = $('.sixes');
  let $fullHouse = $('.fullHouse');
  let $threeKind = $('.threeKind');
  let $fourKind = $('.fourKind');
  let $yahtzee = $('.yahtzee');
  let $smallStraight = $('.smallStraight');
  let $largeStraight = $('.largeStraight');
  let $chance = $('.chance');
  let $total1 = $('.grandtotal.p1');
  let $total2 = $('.grandtotal.p2');
  // Had problems altering specific images but only finding the section that holds it.
  // let player = 1;

  // function removeValue(array, num) {
  //   const regex = new RegExp(num, 'g');
  //   return array.join('').replace(regex, '').split('');
  // }

  function generateDice() { //Generate a random number, which sets the data attribute and image as the same thing
    let num = randomDice();
    $image1.attr({'src': `images/${num}.png`, 'data-dice': num});
    num = randomDice();
    $image2.attr({'src': `images/${num}.png`, 'data-dice': num});
    num = randomDice();
    $image3.attr({'src': `images/${num}.png`, 'data-dice': num});
    num = randomDice();
    $image4.attr({'src': `images/${num}.png`, 'data-dice': num});
    num = randomDice();
    $image5.attr({'src': `images/${num}.png`, 'data-dice': num});
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

  function rollDice() {
    $('img').off();
    $('img').on('click', keepDice);
    rollsLeft = $rolls.text();
    rollsLeft--;
    $rolls.text(rollsLeft);
    if (rollsLeft === 0) {
      $images = $scrambler.find($('img'));
      $.each($images, (index, element) => {
        const num = randomDice();
        $(element).attr({'src': `images/${num}.png`, 'data-dice': num});
      });
      $button.off();
      $rolls.text('NOPE');
      pushArray();
      checkScoring(player);
    } else {
      $images = $scrambler.find($('img'));
      $.each($images, (index, element) => {
        const num = randomDice();
        $(element).attr({'src': `images/${num}.png`, 'data-dice': num});
      });
      pushArray();
      checkScoring(player);
    }
  }

  function pushArray() {
    check = [];
    for (let i = 0; i < 5; i++) {
      check.push($('img').eq(i).attr('data-dice'));
    }
    check = check.sort();
  }

  function disableBoards() {
    const $board1img = $board1.find($('img'));
    $board1img.off();
    $board1img.on('click', (e) => {
      $scrambler.append($(e.target));
      pushToScrambler();
    });
    const $board2img = $board2.find($('img'));
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
    const $img = $scrambler.find('img');
    $img.off();
    $img.on('click', keepDice);
  }

  function checkScoring(player) { //Game logic, only works for player 1 for now :<.
    one = 0;
    two = 0;
    three = 0;
    four = 0;
    five = 0;
    six = 0;
    threeKindCheck = 0;
    fourKindCheck = 0;
    const sum = arraySum(check);
    check = arrayToInt(check);
    const filteredCheck = removeDuplicates(check);
    if (player === 1) {
      $ones = $('.p1.ones.on');
      $twos = $('.p1.twos.on');
      $threes = $('.p1.threes.on');
      $fours = $('.p1.fours.on');
      $fives = $('.p1.fives.on');
      $sixes = $('.p1.sixes.on');
      $fullHouse = $('.p1.fullHouse.on');
      $threeKind = $('.p1.threeKind.on');
      $fourKind = $('.p1.fourKind.on');
      $yahtzee = $('.p1.yahtzee.on');
      $smallStraight = $('.p1.smallStraight.on');
      $largeStraight = $('.p1.largeStraight.on');
      $chance = $('.p1.chance.on');
    } else {
      $ones = $('.p2.ones.on');
      $twos = $('.p2.twos.on');
      $threes = $('.p2.threes.on');
      $fours = $('.p2.fours.on');
      $fives = $('.p2.fives.on');
      $sixes = $('.p2.sixes.on');
      $fullHouse = $('.p2.fullHouse.on');
      $threeKind = $('.p2.threeKind.on');
      $fourKind = $('.p2.fourKind.on');
      $yahtzee = $('.p2.yahtzee.on');
      $smallStraight = $('.p2.smallStraight.on');
      $largeStraight = $('.p2.largeStraight.on');
      $chance = $('.p2.chance.on');
    }
    // Yahtzee check (five of the same number)
    if (check[0] === check[1] && check[1] === check[2] && check[2] === check[3] && check[3] === check[4] && !$yahtzee.attr('id')) {
      $yahtzee.addClass('green');
      $yahtzee.text(50);
    } else {
      $yahtzee.removeClass('green');
      $yahtzee.text(0);
    }
    // Full house (2 of a kind and 3 of a kind)
    if (fullHouse(check)) {
      $fullHouse.addClass('green');
      $fullHouse.text(25);
    } else {
      $fullHouse.removeClass('green');
      $fullHouse.text(0);
    }
    // Small straight (4 cosecutive incremental numbers)
    if (smallStraight(filteredCheck)) {
      $smallStraight.addClass('green');
      $smallStraight.text(30);
    } else {
      $smallStraight.removeClass('green');
      $smallStraight.text(0);
    }
    // Large straight (5 consecutive incremental numbers)
    if (largeStraight(filteredCheck)) {
      $largeStraight.addClass('green');
      $largeStraight.text(40);
    } else {
      $largeStraight.removeClass('green');
      $largeStraight.text(0);
    }
    // Chance logic (seriously its just an accumulation of all numbers it aint even logic like seriously)
    $chance.addClass('green');
    $chance.text(sum);
    check.forEach(function(element, i, array) {
      const index = i;
      // Single numbers
      if (element === 1 && !$ones.attr('id')) {
        $ones.text(0);
        one++;
        $ones.addClass('green');
        $ones.text(one);
      } else if (!array.includes(1) && !$ones.attr('id')) {
        $ones.text(0);
        $ones.removeClass('green');
      }
      if (element === 2 && !$twos.attr('id')) {
        $twos.text(0);
        two += 2;
        $twos.addClass('green');
        $twos.text(two);
      } else if (!array.includes(2) && !$twos.attr('id')) {
        $twos.text(0);
        $twos.removeClass('green');
      }
      if (element === 3 && !$threes.attr('id')) {
        $threes.text(0);
        three += 3;
        $threes.addClass('green');
        $threes.text(three);
      } else if (!array.includes(3) && !$threes.attr('id')) {
        $threes.text(0);
        $threes.removeClass('green');
      }
      if (element === 4 && !$fours.attr('id')) {
        $fours.text(0);
        four += 4;
        $fours.addClass('green');
        $fours.text(four);
      } else if (!array.includes(4) && !$fours.attr('id')) {
        $fours.text(0);
        $fours.removeClass('green');
      }
      if (element === 5 && !$fives.attr('id')) {
        $fives.text(0);
        five += 5;
        $fives.addClass('green');
        $fives.text(five);
      } else if (!array.includes(5) && !$fives.attr('id')) {
        $fives.text(0);
        $fives.removeClass('green');
      }
      if (element === 6 && !$sixes.attr('id')) {
        $sixes.text(0);
        six += 6;
        $sixes.addClass('green');
        $sixes.text(six);
      } else if (!array.includes(6) && !$sixes.attr('id')) {
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
    $scrambler.append($board1.find('img'));
    $scrambler.append($board2.find('img'));
  }

  function tallyScores() {
    let p1grandtotal = $('.p1').map(function() {
      return $(this).text();
    }).get();
    p1grandtotal = removeValue(p1grandtotal, '-');
    p1grandtotal = arraySum(p1grandtotal);

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
      player--;
      $('img').off();
      $p1on = $('.p1.on');
      $p1on.removeClass('green');
      $p1on.text(0);
      $p1on.off();
      $p2on.on('click', lockScore);
    } else {
      player++;
      $p2on = $('.p2.on');
      $p2on.removeClass('green');
      $p2on.text(0);
      $p2on.off();
      $p1on.on('click', lockScore);
    }
    score++;
    if (score === 3) {
      tallyScores();
    }
  }

  $p1on.on('click', lockScore);
  initialRoll();

});
