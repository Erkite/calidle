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
            displayCsvData(dataArray);
            updateDatabase(dataArray);
        }
    });
}

function displayCsvData(dataArray) {
    const container = document.getElementById('csvData');
    const table = document.createElement('table');
    table.border = '1';

    if (dataArray.length > 0) {
        // Create table header
        const headerRow = document.createElement('tr');
        Object.keys(dataArray[0]).forEach(header => {
            const headerCell = document.createElement('th');
            headerCell.textContent = header;
            headerRow.appendChild(headerCell);
        });
        table.appendChild(headerRow);

        // Create table rows
        dataArray.forEach(rowData => {
            const row = document.createElement('tr');
            Object.values(rowData).forEach(cellData => {
                const cell = document.createElement('td');
                cell.textContent = cellData;
                row.appendChild(cell);
            });
            table.appendChild(row);
        });
    }

    container.appendChild(table);
}

function updateDatabase(dataArray) {
    console.log("Data received in updateDatabase:", dataArray);
    
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
        console.error("Invalid data array received");
        return;
    }
    
    const cityNameKey = Object.keys(dataArray[0]).find(key => key.toLowerCase() === "city");
    
    if (!cityNameKey) {
        console.error("No 'CityName' column found in CSV data");
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

    // Initial population of the datalist
    updateDatalist('');
    
    answer = getRandomCity();
    console.log("New answer:", answer);
}

function getRandomCity() {
    const cityNames = Object.keys(database);
    return cityNames[Math.floor(Math.random() * cityNames.length)];
}

function updateDatalist(filter) {
    const datalist = document.getElementById('cityNames');
    datalist.innerHTML = '';  // Clear existing options

    const filteredCities = Object.keys(database).filter(city => city.startsWith(filter));
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
    guessCount++;  // Increment the guess counter

    if (guess === answer) {
        alert(`YAY! You guessed it in ${guessCount} tries.`);
        guessCount = 0;  // Reset the counter for a new game
        answer = getRandomCity();  // Pick a new answer
    } else {
        alert("Try again!");
    }
});
