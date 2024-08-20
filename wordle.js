document.addEventListener('DOMContentLoaded', function() {
    fetch('california_cities.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
        })
        .then(csvData => {
            console.log("CSV data received:", csvData);
            parseCsvData(csvData);
        })
        .catch(error => {
            console.error('Error loading CSV:', error);
        });
});

let answer;  // Declare the answer variable here
let database = {};  // Declare the database as an object
let guessCount = 0;  // Initialize the guess counter
let previousGuesses = [];  // Array to store previous guesses
let cityOptions = []; // Array to store the list of city options

function parseCsvData(csvData) {
    Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        transform: function(value) {
            return value.trim();
        },
        complete: function(results) {
            console.log("Papa Parse results:", results);
            const dataArray = results.data;
            console.log("Parsed data array:", dataArray);
            updateDatabase(dataArray);
        }
    });
}

function updateDatabase(dataArray) {
    console.log("Data received in updateDatabase:", dataArray);
    
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
        console.error("Invalid data array received");
        return;
    }
    
    const cityNameKey = Object.keys(dataArray[0]).find(key => key.toLowerCase() === "city");
    
    if (!cityNameKey) {
        console.error("No 'City' column found in CSV data");
        return;
    }
    
    database = dataArray.reduce((acc, row) => {
        const cityName = row[cityNameKey];
        if (cityName) {
            acc[cityName.toLowerCase()] = row;
        }
        return acc;
    }, {});

    if (Object.keys(database).length === 0) {
        console.error("No valid city names found in the data");
        return;
    }

    cityOptions = Object.keys(database);
    answer = getRandomCity();
    console.log("New answer:", answer);
    updateDatalist('');
}

function getRandomCity() {
    return cityOptions[Math.floor(Math.random() * cityOptions.length)];
}

function updateDatalist(filter) {
    const datalist = document.getElementById('cityNames');
    datalist.innerHTML = '';  // Clear existing options

    const filteredCities = cityOptions.filter(city => city.toLowerCase().startsWith(filter.toLowerCase()));
    if (filteredCities.length === 0) {
        filteredCities.push(...cityOptions);
    }
    filteredCities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        datalist.appendChild(option);
    });
}

document.getElementById("userGuess").addEventListener("input", function(event) {
    const filter = event.target.value.toLowerCase();
    updateDatalist(filter);
});

document.getElementById("userGuessForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const guess = document.getElementById("userGuess").value.trim().toLowerCase();

    if (database[guess]) { // when the guess is within the database of cities (i.e. allowed guess)
        guessCount++;
        const guessData = database[guess];
        previousGuesses.push(guessData);
        displayPreviousGuesses();
    }
    else {
        alert("Not a California City! Try again");
        updateDatalist(''); // Update the datalist options to show all options
        document.getElementById("userGuess").value = '';
    }

    if (guess === answer) {
        alert(`YAY! You guessed it in ${guessCount} tries.`);
        guessCount = 0;  // Reset the counter for a new game
        answer = getRandomCity();  // Pick a new answer
        previousGuesses = [];  // Reset previous guesses
        displayPreviousGuesses();  // Clear the display
        updateDatalist(''); // Update the datalist options for a new game
    } else if (guess != answer && database[guess]) { // when guess is allowed guess but is not the correct guess
        alert("Try again!");
        updateDatalist(''); // Update the datalist options to show all options
        document.getElementById("userGuess").value = '';
    }
});

function displayPreviousGuesses() {
    const previousGuessesList = document.getElementById('previousGuessesList');
    previousGuessesList.innerHTML = '';  // Clear existing list

    previousGuesses.forEach(guessData => {
        const listItem = document.createElement('div');
        listItem.classList.add('previous-guess');

        const cityElement = document.createElement('div');
        cityElement.classList.add('guess-item');
        cityElement.textContent = guessData.city;
        listItem.appendChild(cityElement);

        const latitudeElement = document.createElement('div');
        latitudeElement.classList.add('guess-item');
        latitudeElement.textContent = guessData.latd;
        listItem.appendChild(latitudeElement);

        const longitudeElement = document.createElement('div');
        longitudeElement.classList.add('guess-item');
        longitudeElement.textContent = guessData.longd;
        listItem.appendChild(longitudeElement);

        const populationElement = document.createElement('div');
        populationElement.classList.add('guess-item');
        populationElement.textContent = guessData.population_total;
        listItem.appendChild(populationElement);

        const areaElement = document.createElement('div');
        areaElement.classList.add('guess-item');
        areaElement.textContent = guessData.area_total_sq_mi;
        listItem.appendChild(areaElement);

        previousGuessesList.appendChild(listItem);
    });
}