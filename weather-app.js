const apiKey = '86b9a79f2fee43c2b8c110024250504'; // Replace with your OpenWeather API key

const citySelect = document.getElementById('city-select');
const dateElem = document.getElementById('date');
const dayElem = document.getElementById('day');
const iconElem = document.getElementById('weather-icon');
const tempElem = document.getElementById('temperature');
const forecastElem = document.getElementById('forecast');

// Optional: Use your own icons
const customIcons = {
  '01d': 'img/sunny.png',
  '02d': 'img/partly-cloudy.png',
  '03d': 'img/cloudy.png',
  '04d': 'img/overcast.png',
  '09d': 'img/rainy.png',
  '10d': 'img/rain.png',
  '11d': 'img/thunderstorm.png',
  '13d': 'img/snow.png',
  '50d': 'img/fog.png',
  '01n': 'img/clear-night.png',
  '02n': 'img/night-partly-cloud.png',
  '03n': 'img/cloudy-night.png',
  '04n': 'img/overcast-night.png',
  '09n': 'img/rainy-night.png',
  '10n': 'img/rain-night.png',
  '11n': 'img/thunderstorm-night.png',
  '13n': 'img/night-snow.png',
  '50n': 'img/night-fog.png'
};

function getWeather(city) {
  const currentURL = `https://api.weatherapi.com/v1/current.json?q=${city}&key=${apiKey}`;
  const forecastURL = `https://api.weatherapi.com/v1/forecast.json?q=${city}&key=${apiKey}&days=3`;

  // Get current weather
  fetch(currentURL)
    .then(res => res.json())
    .then(data => {
      const date = new Date();
      dateElem.textContent = date.toLocaleDateString('en-US', { day: 'numeric', month: 'long' });
      dayElem.textContent = date.toLocaleDateString('en-US', { weekday: 'long' });
      tempElem.textContent = `${Math.round(data.current.temp_c)}°`; // Assuming 'temp_c' is included

      const iconCode = data.current.condition.icon.split('/').pop().split('.')[0]; // Extract icon code
      iconElem.src = customIcons[iconCode] || `https:${data.current.condition.icon}`; // Fallback to API icon if not found
    });

  // Get 3-day forecast
  fetch(forecastURL)
    .then(res => res.json())
    .then(data => {
      forecastElem.innerHTML = '';
      const daily = data.forecast.forecastday;

      daily.forEach(day => {
        const forecastDate = new Date(day.date);
        const icon = day.day.condition.icon.split('/').pop().split('.')[0]; // Extract icon code
        const tempMax = Math.round(day.day.maxtemp_c);  // Assuming 'maxtemp_c' is included
        const tempMin = Math.round(day.day.mintemp_c);  // Assuming 'mintemp_c' is included
        const dayName = forecastDate.toLocaleDateString('en-US', { weekday: 'long' });

        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `
          <img src="${customIcons[icon] || `https:${day.day.condition.icon}`}" />
          <span>${dayName}</span>
          <span>${tempMax}° / ${tempMin}°</span>
        `;
        forecastElem.appendChild(forecastItem);
      });
    });
}

citySelect.addEventListener('change', () => {
  getWeather(citySelect.value);
});

getWeather(citySelect.value); // Initial load
