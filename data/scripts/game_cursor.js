/* Sets the cursor to the top left corner and adds an event listener on it.
   This method is called only once when the page gets loaded
*/
function setCursor() {
  var cursor = document.getElementsByClassName("cursor")[0];

  //add a listener - when the user moves the cursor, change the position
  document.addEventListener('mousemove', e => {
    cursor.setAttribute("style", "top: " + (e.pageY - 10) + "px; left: " + (e.pageX - 10) + "px")
  });

  //perform an animation when the user clicks
  document.addEventListener('click', () => {
    cursor.classList.add("expand");
    setTimeout(() => {
      cursor.classList.remove("expand");
    }, 500);
  });
}
