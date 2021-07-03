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
const locationBtns = $(".location-btns");
const clearBtn = $(".clearBtn");
// key kept in config.js using .gitignore won't work with github.io
const apiKey = "74dd06d307434ae89493dcead4a400ed";

let historyClicked = false;
// Event on clicking submit
cityFormElement.on("submit", init);

function init(e) {
  e.preventDefault();
  let cityName = cityInputElement.val().trim().toLowerCase();
  if (cityName) {
    getCurrentWeather(cityName);
    getForecastWeather(cityName);
  }
  cityInputElement.val("");
}
// Event on clicking button of history
locationBtns.on("click", "button", reload);
function reload(e) {
  let cityName = e.target.innerText;
  historyClicked = true;
  getCurrentWeather(cityName);
  getForecastWeather(cityName);
}
// Event on clearing storage
clearBtn.on("click", () => {
  localStorage.clear();
  document.location.replace("./index.html");
});

function getCurrentWeather(city) {
  fetch(`https://api.weatherbit.io/v2.0/current?city=${city}&key=${apiKey}`)
    .then((res) =>
      res.status == 200 ? res.json() : document.location.replace("./index.html")
    )
    .then((data) => {
      let dataPool = data.data[0];
      let currDate = dataPool.datetime.split(":").shift();
      let currWind = Math.round(dataPool.wind_spd * 100) / 100;
      let currHumidity = Math.round(dataPool.rh * 100) / 100;
      let currUv = Math.round(dataPool.uv * 100) / 100;
      currentCityElement.text(`${dataPool.city_name}`);
      currentWeatherElement.html(
        `<img src=./assets/img/icons/${dataPool.weather.icon}.png>`
      );
      currentTimeElement.text(`Date: ${currDate}`);
      currentTempElement.html(`Temp: ${dataPool.temp}&deg;C`);
      currentWindElement.text(`Wind: ${currWind} m/s`);
      currentHumidityElement.text(`Humidity: ${currHumidity}%`);
      currentUvElement.text(`UV index: ${currUv}`);
      let storableCity = dataPool.city_name;
      // We store city only if it is from submit route, not from history click.
      if (!historyClicked) {
        storeSearchCity(storableCity);
      } else {
        // We toggle it back to false.
        historyClicked = false;
      }
      showSearchCity();
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
      fiveDayForecast.html(fiveDayContent);
    })
    .catch((err) => console.log(err));
}

function storeSearchCity(city) {
  let n = localStorage.length;
  localStorage.setItem(`city${n}`, city);
}

function showSearchCity() {
  if (localStorage.length > 0) {
    let cityBtns = ``;
    for (let i = localStorage.length; i > 0; i--) {
      let searchedCity = localStorage.getItem(`city${i - 1}`);
      let cityBtn = `<button>${searchedCity}</button>`;
      cityBtns += cityBtn;
    }
    locationBtns.html(cityBtns);
  }
}
showSearchCity();
