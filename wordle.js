let database = [];
let answer = '';

document.addEventListener('DOMContentLoaded', function() {
    fetch('california_cities.csv')
        .then(response => response.text())
        .then(csvData => {
            parseCsvData(csvData);
        })
        .catch(error => {
            console.error('Error loading CSV:', error);
        });
});

function parseCsvData(csvData) {
    Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        transform: value => value.trim(),
        complete: function(results) {
            const dataArray = results.data;
            displayCsvData(dataArray);
            updateDatabase(dataArray);
            setupAutoFill();
        }
    });
}

function displayCsvData(dataArray) {
    const container = document.getElementById('csvData');
    const table = document.createElement('table');
    table.border = '1';

    if (dataArray.length > 0) {
        const headerRow = document.createElement('tr');
        Object.keys(dataArray[0]).forEach(header => {
            const headerCell = document.createElement('th');
            headerCell.textContent = header;
            headerRow.appendChild(headerCell);
        });
        table.appendChild(headerRow);

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
    const cityNameKey = Object.keys(dataArray[0]).find(key => key.toLowerCase() === "city");
    if (!cityNameKey) {
        console.error("No 'City' column found in CSV data");
        return;
    }

    database = dataArray.map(row => row[cityNameKey].toLowerCase()).filter(Boolean);
    if (database.length === 0) {
        console.error("No valid city names found in the data");
        return;
    }

    answer = database[Math.floor(Math.random() * database.length)];
    console.log("New answer:", answer);
}

function setupAutoFill() {
    const userGuessInput = document.getElementById('userGuess');
    const citySuggestions = document.getElementById('citySuggestions');

    userGuessInput.addEventListener('input', function() {
        const inputValue = userGuessInput.value.trim().toLowerCase();
        citySuggestions.innerHTML = '';

        if (inputValue.length > 0) {
            const filteredCities = database.filter(city => city.startsWith(inputValue));
            filteredCities.forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                citySuggestions.appendChild(option);
            });
        }
    });
}

document.getElementById("userGuessForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const guess = document.getElementById("userGuess").value.trim().toLowerCase();

    if (guess === answer) {
        alert("YAY");
    } else {
        alert("Try again!");
    }
});
