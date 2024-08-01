document.addEventListener('DOMContentLoaded', function() {
    fetch('california_cities1.csv')
        .then(response => {
            console.log("Fetch response:", response);
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
    
    const firstRow = dataArray[0];
    console.log("First row of data:", firstRow);
    
    const cityNameKey = Object.keys(firstRow).find(key => key.toLowerCase() === "city");
    
    if (!cityNameKey) {
        console.error("No 'CityName' column found in CSV data");
        return;
    }
    
    database = dataArray.map(row => {
        const cityName = row[cityNameKey];
        if (!cityName) {
            console.warn("Row with missing city name:", row);
            return null;
        }
        return cityName.toLowerCase();
    }).filter(Boolean);
    
    if (database.length === 0) {
        console.error("No valid city names found in the data");
        return;
    }
    
    answer = database[Math.floor(Math.random() * database.length)];
    console.log("New answer:", answer);
}

document.getElementById("userGuessForm").addEventListener("submit", function(event) {
    event.preventDefault();
    var guess = document.getElementById("userGuess").value.trim().toLowerCase();

    if (guess === answer) {
        alert("YAY");
    } else {
        alert("Try again!");
    }
});