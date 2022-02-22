var myTimer;   //timer
var duration;  //duration of the countdown (5 mins)
var duration2;

/* Sets the time whe the page gets loade */
function startTimer() {
  duration = 5 * 60;  //5 mins
  myTimer = setInterval('countdown()', 1000);
}

/* Stops the timer when the countdown hits zero */
function stopTimerVictory() {
    //stops the the 5-mins countdown
    //and displays the "game-over "label
    clearInterval(myTimer);
    document.getElementById('victory-title').style.visibility = 'visible';

    //starts 3s countdown before
    //moving on to the statistics page
    duration2 = 3;
    myTimer = setInterval('lastPageCountdown()', 1000);
}

function stopTimerGameOver() {
    //stops the the 5-mins countdown
    //and displays the "game-over "label
    clearInterval(myTimer);
    document.getElementById('game-over').style.visibility = 'visible';

    //starts 3s countdown before
    //moving on to the statistics page
    duration2 = 3;
    myTimer = setInterval('lastPageCountdown()', 1000);
}

/* 5 mins countdown of the game.
   It displays the remaining time in format "mm::ss"
 */
function countdown() {
    var timer = duration, minutes, seconds;
    duration--;
    if (duration >= 0) {

        //get mins and secs
        minutes = parseInt(duration / 60, 10);
        seconds = parseInt(duration % 60, 10);

        //format them - if the digit is less than 9,
        //add 0 in front of it
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        //displays the updated time
        document.getElementById('countdown-time').innerHTML = minutes + " : " + seconds;
    } else {

        stopTimerGameOver();
    }
}

/* 3s countdown before moving on to the next page.
   It displays the remaining time in format "mm::ss"
*/
function lastPageCountdown() {
  var timer = duration2, minutes, seconds;
  duration2--;
  if (duration2 >= 0) {

      //get mins and secs
      minutes = parseInt(duration2 / 60, 10);
      seconds = parseInt(duration2 % 60, 10);

      //format them - if the digit is less than 9,
      //add 0 in front of it
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      //displays the updated time
      var countDowns = document.getElementsByClassName('last-page-countdown');
      for (var i = 0; i < countDowns.length; i++)
        countDowns[i].innerHTML = minutes + " : " + seconds;
  } else {
      moveOnToTheLastPage();
  }
}

/* Moves on to the next page - changes the html file */
function moveOnToTheLastPage() {
  clearInterval(myTimer);
  storeDataForTheLastPage();
  window.location.href = 'EndScreen.html';
}
