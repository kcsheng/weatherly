const cityFormElement = $("#city-form");
const cityInputElement = $("#city-input");
const currentCityElement = $("#curr-loc-city");
const currentTimeElement = $("#curr-loc-time");
const currentWeatherElement = $("#curr-loc-weather");
const currentTempElement = $("#curr-loc-temp");
const currentWindElement = $("#curr-loc-wind");
const currentHumidityElement = $("#curr-loc-humidity");
const currentUvElement = $("#curr-loc-uv");
const apiKey = config.apiKey;
cityFormElement.on("submit", init);

function init(e) {
  e.preventDefault();
  let cityName = cityInputElement.val().trim().toLowerCase();
  if (cityName) {
    getCurrentWeather(cityName);
    // getForecastWeather(cityName);
  }
}

function getCurrentWeather(city) {
  fetch(`https://api.weatherbit.io/v2.0/current?city=${city}&key=${apiKey}`)
    .then((res) =>
      res.status == 200 ? res.json() : document.location.replace("./index.html")
    )
    .then((data) => {
      let dataPool = data.data[0];
      let currDate = dataPool.datetime.split(":").shift();
      let currWind = Math.round(dataPool.wind_spd * 100) / 100;
      let currUv = Math.round(dataPool.uv * 100) / 100;
      currentCityElement.text(`${dataPool.city_name}`);
      currentWeatherElement.html(
        `<img src=../assets/img/icons/${dataPool.weather.icon}.png>`
      );
      currentTimeElement.text(`Date: ${currDate}`);
      currentTempElement.html(`Temp: ${dataPool.temp}&deg;C`);
      currentWindElement.text(`Wind: ${currWind} m/s`);
      currentHumidityElement.text(`Humidity: ${dataPool.rh}%`);
      currentUvElement.text(`UV index: ${currUv}`);
    })
    .catch((err) => console.log(err));
}

// function getForecastWeather(city) {
//   fetch(
//     `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&days=5&key=${apiKey}`
//   )
//     .then((res) =>
//       res.status == 200 ? res.json() : document.location.replace("./index.html")
//     )
//     .then((data) => console.log(data))
//     .catch((err) => console.log(err));
// }
