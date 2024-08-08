const apiKey = '5c822b0e88db4e2d1e6ceed45aa552f7';

const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
searchBtn.className = 'search-btn'; // Add this line
const currentWeatherDiv = document.getElementById('current-weather');
const forecastList = document.getElementById('forecast-list');

searchBtn.addEventListener('click', searchLocation);

// Get current location automatically
navigator.geolocation.getCurrentPosition(position => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
                .then(response => response.json())
                .then(forecastData => {
                    displayForecast(forecastData);
                })
                .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
});

function searchLocation() {
    const location = searchInput.value.trim();
    if (location) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                displayCurrentWeather(data);
                fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${apiKey}`)
                    .then(response => response.json())
                    .then(forecastData => {
                        displayForecast(forecastData);
                    })
                    .catch(error => console.error(error));
            })
            .catch(error => console.error(error));
    }
}

function displayCurrentWeather(data) {
    const locationElement = document.getElementById('location');
    const currentWeatherIconElement = document.getElementById('current-weather-icon');
    const currentWeatherTempElement = document.getElementById('current-weather-temp');
    const currentWeatherRainElement = document.getElementById('current-weather-rain');
    const currentWeatherHumidityElement = document.getElementById('current-weather-humidity');

    locationElement.textContent = data.name;
    // Use OpenWeatherMap's icon URL
    currentWeatherIconElement.src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    currentWeatherTempElement.textContent = `Temperature: ${data.main.temp}°C`;

    if (data.weather[0].description.includes('rain')) {
        currentWeatherRainElement.textContent = 'Rain: Yes';
    } else {
        currentWeatherRainElement.textContent = 'Rain: No';
    }

    currentWeatherHumidityElement.textContent = `Humidity: ${data.main.humidity}%`;
}

function displayForecast(data) {
    const forecast = data.list.slice(0, 6);
    forecastList.innerHTML = '';

    forecast.forEach((day, index) => {
        const forecastListItem = document.createElement('li');
        const dateElement = document.createElement('p');
        const iconElement = document.createElement('img');
        const tempElement = document.createElement('p');
        const rainElement = document.createElement('p');

        dateElement.textContent = `Day ${index + 1}: ${new Date(day.dt * 1000).toLocaleDateString()}`;
        // Use OpenWeatherMap's icon URL
        iconElement.src = `http://openweathermap.org/img/w/${day.weather[0].icon}.png`;
        tempElement.textContent = `Temperature: ${day.main.temp}°C`;

        if (day.weather[0].description.includes('rain')) {
            rainElement.textContent = 'Rain: Yes';
        } else {
            rainElement.textContent = 'Rain: No';
        }

        forecastListItem.appendChild(dateElement);
        forecastListItem.appendChild(iconElement);
        forecastListItem.appendChild(tempElement);
        forecastListItem.appendChild(rainElement);

        forecastList.appendChild(forecastListItem);
    });
    function handleSearchResult(result) {
      if (result === null || result === undefined) {
        // Show the error message
        document.getElementById("error-message").style.display = "block";
        // Hide the current weather and forecast sections
        currentWeatherDiv.style.display = "none";
        forecastList.style.display = "none";
      } else {
        // Hide the error message
        document.getElementById("error-message").style.display = "none";
        // Show the current weather and forecast sections
        currentWeatherDiv.style.display = "block";
        forecastList.style.display = "block";
        // Display the search result
        displayCurrentWeather(result);
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${searchInput.value.trim()}&units=metric&appid=${apiKey}`)
          .then(response => response.json())
          .then(forecastData => {
            displayForecast(forecastData);
          })
          .catch(error => console.error(error));
      }
    }
}