function randomDice() {
  return Math.ceil(Math.random() * 6);
}


$(() => {
  // const audio = document.getElementsByTagName('audio')[0];
  const $board1 = $('section.player1');
  const $image1 = $('#first');
  const $image2 = $('#second');
  const $image3 = $('#third');
  const $image4 = $('#fourth');
  const $image5 = $('#fifth');
  const $image6 = $('#sixth');
  // Had problems altering specific images but only finding the section that holds it.
  let turn = 0;

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
    num = randomDice();
    $image6.attr({'src': `images/${num}.png`, 'data-dice': num});
    num = randomDice();
  }

  function changeDice(e) {
    turn++;
    // audio.play();
    $board1.off();
    const hello = setInterval(() => {
      const num = randomDice();
      $(e.target).attr({'src': `images/${num}.png`, 'data-dice': num});
    }, 100);
    setTimeout(() => {
      clearInterval(hello);
      if (turn === 3) {
        winCondition();
      } else {
        $board1.on('click', changeDice);
      }
    }, 1000);
  }

  function winCondition() { // If you have a 3, you win! (obviously not final)
    const check = [];
    for (let i = 0; i < 6; i++) {
      check.push($('img').eq(i).attr('data-dice'));
      console.log(check);
    }

    if (check.includes('3')) {
      alert('You win?!');
    } else {
      alert('You somehow lost');
    }
    $board1.off();
  }


  generateDice();
  $board1.on('click', changeDice);




});
