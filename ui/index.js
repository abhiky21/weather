import { timeClear, dateModify, weekdays, timeFormate } from "./service.js";

const input = document.getElementById("search-city");
let selectCity = document.querySelector(".city");
const form = document.getElementById("form");
const navDate = document.querySelector(".nav-date");
const temperature = document.querySelector(".temperature");
const tempDetails = document.querySelector("#temp-det-f");
const tempDet = document.querySelector("#temp-det-s");
const tempHoours = document.querySelector(".temp-hours");
const tempForecast = document.querySelector(".temp-forecast");

const country = {
  AU: "Australia",
  BD: "Bangladesh",
  CN: "China",
  ID: "Indonesia",
  IN: "India",
  JP: "Japan",
  LK: "Sri Lanka",
  MY: "Malaysia",
  NP: "Nepal",
  NZ: "New Zealand",
  PK: "Pakistan",
  SG: "Singapore",
  TH: "Thailand",
};

async function fetchWeather(city) {
  try {
    const res = await fetch(`http://localhost:3000/weather?city=${city}`);

    const result = await res.json();

    const newDate = new Date();

    const DateForm =
      newDate.getFullYear() +
      "-" +
      "0" +
      (newDate.getMonth() + 1) +
      "-" +
      newDate.getDate();

    const todayTemp = result.list[DateForm];

    addingData(todayTemp, result);

    Object.values(result.list).map((dat) => {
      forecastData(Object.values(result.list), result);
    });
  } catch (error) {
    throw new Error(error);
  }
}

function forecastData(info, result) {
  tempForecast.innerHTML = "";

  info.slice(0, 6).forEach((day) => {
    const item = day[0];

    const temps = day.map((d) => d.main.temp);

    const max = Math.max(...temps);
    const min = Math.min(...temps);

    const forecast = document.createElement("div");

    forecast.className = "forecast";

    forecast.innerHTML = `<div class="forecast-bg"></div>
                    <div class="forecast-det">
                        <h2>${weekdays(item.dt_txt)}</h2>
                        <h2>${parseInt(max)}°C/${parseInt(min)}°C</h2>
                        <i class="wi wi-cloudy"></i>
                        <h4>${item.weather[0].main}</h4>
                    </div>`;

    forecast.addEventListener("click", () => {
      addingData(day, result);
    });
    tempForecast.appendChild(forecast);
  });
}

function addingData(data, result) {
  const newDate = new Date();

  const DateForm =
    newDate.getFullYear() +
    "-" +
    "0" +
    (newDate.getMonth() + 1) +
    "-" +
    newDate.getDate();

  const parents = document.querySelectorAll(
    ".temperature, #temp-det-f, #temp-det-s",
  );

  parents.forEach((parent) => {
    parent.innerHTML = "";
  });

  if (result.city.name == country[result.city.country]) {
    selectCity.innerText = result.city.name;
  } else {
    selectCity.innerText =
      result.city.name + ", " + country[result.city.country];
  }

  let h1, h3f, h3s, h3t, dayt, htn;

  tempHoours.innerHTML = "";

  let isToday = false;
  let isSunrise = false;

  data.map((items) => {
    const now = new Date();

    let h3sf = `<h3>Sunrise: ${timeClear(result.city.sunrise)}</h3>
    <h3>Sunset: ${timeClear(result.city.sunset)}</h3>`;

    if (isSunrise) {
      tempDet.innerHTML = h3sf;
    }

    if (
      timeFormate(items.dt_txt).split("-")[1] <=
        timeFormate(now).split("-")[1] &&
      items.dt_txt.split(" ")[0] == DateForm
    ) {
      isToday = true;
      isSunrise = true;
    }

    htn = `<span class="hour-list">
      <h4>${timeFormate(items.dt_txt).split("-")[0]}</h4>
      <i class="fa-solid fa-circle-dot" style="color: ${isToday ? "blue" : "black"}"></i>
      <i class="wi wi-cloudy"></i>
      <h4>${parseInt(items.main.temp)}°C</h4>
      <h5>${items.weather[0].main}</h5>
      </span>`;

    isToday = false;

    tempHoours.innerHTML += htn;

    if (timeFormate(items.dt_txt) <= timeFormate(now)) {
      h1 = Object.assign(document.createElement("h1"), {
        textContent: parseInt(items.main.temp) + "°C",
      });

      h3f = Object.assign(document.createElement("h3"), {
        textContent: "Feels like " + parseInt(items.main.feels_like) + "°C",
      });

      h3s = Object.assign(document.createElement("h3"), {
        textContent: "humidity: " + parseInt(items.main.humidity) + "%",
      });

      h3t = Object.assign(document.createElement("h3"), {
        textContent: "Wind: " + parseInt(items.wind.speed) + "km/h",
      });

      dayt = Object.assign(document.createElement("h5"), {
        textContent: items.weather[0].description,
      });
    }
  });

  temperature.appendChild(h1);

  temperature.appendChild(
    Object.assign(document.createElement("span"), {
      className: "day-type",
      innerHTML: `<i class="wi wi-day-sunny"></i>`,
    }),
  );

  tempDetails.appendChild(h3f);
  tempDetails.appendChild(h3s);
  tempDetails.appendChild(h3t);

  const dayType = document.querySelector(".day-type");
  dayType.appendChild(dayt);
}

input.addEventListener("keydown", function (event) {
  let inpcity = input.value;
  if (event.key == "Enter") {
    fetchWeather(inpcity);
  }
});

fetchWeather("delhi");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const city = input.value;

  await fetchWeather(city);
});

function todayDate() {
  const date = new Date();

  const options = {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  };

  const hour = date.getHours();
  const min = date.getMinutes();
  const sec = date.getSeconds();

  const formDate =
    date.toLocaleDateString("en-GB", options) +
    " | " +
    hour +
    ":" +
    min +
    ":" +
    sec;

  const h3 = Object.assign(document.createElement("h3"), {
    className: "date",
    textContent: formDate,
  });

  navDate.appendChild(h3);
}

todayDate();
