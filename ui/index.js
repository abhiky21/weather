import { timeClear, dateModify, weekdays, timeFormate } from "./service.js";

let selectCity = document.querySelector(".city");
const navDate = document.querySelector(".nav-date");
const temperature = document.querySelector(".temperature");
const tempDetails = document.querySelector("#temp-det-f");
const tempDet = document.querySelector("#temp-det-s");
const tempHours = document.querySelector(".temp-hours");
const tempForecast = document.querySelector(".temp-forecast");
const navMain = document.querySelector(".nav-main");
const daysForecast = document.querySelector(".day-forecast");

const weatherError = document.querySelector("#weather-error");
const weatherContent = document.querySelector("#weather-content");
const loadingOverlay = document.getElementById("loading-overlay");
const magnifyingGlass = document.querySelector(".magnifying-glass-second");
const closeSearch = document.querySelector(".close-search");
const navbar = document.getElementById("navbar-container");

const desktopForm = document.getElementById("desktop-form");
const mobileForm = document.getElementById("mobile-form");

const desktopInput = document.getElementById("search-city");
const mobileInput = document.getElementById("input-city");

magnifyingGlass.addEventListener("click", () => {
  navbar.classList.add("search-open");
});

closeSearch.addEventListener("click", () => {
  navbar.classList.remove("search-open");
});

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
  IR: "Iran",
};

function getWeatherIcon(icon) {
  const icons = {
    "01d": "wi-day-sunny",
    "01n": "wi-night-clear",

    "02d": "wi-day-cloudy",
    "02n": "wi-night-alt-cloudy",

    "03d": "wi-cloudy",
    "03n": "wi-cloudy",

    "04d": "wi-cloudy",
    "04n": "wi-cloudy",

    "09d": "wi-showers",
    "09n": "wi-showers",

    "10d": "wi-day-rain",
    "10n": "wi-night-alt-rain",

    "11d": "wi-day-thunderstorm",
    "11n": "wi-night-alt-thunderstorm",

    "13d": "wi-day-snow",
    "13n": "wi-night-alt-snow",

    "50d": "wi-day-fog",
    "50n": "wi-night-fog",
  };

  return icons[icon] || "wi-na";
}

async function fetchWeather(city) {
  try {
    // Remove old error
    weatherError.innerHTML = "";

    // Show loading
    loadingOverlay.classList.add("active");
    // weatherContent.style.display = "none";
    // navMain.style.display = "none";
    // daysForecast.style.display = "none";

    const res = await fetch(
      `https://weather-api-4jst.onrender.com/weather?city=${encodeURIComponent(city)}`,
    );

    const result = await res.json();

    if (!res.ok) {
      weatherError.innerHTML = `
        <h2>⚠️ ${result.message || "Weather not found"}</h2>
      `;
      navMain.style.display = "none";
      weatherContent.style.display = "none";
      daysForecast.style.display = "none";
      return;
    }

    // Unexpected response
    if (result.cod !== "200" && result.cod !== 200) {
      weatherError.innerHTML = `
        <h2>⚠️ Weather data not found</h2>
      `;
      navMain.style.display = "none";
      weatherContent.style.display = "none";
      daysForecast.style.display = "none";
      return;
    }

    weatherError.innerHTML = "";
    weatherContent.style.display = "flex";
    navMain.style.display = "block";
    daysForecast.style.display = "block";

    const newDate = new Date();

    const DateForm =
      newDate.getFullYear() +
      "-" +
      "0" +
      (newDate.getMonth() + 1) +
      "-" +
      "0" +
      newDate.getDate();

    const todayTemp = result.list[DateForm];
    addingData(todayTemp, result);
    forecastData(Object.values(result.list), result);
  } catch (error) {
    console.error("Fetch error:", error);

    weatherContent.style.display = "none";
    daysForecast.style.display = "none";
    navMain.style.display = "none";
    weatherError.innerHTML = `
      <h2>⚠️ Unable to connect to server</h2>
      <p>Please try again later.</p>
    `;
  } finally {
    loadingOverlay.classList.remove("active");
  }
}

function forecastData(info, result) {
  tempForecast.innerHTML = "";

  info.slice(0, 6).forEach((day) => {
    const item = day[0];

    const temps = day.map((d) => d.main.temp);
    const icon = getWeatherIcon(item.weather[0].icon);

    const max = Math.max(...temps);
    const min = Math.min(...temps);

    const forecast = document.createElement("div");

    forecast.className = "forecast";

    forecast.innerHTML = `<div class="forecast-bg"></div>
                    <div class="forecast-det">
                        <h2>${weekdays(item.dt_txt)}</h2>
                        <h2>${parseInt(max)}°C/${parseInt(min)}°C</h2>
                        <i class="wi ${icon}"></i>
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

  tempHours.innerHTML = "";

  let isToday = false;
  let isSunrise = true;

  data.map((items) => {
    const now = new Date();

    let h3sf = `<div class="sunrise">
    <h3>Sunrise: ${timeClear(result.city.sunrise)}</h3>
    <h3>Sunset: ${timeClear(result.city.sunset)}</h3></div>`;

    if (isSunrise) {
      tempDet.innerHTML = h3sf;
    }

    if (timeFormate(items.dt_txt).ckt <= timeFormate(now).ckt) {
      isToday = true;
      isSunrise = true;
    }

    const icon = getWeatherIcon(items.weather[0].icon);

    htn = `<span class="hour-list">
      <h4>${timeFormate(items.dt_txt).uit}</h4>
      <i class="fa-solid fa-circle-dot" style="color: ${isToday ? "blue" : "black"}"></i>
      <i class="wi ${icon}"></i>
      <h4>${parseInt(items.main.temp)}°C</h4>
      <h5>${items.weather[0].main}</h5>
      </span>`;

    isToday = false;

    tempHours.innerHTML += htn;

    if (
      timeFormate(items.dt_txt) <= timeFormate(now) &&
      timeFormate(items.dt_txt).ckt <= timeFormate(now).ckt
    ) {
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
  tempDetails.appendChild(h3f);
  tempDetails.appendChild(h3s);
  tempDetails.appendChild(h3t);

  const dayType = document.createElement("span");
  dayType.className = "day-type";
  dayType.innerHTML = `<i class="wi wi-day-sunny"></i>`;

  if (dayt) {
    dayType.appendChild(dayt);
  }

  temperature.appendChild(dayType);
}

const forms = document.querySelectorAll("form");

forms.forEach((form) => {
  const input = form.querySelector("input");
  const removeSearch = document.querySelector(".remove-search");

  input.addEventListener("input", () => {
    if (input.value.trim() != "") {
      removeSearch.style.display = "block";
    } else {
      removeSearch.style.display = "none";
    }
  });

  removeSearch.addEventListener("click", () => {
    input.value = "";
    removeSearch.style.display = "none";
    input.focus();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const city = input.value.trim();

    if (!city) return;

    desktopInput.value = city;
    mobileInput.value = city;

    document.querySelectorAll(".remove-search").forEach((x) => {
      x.style.display = "block";
    });

    await fetchWeather(city);
  });
});

fetchWeather("delhi");

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
