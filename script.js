var sounds = {
  0: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
  1: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
  2: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
  3: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"),
  9: new Audio("https://dl.dropboxusercontent.com/u/93114194/10.%20Simon%20Game/media/buzz.mp3")
};
sounds[0].playbackRate = sounds[1].playbackRate = sounds[2].playbackRate = sounds[3].playbackRate = sounds[9].playbackRate = 0.5; // make sounds longer
var soundsQue = []; // sound que by the game
var playerQue = []; // player que entries
var stepCount = 0;
var strictMode = false;

function turnOn() { // game on
  $(".start-button").css("pointer-events", "auto"); // enable pointer events for buttons
  $(".strict-button").css("pointer-events", "auto");
  $(".display").removeClass("off");
  $(".display").addClass("on"); // change display look
}

function turnOff() { // game off
  $(".start-button").css("pointer-events", "none"); // disable pointer events for buttons
  $(".strict-button").css("pointer-events", "none");
  $(".blue").css("pointer-events", "none"); // disable pointer events for tiles
  $(".green").css("pointer-events", "none");
  $(".red").css("pointer-events", "none");
  $(".yellow").css("pointer-events", "none");
  $(".display").removeClass("on");
  $(".display").addClass("off");
  $(".strict-indicator").removeClass("on");
  $(".strict-indicator").addClass("off");
  $(".display").text("--"); // default display text
  soundsQue = []; // reset variables
  playerQue = [];
  stepCount = 0;
  var strictMode = false;
}

function addSound() { // generate random sound ID
  var randomSound = Math.floor(Math.random() * 4);
  soundsQue.push(randomSound); // add ID to que
}

function replayQue() { // replay computer generated sound que
  var i = 0;
  var zero;
  var interval = setInterval(function() {
    lights(soundsQue[i]); // light the tile and play the sound
    zero = (soundsQue.length < 10) ? "0" : ""; // add leading 0 to count number
    $(".display").text(zero + (i + 1)); // display count number
    i++;
    if (i == soundsQue.length) { // if end of que - stop
      clearInterval(interval);
    }
  }, 1500); // delay that sounds wouldn't collide
}

function lights(num) { // light the tile and play the sound
  sounds[num].play(); // play sound
  var $color;
  switch (num) {
    case 0:
      $color = $(".blue").addClass("hover"); // light tile
      break;
    case 1:
      $color = $(".green").addClass("hover");
      break;
    case 2:
      $color = $(".red").addClass("hover");
      break;
    case 3:
      $color = $(".yellow").addClass("hover");
      break;
  }
  window.setTimeout(function() {
    $color.removeClass('hover');
  }, 750); // delay to show lighten tile
}

function checkQue() { // check if player response is correct
  if (stepCount == soundsQue.length - 1) { // for first and last step
    if (playerQue[stepCount] == soundsQue[stepCount]) { // check if computer and player moves correspond
      if (soundsQue.length == 20) { // check for winner (must succeed in 20 moves)
        winner(); // display win and restart the game
      } else {
        addSound(); // if no winner - add new sound 
        replayQue(); // and continue playing
      }
    } else { // if moves do not correspond 
      if (strictMode == true) { // if strict mode
        sounds[9].play(); // play buzz sound
        resetGame(false); // restart the board
      } else { // if normal mode
        $(".display").text("!!"); // display fail message
        sounds[9].play(); // play buzz sound
        playerQue = []; // clear variables
        stepCount = 0;
        replayQue(); // replay sounds que
      }
    }
    playerQue = []; // clear variables
    stepCount = 0;
  } else { // for other steps
    if (playerQue[stepCount] == soundsQue[stepCount]) { // check if computer and player moves correspond
      stepCount++; // increase step count
    } else { // if moves do not correspond 
      if (strictMode == true) { // if strict mode
        sounds[9].play(); // play buzz sound
        resetGame(false); // restart the board
      } else { // if normal mode
        $(".display").text("!!"); // display fail message
        sounds[9].play(); // play buzz sound
        playerQue = []; // clear variables
        stepCount = 0;
        replayQue(); // replay sounds que
      }
    }
  }
}

function winner() { // display win and restart the game
  $(".blue").addClass("hover");
  $(".green").addClass("hover");
  $(".red").addClass("hover");
  $(".yellow").addClass("hover");
  resetGame(true);
}

function startGame() { // start game
  addSound(); // generate and add new sound to the sounds que
  replayQue(); // replay all sounds in the sounds que
  $(".blue").css("pointer-events", "auto"); // enable pointer events for tiles
  $(".green").css("pointer-events", "auto");
  $(".red").css("pointer-events", "auto");
  $(".yellow").css("pointer-events", "auto");
}

function resetGame(status) { // restart the board
  soundsQue = []; // reset variables
  playerQue = [];
  stepCount = 0;
  if (status == true) { // if won
    $(".blue").removeClass("hover");
    $(".green").removeClass("hover");
    $(".red").removeClass("hover");
    $(".yellow").removeClass("hover");
    $(".display").text("**");
    startGame();
  } else { // if lost or restarted the game
    $(".display").text("!!");
    startGame();
  }
}

$("#onOff").change(function() { // toggle button to switch game on / off
  if ($(this).prop("checked"))
    turnOn();
  else turnOff();
}).change();

$("#startButton").click(function() { // start button to start playing the game
  if (soundsQue.length == 0) { // if game was not yet started
    startGame(); // start the game
  } else { // if game was started and player wants to restart
    resetGame(false); // restart teh game
  }
});

$("#strictButton").click(function() { // button to enable / disable strict mode
  if (strictMode == false) {
    strictMode = true;
    $(".strict-indicator").addClass("on");
  } else {
    strictMode = false;
    $(".strict-indicator").removeClass("on");
  }
});

$(".blue").click(function() { // tile button
  playerQue.push(0); // add player move to player que
  lights(0); // show selected tile and play sound
  checkQue(); // check is player move is correct
});

$(".green").click(function() {
  playerQue.push(1);
  lights(1);
  checkQue();
});

$(".red").click(function() {
  playerQue.push(2);
  lights(2);
  checkQue();
});

$(".yellow").click(function() {
  playerQue.push(3);
  lights(3);
  checkQue();
});