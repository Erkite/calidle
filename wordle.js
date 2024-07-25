var database = ["red","orange","yellow"]; // the database of answers
var answer = database[Math.floor(Math.random() * database.length)]; // generates random answer from array
console.log(answer); // this is temporary for testing (displays the answer in the console)

document.getElementById("userGuessForm").addEventListener("submit", function(event) {
    event.preventDefault();
var guess = document.getElementById("userGuess").value.trim().toLowerCase(); // sets "guess" variable to the user's guess they inputed

if(guess === answer) // testing to see if user's guess is the answer
    {
        alert("YAY");
    }

});