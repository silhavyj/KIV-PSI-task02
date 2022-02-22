/* number of drops the animation will be composed of */
var numberOfDrops = 100;

/* Generates random number within the interval given as a parameter
   minNum - min number that can be generated
   maxNum - max number that can be generated
  */
function randRange(minNum, maxNum) {
  return (Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
}

/* Creates rain in the background. This method is called only
   once when the page gets loaded
*/
function createRain() {
  for (var i = 1; i < numberOfDrops; i++) {
     //rectangle in which the drops will be generated
     //this can be changed in case it doesn't cover the whole screen
    var dropLeft = randRange(0, 2000);
    var dropTop = randRange(-1000, 1400);

    //create the drop itself, add CSS classes, and add it do the html
    $('.rain').append('<div class="drop", id="drop' + i + '"></div>');
    $('#drop' + i).css('left', dropLeft);
    $('#drop' + i).css('top', dropTop);
  }
}

/* Stops the rain - erases all drops from the html */
function clearRain() {
    $('.rain').empty();
}
