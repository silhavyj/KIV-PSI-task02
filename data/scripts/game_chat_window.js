var current_option;          //current option the user chose
var options = {};            //all options - dictionary [key=option_id; value=option]
var options_by_text = {};    //dictionary [key=text; value=option]
var user_data = {};          //dictionary [key=number; value=data about the user_data]

//default image the user sees when the page gets loaded
var current_image = "story/images/cabin.jpg";
//when the user clicks on an option, it disables him from
//clicking on another one until all animations are finished
var click_option_available = true;
//true/false if the user has already clicked on an option
//this must be checked for playing music in the background due to Google's policy
var first_option_click = true;

var messageFontSize = 1;           //font size of the messages [vw]
var timeMessageFontSize = 0.9;     //font size of the date-time of the messages [vw]
var typingSize = 0.5;              //size of the typing animation [vw]
var profilePicSize = 23;           //size of the profile picture [%]
var onlineCircleLeft = 20;         //left margin of the "online" circle [%]
var onlineCircleSize = 0.8;        //size of the "online" circle [vw]
var feedbackMessageFontSize = 0.9; //font size of the feedback message [vw]
var choiceFontSize  = 1;           //font size of the options [vw]
var zoomStep = 1.1;                //zoom step +10%
var maxMessageFontSize = 1.75;     //maximum font size of the messages [vw]
var minMessageFontSize = 0.75;     //minimum fornt size of the messages [vw]

var winLossVar = 0;//Used to help Store Data For Final Page
var copsCalledVar = 0;//Used to help Store Data For Final Page

//months in the year
var months = ["January", "February", "March", "April",
              "May", "June", "July", "August", "September",
              "October", "November", "December"];

/* Main function that is called when the page gets loaded.
   It stores the data about the user, stores the options,
   and initializes the game.
*/
function load() {
  storeUserData();
  storeAllOptions();
  initGame();
}

/* Stores data before moving on to the last page */
function storeDataForTheLastPage() {
    localStorage.setItem("fontsize", messageFontSize);
    localStorage.setItem("title", document.getElementById("title").innerHTML);
    var cops = "";
    var win = "";

    if (winLossVar == 1) {
      win = "Win";
    } else if (winLossVar == 0){
      win = "Loss";
    }

    if (copsCalledVar == 1) {
      cops = "Yes";
    } else if (copsCalledVar == 0) {
      cops = "No";
    }
    localStorage.setItem("copsCalled", cops);
    localStorage.setItem("winLoss", win);
    storeTime();
}

function storeTime() {
  minutes = parseInt(duration / 60, 10);
  seconds = parseInt(duration % 60, 10);
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  localStorage.setItem("final-time", minutes + " : " + seconds);
}

/* Stores all data about the user from the localStorage.
   All the data is carried over from the introduction page
*/
function storeUserData() {
  //store the data about the user
  user_data['1'] = localStorage.getItem("name");
  user_data['2'] = localStorage.getItem("age");
  user_data['3'] = localStorage.getItem("gender");
  user_data['4'] = localStorage.getItem("os");
  user_data['5'] = localStorage.getItem("location");

  //apply zoom as the user set it in the
  //introduction page
  var newMessageFontSize = localStorage.getItem("fontsize");
  var k = newMessageFontSize / messageFontSize;

  //apply the zoom on all elements in the chat window
  messageFontSize = newMessageFontSize;
  timeMessageFontSize = timeMessageFontSize * k;
  typingSize = typingSize * k;
  profilePicSize = profilePicSize * k;
  onlineCircleLeft = onlineCircleLeft * k;
  onlineCircleSize = onlineCircleSize * k;
  feedbackMessageFontSize = feedbackMessageFontSize * k;
  choiceFontSize = choiceFontSize * k;
}

/* Replaces both the number and the hash mark in front of it
  with the appropriate information about the user from the dictionary
  according to the value of the number
*/
function replaceMessageWithData(message) {
  index = message.indexOf("#");

  //while there's a hash mark in the message
  //(the message may contain more than only one piece of information)
  while (index != -1)  {
    message = message.substring(0, index) +
              user_data[message[index + 1]] +
              message.substring(index + 2, message.length);
    index = message.indexOf("#");
  }
  return message;
}

/* Stores all options from the JSON file in the appropriate dictionary */
function storeAllOptions() {
  for (var i = 0; i < data.options.length; i++)
    options[data.options[i].option_id] = data.options[i];
}

/* Initializes the game - creates the first message from the killer,
   creates the first options the user has
*/
function initGame() {
  click_option_available = false;
  createFirstMessage();
  createOption(data.start.start_options_ids, 0);
}

/* Creates the first message from the killer */
function createFirstMessage() {
  var firstMessage =
    '<div class="received-msg">' +
      '<span class="online" style="width: ' + onlineCircleSize + 'vw; height: ' + onlineCircleSize + 'vw; left: ' + onlineCircleLeft + '%;"></span>' +
      '<img src="images/profile.png" style="width: ' + profilePicSize + '%">' +
      '<div class="received-width-msg">' +
        '<p style="font-size: ' + messageFontSize + 'vw;">' + data.start.msg + '</p>' +
        '<span class="time-date" style="font-size: ' + timeMessageFontSize + 'vw;">' + getDateTime() + '</span>' +
      '</div>' +
    '</div>';
  document.getElementById("messages-history").innerHTML += firstMessage;
}

/* Creates options the user has as a response to the killer */
function createOption(current_options, index) {
  //if we reach the end of the array - we're done
  if (index >= current_options.length) {
    click_option_available = true;
    return;
  }

  //create the option iteself
  var option_index = current_options[index];
  var option_text = options[option_index].option_text;
  options_by_text[option_text] = options[option_index];
  document.getElementById("choice-container").innerHTML += createOptionElement(option_text);

  //if the user has already clicked on an option, play the sound
  if (first_option_click == false)
    new Audio('sounds/sent_msg.mp3').play();

  //move on to the next option
  setTimeout(function() {
      createOption(current_options, index + 1);
  }, 1000);
}

/* Creates an option (the structure of it) with
   appropriate text given as a parameter
*/
function createOptionElement(text) {
  return '<div class="choice" style="font-size: ' + choiceFontSize + 'vw;" onclick="saveChosenOption(this)">' +
            '<p onmouseover="playHoverSound()">' + text +'</p>' +
         '</div>';
}

/* Plays the hover sound when the user moves the cursor over buttons */
function playHoverSound() {
  if (first_option_click == false)
    new Audio('sounds/hover_click.mp3').play();
}

/* Returns current date-time so it could be added to the message.
  The format of the date-time is hh:mm | month day
*/
function getDateTime() {
  var date = new Date();
  var h = date.getHours();
  var m = date.getMinutes();
  if (h <= 9) h = "0" + h;
  if (m <= 9) m = "0" + m;
  return h + ":" + m + " | " + months[date.getMonth()] + " " + date.getDate();
}

/* Creates a message with the text given as a parameter
   that is going to be sent to the killer
*/
function createMessageToSend(text) {
  return '<div class="outgoing-msg">' +
            '<div class="sent-msg">' +
              '<p style="font-size:' + messageFontSize + 'vw;">' + replaceMessageWithData(text) + '</p>' +
              '<span class="time-date time-right" style="font-size:' + timeMessageFontSize + 'vw;">'+ getDateTime() + '</span>' +
            '</div>' +
         '</div>';
}

/* Scrolls down the conversation  in the chat window
   when a new even happens. For example, typing
   or a sent or received message.
  */
function scrollMsgsDown() {
  var elem = document.getElementById('messages-history');
  elem.scrollTop = elem.scrollHeight;
}

/* Generates a random number from the interval given as a parameter */
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

/* Generates a random delay between sent/received messages */
function getDelayBetweenMessages() {
  return getRndInteger(500, 1500);
}

/* Saves the option the user chose so it could be processed.
   The user physically clicks on the text of the option, therefore
   the dictionary is used to get the option itself
*/
function saveChosenOption(choosen_option) {
  if (click_option_available == false)
    return;

  var text = choosen_option.getElementsByTagName("p")[0].innerHTML;
  current_option = options_by_text[text];
  sendMessage(0);
}

/* Sends messages to the killer
  (after the user clicked on the appropriate option)
*/
function sendMessage(index) {
  //if the user has already cliecked on an option before,
  //play the sound
  if (first_option_click == true) {
    var background_audio = new Audio("sounds/background.mp3");
    background_audio.loop = true;
    background_audio.play();
    first_option_click = false;
  }

  //if there are no messages to be sent
  if (current_option.sent_msg.length != 0) {
    var message = createMessageToSend(current_option.sent_msg[index]);
    document.getElementById("messages-history").innerHTML += message;
    scrollMsgsDown();
    new Audio('sounds/sent_msg.mp3').play();
  }

  //clear the div with the options
  document.getElementById("choice-container").innerHTML = '';

  //if there's another message to be sent, send it
  if (index != current_option.sent_msg.length - 1 && current_option.sent_msg.length != 0) {
    setTimeout(function() {
        sendMessage(index + 1);
    }, getDelayBetweenMessages());
  }
  //otherwise play the sound after all messages have been sent
  //and wait for the respose from the killer (move on - receiveMessage(0))
  else {
    setTimeout(function() {
      if (current_option.sound_after_sent_msg.localeCompare("") != 0) {
        var audio = 'story/sounds/' + current_option.sound_after_sent_msg;
        new Audio(audio).play();
      }
      receiveMessage(0);
    }, 1000);
  }
}

/* Creates a feedback message from the game. For example,
   if the user wants to drive away but he doesn't have the keys,
   a feedback message would be "you can't drive a car without keys"
*/
function createFeedbackMessage(text) {
  return '<div class="outgoing-msg">' +
            '<div class="feedback">' +
                '<p style="font-size: ' + feedbackMessageFontSize + 'vw;">' + text + '</p>' +
            '</div>' +
         '</div>';
}

/* Sends a freedback message from the game */
function sendGameFeedback(index) {
  //if we reached the end of the array of messages - end of the function
  if (current_option.game_feedback.length == 0) {
    //set new options for the user
    nextOptions();
    return;
  }

  //create the message itself and play the sound
  var text = current_option.game_feedback[index];
  var message = createFeedbackMessage(text);
  document.getElementById("messages-history").innerHTML += message;
  new Audio('sounds/sent_msg.mp3').play();

  //scroll down the conversation
  scrollMsgsDown();

  //if there's another message to be sent, send it
  if (index != current_option.game_feedback.length - 1) {
    setTimeout(function() {
        sendGameFeedback(index + 1);
    }, getDelayBetweenMessages());
  }
  //otherwise create new options for the user
  else {
	   if (current_option.victory === 'true') {
       winLossVar = 1;//Used to help Store Data For Final Page
	     setTimeout(function() {
		       stopTimerVictory();
		       document.getElementById('victory').style.visibility = 'visible';
	     }, 5000);
	   }
	   else if (current_option.game_over === 'true') {
       winLossVar = 0;//Used to help Store Data For Final Page
	      setTimeout(function() {
		        stopTimerGameOver();
		        document.getElementById('game-over').style.visibility = 'visible';
	      }, 5000);
	   }
     setTimeout(function() {
      if (current_option.sound_after_feedback_msg.localeCompare("") != 0) {
        var audio = 'story/sounds/' + current_option.sound_after_feedback_msg;
        new Audio(audio).play();
      }
      nextOptions();
    }, 2000);
  }
}

/* Creates new options for the user */
function nextOptions() {
  //update the picture on the left side
  var image = "story/images/" + current_option.image;
  if (current_image != image) {
    current_image = image;
    var pic = document.getElementsByClassName("pic")[0];
    pic.style.backgroundImage = "url(" + image + ")";

    var styleElem = document.getElementsByTagName("style")[0];
    styleElem.innerHTML =
    '.pic::before {' +
        'content: "";' +
        'position: absolute;' +
        'width: 100%;' +
        'height: 40px;' +
        'background: url('+ image +') no-repeat;' +
        'background-size: cover;' +
        'filter: blur(2px);' +
        'opacity: 0;'
        '}';
        pic.classList.add("fade-in");
  }

  //able/diable the rain in the background
  if (current_option.rain == "true")
    createRain();
  else clearRain();
  if (current_option.title == "Calling Police..." || current_option.title == "Police are on their way") {
  copsCalledVar = 1; //Used to help Store Data For Final Page
  }
  if (current_option.title == "Game Over") {

  } else {
    document.getElementById("title").innerHTML = current_option.title;
  }

  click_option_available = false;
  scenario_by_msg = {};

  //generate next options according to the
  //the chance of the option the user clicked on
  var chance = getRndInteger(1, 100);
  if (chance <= current_option.next_options_ids.chance)
    createOption(current_option.next_options_ids.true, 0);
  else createOption(current_option.next_options_ids.false, 0);
}

/* Creates a div with the className given as a parameter */
function createDiv(className) {
  var div = document.createElement("div");
  div.className = className;
  return div;
}

/* Calculates the typing delay [s] according to the
   length of the message given as a parameter
*/
function getTypingDelay(message) {
  return message.length * 0.1 * 1000;
}

/* Receives messages from the killer */
function receiveMessage(index) {
  //if we reached the end of the array of messages - end of the function
  if (current_option.received_msg.length == 0) {
    //receive feedback from the game if there is some
    sendGameFeedback(0);
    return;
  }

  //play the sound
  new Audio('sounds/typing.mp3').play();

  //if required, inserts information about the user in the message
  var text = current_option.received_msg[index];
  text = replaceMessageWithData(text);

  //create div that are needed
  var received_msg = createDiv("received-msg");
  var received_width_msg = createDiv("received-width-msg");

  //create the profile picture
  var profile_image = new Image();
  profile_image.src = "images/profile.png";
  profile_image.style.width = profilePicSize + "%";

  //create the datetime
  var span = document.createElement("span");
  span.className = "time-date";
  span.style.fontSize = timeMessageFontSize + "vw";
  var date = new Date();
  span.innerHTML = getDateTime();

  //create the "online" dot
  var dot = document.createElement("span");
  dot.className = "online";
  dot.style.width = onlineCircleSize + "vw";
  dot.style.height = onlineCircleSize + "vw";
  dot.style.left = onlineCircleLeft + "%";

  //add all the elements in the divs
  received_msg.appendChild(dot);
  received_msg.appendChild(profile_image);
  received_msg.appendChild(received_width_msg);
  var typing_div = createTyping();
  received_width_msg.appendChild(typing_div);

  //add message to the chat window
  document.getElementById("messages-history").appendChild(received_msg);
  received_width_msg.appendChild(span);

  //scroll down the conversation in the chat window
  scrollMsgsDown();

  setTimeout(function() {
    new Audio('sounds/received_msg.mp3').play();

    //remove the typing animation and replace
    //it with the message itself
    received_width_msg.removeChild(typing_div);
    var p = document.createElement("p");
    p.style.fontSize = messageFontSize + "vw";
    p.appendChild(document.createTextNode(text));
    received_width_msg.appendChild(p);
    received_width_msg.appendChild(span);

    //scroll down the conversation in the chat window
    scrollMsgsDown();

    //if there's another message to be sent, send it
    if (index != current_option.received_msg.length - 1) {
      setTimeout(function() {
          receiveMessage(index + 1);
      }, getDelayBetweenMessages());
    }
    //otherwise play the sound after all messages have been sent
    //and receive feedback from the game if there is some
    else {
      setTimeout(function() {
          if (current_option.sound_after_received_msg.localeCompare("") != 0) {
            var audio = 'story/sounds/' + current_option.sound_after_received_msg;
            new Audio(audio).play();
          }
          sendGameFeedback(0);
      }, 2000);
    }
  }, getTypingDelay(text));

}

/* Creates a typing animation */
function createTyping() {
  var typing_div = createDiv("dots-cont");
  typing_div.innerHTML =
    '<span class="dot dot-1" style="width: ' + typingSize + 'vw; height: ' + typingSize + 'vw;"></span>' +
    '<span class="dot dot-2" style="width: ' + typingSize + 'vw; height: ' + typingSize + 'vw;"></span>' +
    '<span class="dot dot-3" style="width: ' + typingSize + 'vw; height: ' + typingSize + 'vw;"></span>'
  return typing_div;
}

/* Changes the font size of the messages (sent, received) */
function changeFontSizeOfMessages(messages, fontSize) {
  for (var i = 0; i < messages.length; i++) {
      var text = messages[i].getElementsByTagName("p")[0];
      if (typeof text != 'undefined')
        text.style.fontSize = fontSize + "vw";
  }
}

/* zoom all the elements in the chat window */
function zoom(messageFontSize, timeMessageFontSize,
              typingSize, profilePicSize, onlineCircleSize,
              onlineCircleLeft, feedbackMessageFontSize, choiceFontSize) {

  //zoom the messages
  var sentMessages = document.getElementsByClassName("sent-msg");
  var receivedMessages = document.getElementsByClassName("received-width-msg");
  changeFontSizeOfMessages(receivedMessages, messageFontSize);
  changeFontSizeOfMessages(sentMessages, messageFontSize);

  //zoom the datetimes
  var times = document.getElementsByClassName("time-date");
  for (var i = 0; i < times.length; i++)
    times[i].style.fontSize = timeMessageFontSize + "vw";

  //zoom the typing animations
  var typingDots = document.getElementsByClassName("dot");
  for (var i = 0; i < typingDots.length; i++) {
    typingDots[i].style.width = typingSize + "vw";
    typingDots[i].style.height = typingSize + "vw";
  }

  //zoom the profile pictures
  var receivedMessages = document.getElementsByClassName("received-msg");
  for (var i = 0; i < receivedMessages.length; i++) {
    var profilePic = receivedMessages[i].getElementsByTagName("img")[0];
    profilePic.style.width = profilePicSize + "%";
  }

  //zoom the "online" circle
  var onlineCircles = document.getElementsByClassName("online");
  for (var i = 0; i < onlineCircles.length; i++) {
    onlineCircles[i].style.width = onlineCircleSize + "vw";
    onlineCircles[i].style.height = onlineCircleSize + "vw";
    onlineCircles[i].style.left = onlineCircleLeft + "%";
  }

  //zoom the feedback messages from the game
  var feedBackMessages = document.getElementsByClassName("feedback");
  for (var i = 0; i < feedBackMessages.length; i++) {
      var text = feedBackMessages[i].getElementsByTagName("p")[0];
      text.style.fontSize = feedbackMessageFontSize + "vw";
  }

  //zoom the options
  var choices = document.getElementsByClassName("choice");
  for (var i = 0; i < choices.length; i++)
      choices[i].style.fontSize = choiceFontSize + "vw";
}

/* Zooms in the chat window */
function zoomIn() {
  if (first_option_click == true)
    first_option_click = false;

  //play the sound
  playHoverSound();

  //check if the font size isn't out of the range
  if (messageFontSize * zoomStep > maxMessageFontSize)
    return;

  //update the fontsizes
  messageFontSize = messageFontSize * zoomStep;
  timeMessageFontSize = timeMessageFontSize * zoomStep;
  typingSize = typingSize * zoomStep;
  profilePicSize = profilePicSize * zoomStep;
  onlineCircleSize = onlineCircleSize * zoomStep;
  onlineCircleLeft = onlineCircleLeft * zoomStep;
  feedbackMessageFontSize = feedbackMessageFontSize * zoomStep;
  choiceFontSize = choiceFontSize * zoomStep;

  //apply zoom
  zoom(messageFontSize, timeMessageFontSize,
       typingSize, profilePicSize,
       onlineCircleSize, onlineCircleLeft,
       feedbackMessageFontSize, choiceFontSize);
}

/* Zooms out the chat window */
function zoomOut() {
  if (first_option_click == true)
    first_option_click = false;

  //play the sound
  playHoverSound();

  //check if the font size isn't out of the range
  if (messageFontSize / zoomStep < minMessageFontSize)
    return;

    //update the fontsizes
  messageFontSize = messageFontSize / zoomStep;
  timeMessageFontSize = timeMessageFontSize / zoomStep;
  typingSize = typingSize / zoomStep;
  profilePicSize = profilePicSize / zoomStep;
  onlineCircleSize = onlineCircleSize / zoomStep;
  onlineCircleLeft = onlineCircleLeft / zoomStep;
  feedbackMessageFontSize = feedbackMessageFontSize / zoomStep;
  choiceFontSize = choiceFontSize / zoomStep;

  //apply zoom
  zoom(messageFontSize, timeMessageFontSize,
       typingSize, profilePicSize,
       onlineCircleSize, onlineCircleLeft,
       feedbackMessageFontSize, choiceFontSize);
}
