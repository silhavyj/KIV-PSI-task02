//Declaring variables to store infromation about the player information
var name;
var age;
var gender;
var letters = /^[A-Za-z]+$/;
var numbers = /[1-9]/;
var correctName;
var correctAge;

//Storing Variables for the zoom buttons, allows me to keep update of fontsizes has been changed.
//As once a plus or minus button has been pressed within the website, these vales will be updated and referred back towards

//Var for multiplying by 0.10%;
var zoomStep = 1.1;

//Var to store each message and their boundaries to now above. To stop the font size increasing
//past a certain value.
var minMessageFontSize = 0.75;
var maxMessageFontSize = 1.75;

//Font size for different type of text.
var messageFontSize = 1;
var labelfontsize = 1.5;
var text = true;
var maleSize = 1;
var femaleSize = 1;
var nameSize = 1;
var dobTextSize = 1;
//Font size for the button, 'Start'.
var buttonSize = 1;


//This method is used once the user presses the continue. As this will hide the story, and reappear
//With the input form.
function continueButton() {
  playAudio();
  playBackground();
  //Calls the hidestory method
  // - Hide storyline
  hideStory();
  //Calls the showformInput method
  // - Shows input form
  showformInput();
}

//This method is used to hide the story text/div within the first page of the website.
function hideStory() {
  //Storing the div/ID within a constant.
  const intro = document.getElementById("intro");
  //Updating the intro constant by changing thye opactity towards '0'.
  intro.style.opacity = '0';
  //Removes the ID/Div fromt he website
  document.getElementById("intro").remove();
  //Changing the boolean 'text' towards false.
  text = false;
}

//The purpose of this method is to show the input form within the introduction page,
//As this method will be called once the users presses the continue button withni the website.
function showformInput() {
  //As the input form has the opacity of currently '0', to show the form we simply change the opacity towards '1'.
  //Changing opactity towards '1' for formInputLeft
  document.getElementById("formInputLeft").style.visibility = 'visible'; document.getElementById("formInputLeft").style.opacity = '1';
  //Changing opactity towards '1' for formInputRight
  document.getElementById("formInputRight").style.visibility = 'visible'; document.getElementById("formInputRight").style.opacity = '1';
  //Changing opactity towards '1' for formInputBottom
  document.getElementById("formInputBottom").style.visibility = 'visible'; document.getElementById("formInputBottom").style.opacity = '1';
  //Changing opactity towards '1' for button ID
  document.getElementById("button").style.visibility = 'visible'; document.getElementById("button").style.opacity = '1';

  //The purpose of this section of this code is to update to variable sizes for each type of text within input form.
  //Setting font size for name.
  updateFontSize("name", nameSize);
  //Setting font size for dob.
  updateFontSize("dob", dobTextSize);
  //Setting font size for male.
  updateFontSize("male", maleSize);
  //Setting font size for female.
  updateFontSize("female", femaleSize);
  //Setting font size for button.
  updateFontSize("button", buttonSize);
}

//The purpose of this method is to start the game, this method is quite important.
//As within this method, it checks the validation of the data entered within the user input form.
//If the validation returns true. The data will be stored and saved to local storage, and the game will be saved.
function startGame() {
  playAudio();
  //Storing the data within the variables to be tested for validation.
  storeVar();
  //testing the validation method to make sure it returns true.
  if(validation() == true) {
    //Store variables again.
      storeVar();
      //Set the data towards local stroage to be used later in the project.
      setData();
      //Loading main page.
      window.location.href = 'game.html';
      //If validation is false, this will return back towards the introduction page.
  } else {
      return;
  }
}

//The purpose of this method is to store the name, age and gender from the data of the inputForm.
function storeVar() {
  //Storing the name
  name = document.getElementById("nameInput").value;
  //Storage the age variable, with the use of the getAge(); method, with the use of the dob.
  age = getAge();
  //Storing the gender value.
  gender = document.getElementById("male").checked ? "Male" : "Female";
}

//The pur;pose of this method is to check the validation of the name and age.
function validation() {
  //Checking the length of the name that has been entered. Making sure that the length is less than 2 and the value contains numbers.
  if(name.length < 2 || name.match(numbers)) {
    //if true, the invalid image will be shown.
      document.getElementById("invalid").style.visibility = "visible";
      //correctName boolean will be set towards false.
      correctName = false;
      //if False.
  } else {
      //the invalid image will be shown.
      document.getElementById("invalid").style.visibility = "hidden";
      //correctName boolean will be set towards to true.
      correctName = true;
  }

  //If age is less than 1
  if(age < 1) {
    //if true, invalid image will be shown.
      document.getElementById("invalidAge").style.visibility = "visible";
      //correctAge boolean will be set towards false.
      correctAge = false;
    // alert("Input Name: Must be valid - Length > 4, Only contain letters\nInput Age: must be a valid age - Not null, Must contain numbers");
    //if false.
  } else {
    //invalid image will be set towards hidden.
      document.getElementById("invalidAge").style.visibility = "hidden";
      //correctAge boolean will be set towards true.
      correctAge = true;
  }

//If both of these if statements return true, the validation is true/correct.
  if(correctName == true && correctAge == true) {
    return true;
    //If either of these if statements return false, the validation is false/incorrect.
  } else {
      return false;
  }
}

//The purpose of the method is get a integer value from the DOB String.
function getAge() {
  //Get todays date.
    var today = new Date();
    //Get the current year.
    var todayYear = today.getFullYear();
    //Get the current month.
    var todayMonth = today.getMonth() + 1;
    //Get the current day.
    var todayDay = today.getDate();

    //Splitting the dob string into '-'.
    var dobParts = (document.getElementById("dob").value + "").split("-");

    //checking if the length is less than 3.
    if(dobParts.length < 3) {
      //if true, return 0.
      return 0;
    }

    //Storing the year within first postion in the array.
    var dobYear = dobParts[0];
    //Storing the month within second postion in the array.
    var dobMonth = dobParts[1];
    //Storing the day within third postion in the array.
    var dobDay = dobParts[2];

    //Taking away the current year against the users DOB year.
    var age = todayYear - dobYear - 1;
    //if the today month is greater or equal to todays month.
    if (todayMonth >= dobMonth)
    //Age is plus one.
      age = age + 1;
      //Checking day is greater or equal.
    else if (todayMonth == dobMonth && dobDay >= todayDay)
    //Age is plus one.
      age = age + 1;

      //returning age.
    return age;
}

//The purpose of this method is to set the name, age, gender, operating system, location and font size.
function setData() {
  //Setting the age to localStorage
  localStorage.setItem("age", age);
  //Setting the name to localStorage
  localStorage.setItem("name", name);
  //Setting the gender to localStorage
  localStorage.setItem("gender", gender);
  //Setting the operating system to localStorage
  localStorage.setItem("os", getUsersOS());
  //Setting the location to localStorage
  storeLocation();
  //Setting the font size to localStorage
  localStorage.setItem("fontsize", messageFontSize);
}

//Finding current location of user.
function storeLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  }
}

//Finding longitude and latitude of the user.
function showPosition(position) {
  //Storing latitude
  var latitude = Math.round(position.coords.latitude * 100) / 100;
  //Storing Longitude
  var longitude = Math.round(position.coords.longitude * 100) / 100;
  //formatting the location of the user.
  var location = "[Latitude: " + latitude + "; Longitude: " + longitude + "]";
  //Storing the location of the user towards localStorage.
  localStorage.setItem("location", location);
}

//The purose of this method is to find and return the operating system the user is using.
function getUsersOS() {
  var os = navigator.userAgent.split("(")[1].split(" ")[0];
  return os;
}

//The purpose of this method is too zoom and increase the font size of everything within the introduction page
function zoomInIntro() {
  //Checking if the font size hasnt reached it's boundaries.
  if (messageFontSize * zoomStep > maxMessageFontSize)
  //if so, return and do nothing.
    return;

  //Increasing the font size of each label/button/text by multiplying by zoomstep.
  messageFontSize = messageFontSize * zoomStep;
  labelfontsize = labelfontsize * zoomStep;
  maleSize = maleSize * zoomStep;
  femaleSize = femaleSize * zoomStep;
  dobTextSize = dobTextSize * zoomStep;
  nameSize = nameSize * zoomStep;
  buttonSize = buttonSize * zoomStep;

//Checking if text is true (ensuring that the zoom is only happening within the first storyline of the website.)
  if(text) {
    //Setting the new text font.
    document.getElementById("text").style.fontSize = messageFontSize + "vw";
    //Setting the new storyLabel font.
    document.getElementById("storyLabel").style.fontSize = labelfontsize + "vw";
  }
/*  document.getElementById("male").style.fontsize = maleSize + "vw";
  document.getElementById("female").style.fontsize = femaleSize + "vw";
  document.getElementById("name").style.fontsize = nameSize + "vw";
  document.getElementById("dobText").style.fontsize = dobText + "vw";
  document.getElementById("button").style.fontsize = buttonSize + "vw"; */

  //Setting the new name font.
  updateFontSize("name", nameSize);
  //Setting the new dob font.
  updateFontSize("dob", dobTextSize);
  //Setting the new male font.
  updateFontSize("male", maleSize);
  //Setting the new female font.
  updateFontSize("female", femaleSize);
  //Setting the new button font.
  updateFontSize("button", buttonSize);
}

//The purpose of this method is too zoom and decrease the font size of everything within the introduction page
function zoomOutIntro() {
  //Checking if the font size hasnt reached it's boundaries.
  if (messageFontSize / zoomStep < minMessageFontSize)
  //if so, return and do nothing.
    return;

//Decreasing the font size of each label/button/text by dividing by zoomstep.
  messageFontSize = messageFontSize / zoomStep;
  labelfontsize = labelfontsize / zoomStep;
  maleSize = maleSize / zoomStep;
  femaleSize = femaleSize / zoomStep;
  dobTextSize = dobTextSize / zoomStep;
  nameSize = nameSize / zoomStep;
  buttonSize = buttonSize / zoomStep;

  if(text) {
    //Setting the new text font.
    document.getElementById("text").style.fontSize = messageFontSize + "vw";
    //Setting the new storyLabel font.
    document.getElementById("storyLabel").style.fontSize = labelfontsize + "vw";
  }

  //Setting the new name font.
  updateFontSize("name", nameSize);
  //Setting the new dob font.
  updateFontSize("dob", dobTextSize);
  //Setting the new male font.
  updateFontSize("male", maleSize);
  //Setting the new female font.
  updateFontSize("female", femaleSize);
  //Setting the new button font.
  updateFontSize("button", buttonSize);
}

//The purpose of this method is play the sound of a button click when a button is clicked in the intro page.
function playAudio() {
  new Audio("sounds/button_click.mp3").play();
}

//The purpose of this method is to play the sound of the background within the introduction page.
function playBackground() {
  new Audio("sounds/Giant Wyrm.mp3").play();
}

//The purpose of this method is to update the font size.
function updateFontSize(clasName, fontSize) {
  //store element in a var.
  var elms = document.getElementsByClassName(clasName);
  for (var i = 0; i < elms.length; i++)
  //increasing font size.
    elms[i].style.fontSize = fontSize + "vw";
}
