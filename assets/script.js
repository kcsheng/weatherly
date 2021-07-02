const cityFormElement = $("#city-form");
const cityInputElement = $("#city-input");
const currentCityElement = $("#curr-loc-city");
const currentTimeElement = $("#curr-loc-time");
const currentWeatherElement = $("#curr-loc-weather");
const currentTempElement = $("#curr-loc-temp");
const currentWindElement = $("#curr-loc-wind");
const currentHumidityElement = $("#curr-loc-humidity");
const currentUvElement = $("#curr-loc-uv");
const fiveDayForecast = $(".five-day-forecast");
const apiKey = config.apiKey;
cityFormElement.on("submit", init);

function init(e) {
  e.preventDefault();
  let cityName = cityInputElement.val().trim().toLowerCase();
  if (cityName) {
    getCurrentWeather(cityName);
    getForecastWeather(cityName);
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

function getForecastWeather(city) {
  fetch(
    `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&days=6&key=${apiKey}`
  )
    .then((res) =>
      res.status == 200 ? res.json() : document.location.replace("./index.html")
    )
    .then((data) => {
      let dataPool = data.data;
      let fiveDayContent = ``;
      for (let i = 1; i < dataPool.length; i++) {
        let eachDayContent = `<div>
          <div>${dataPool[i].datetime}</div>
          <div><img src=../assets/img/icons/${dataPool[i].weather.icon}.png></div>
          <div>Temp: ${dataPool[i].temp}&deg;C</div>
          <div>Humidity: ${dataPool[i].rh}%</div>
        </div>`;
        fiveDayContent += eachDayContent;
      }
      data.data.forEach((day) => {});
      fiveDayForecast.html(fiveDayContent);
    })
    .catch((err) => console.log(err));
}
