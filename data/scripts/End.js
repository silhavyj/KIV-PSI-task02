
var textZoom = localStorage.getItem("fontsize");
var currentAttempts = parseInt(localStorage.getItem("attempts"));
var zoomMax = 1.75;
var zoomMin = 0.75;
var zoomStepUp = 1.1;

function Choice1OK() {
  var msg1 = document.getElementById("msg1");
  msg1.innerHTML = "Ok, Restart";
  msg1.style.visibility = "visible";
  msg1.style.width = "170px";
  new Audio('sounds/sent_msg.mp3').play();

  document.getElementById('SendOpt1').style.visibility = "hidden";
  document.getElementById('SendOpt2').style.visibility = "hidden";

  localStorage.setItem("attempts", currentAttempts + 1);
  localStorage.setItem("fontsize", textZoom);

  function restart() {
    window.location = "file:game.html";
  }

  setTimeout(restart, 700);
}

function Choice1Details() {
  new Audio('sounds/background.mp3').play();

  var msg1 = document.getElementById("msg1");
  msg1.innerHTML = "How Did I Do?";
  msg1.style.visibility = "visible";
  msg1.style.width = "200px";
  new Audio('sounds/sent_msg.mp3').play();

  document.getElementById('SendOpt1').style.visibility = "hidden";
  document.getElementById('SendOpt2').style.visibility = "hidden";

  function showMsg2() {
    document.getElementById("feedback").style.visibility = "visible";
    new Audio('sounds/received_msg.mp3').play();

    document.getElementById('SendOpt1').style.visibility = "visible";
    document.getElementById('SendOpt2').style.visibility = "visible";

    document.getElementById('SendOpt1').setAttribute( "onclick", "javascript: setTimeout(Choice2Restart, 500);" );
    document.getElementById('SendOpt2').setAttribute( "onclick", "javascript: setTimeout(Choice2Quit, 500);" );

    document.getElementById('SendOpt1').innerHTML = "Restart";
    document.getElementById('SendOpt2').innerHTML = "Quit";
  }

  setTimeout(showMsg2, 2000);
}

function Choice2Restart() {
  var msg2 = document.getElementById('msg2');

  msg2.innerHTML = "Restart";
  msg2.style.visibility = "visible";
  msg2.style.width = "100px";
  new Audio('sounds/sent_msg.mp3').play();

  function restart() {
    window.location = "file:game.html";
  }
  localStorage.setItem("attempts", currentAttempts + 1);
  localStorage.setItem("fontsize", textZoom);
  setTimeout(restart, 700);
}

function Choice2Quit() {
  var msg2 = document.getElementById('msg2');

  msg2.innerHTML = "Goodbye!";
  msg2.style.visibility = "visible";
  msg2.style.width = "130px";
  new Audio('sounds/sent_msg.mp3').play();

  document.getElementById('SendOpt1').style.visibility = "hidden";
  document.getElementById('SendOpt2').style.visibility = "hidden";

  function quit() {
    window.location = "file:index.html";
  }

  localStorage.setItem("attempts", 1);
  localStorage.setItem("fontsize", textZoom);

  setTimeout(quit, 1000);
}

function showGameOver() {

  document.getElementById('winLoss').innerHTML = localStorage.getItem('winLoss');
  document.getElementById('copsCalled').innerHTML = localStorage.getItem('copsCalled');
  document.getElementById('playTime').innerHTML = localStorage.getItem('final-time');
  document.getElementById('finalLocation').innerHTML = localStorage.getItem('title');
  document.getElementById('noOfAttempts').innerHTML = currentAttempts;

  document.getElementById('gameOverMsg').style.visibility = "visible";
  document.getElementById('gameOverMsg').innerHTML = "Game Over, " + localStorage.getItem('name');

  document.getElementById('SendOpt1').style.visibility = "visible";
  document.getElementById('SendOpt2').style.visibility = "visible";

  document.getElementById('gameOverMsg').style.fontSize = textZoom + "vw";
  document.getElementById('msg1').style.fontSize = textZoom + "vw";
  document.getElementById('feedback').style.fontSize = textZoom + "vw";
  document.getElementById('msg2').style.fontSize = textZoom + "vw";
  document.getElementById('SendOpt1').style.fontSize = textZoom + "vw";
  document.getElementById('SendOpt2').style.fontSize = textZoom + "vw";

}

function zoom(i) {

  if (i == 1 && textZoom <= zoomMax)
    textZoom = textZoom * zoomStepUp;
  else if (i == 0 && textZoom >= zoomMin)
    textZoom = textZoom / zoomStepUp;

    localStorage.setItem("fontsize", textZoom);

  if (textZoom >= zoomMin || textZoom <= zoomMax) {

    document.getElementById('gameOverMsg').style.fontSize = textZoom + "vw";
    document.getElementById('msg1').style.fontSize = textZoom + "vw";
    document.getElementById('feedback').style.fontSize = textZoom + "vw";
    document.getElementById('msg2').style.fontSize = textZoom + "vw";
    document.getElementById('SendOpt1').style.fontSize = textZoom + "vw";
    document.getElementById('SendOpt2').style.fontSize = textZoom + "vw";

  }
}

function zoomIn() {
  zoom(1);
}

function zoomOut() {
  zoom(0);
}
