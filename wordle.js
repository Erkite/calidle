var answer = "a";
document.getElementById("userGuessForm").addEventListener("submit", function(event) {
    event.preventDefault();
var guess = document.getElementById("userGuess").value.trim().toLowerCase();
if(guess === answer)
    {
        alert("YAY");
    }

});