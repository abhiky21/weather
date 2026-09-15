import { timeClear, dateModify, weekdays, timeFormate } from "./service.js";
import { country, DateForm, getWeatherIcon } from "./store/data.js";
import { createWeatherDetails } from "./weatherDetails.js";
import { createWeatherTrend } from "./weatherTrend.js";

let selectCity = document.querySelector(".city");
const navDate = document.querySelector(".nav-date");
const temperature = document.querySelector(".temperature");
const tempDetails = document.querySelector(".temperature-details");
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
const forms = document.querySelectorAll("form");
const setting = document.querySelector(".setting");
const refreshBtn = document.querySelector(".refreshbtn");
const input = document.querySelector("input");

magnifyingGlass.addEventListener("click", () => {
  navbar.classList.add("search-open");
});

closeSearch.addEventListener("click", () => {
  navbar.classList.remove("search-open");
});

async function fetchWeather(city) {
  try {
    weatherError.innerHTML = "";
    loadingOverlay.classList.add("active");
    refreshBtn.classList.remove("show");

    const res = await fetch(
      `https://weather-api-4jst.onrender.com/weather?city=${encodeURIComponent(city)}`,
    );

    const result = await res.json();

    console.log(result);

    if (!res.ok) {
      weatherError.innerHTML = `<h2>${result.message || "Weather not found"}</h2>`;
      navMain.style.display = "none";
      weatherContent.style.display = "none";
      daysForecast.style.display = "none";
      return;
    }

    if (result.cod !== "200" && result.cod !== 200) {
      weatherError.innerHTML = `<h2>Weather data not found</h2>`;
      navMain.style.display = "none";
      weatherContent.style.display = "none";
      daysForecast.style.display = "none";
      return;
    }

    weatherError.innerHTML = "";
    weatherContent.style.display = "flex";
    navMain.style.display = "flex";
    daysForecast.style.display = "block";

    const todayTemp = result.list[DateForm];

    addingData(todayTemp, result);
    forecastData(Object.values(result.list), result);

    const allForecast = Object.values(result.list).flat();
    // createWeatherTrend(allForecast);
  } catch (error) {
    console.error("Fetch error:", error);

    weatherContent.style.display = "none";
    daysForecast.style.display = "none";
    navMain.style.display = "none";
    weatherError.innerHTML = `<h2>Unable to connect to server</h2><p>Please try again later.</p>`;
  } finally {
    loadingOverlay.classList.remove("active");
  }
}

function forecastData(info, result) {
  tempForecast.innerHTML = "";

  info.slice(0, 5).forEach((day) => {
    const firstForecast = day[0];

    const temps = day.map((forecast) => forecast.main.temp);

    const max = Math.max(...temps);
    const min = Math.min(...temps);

    const rainProbability = Math.round((firstForecast.pop || 0) * 100);

    const icon = getWeatherIcon(firstForecast.weather[0].icon);

    const forecast = document.createElement("div");
    forecast.className = "forecast";
    forecast.innerHTML = `<div class="forecast-bg"></div>
                          <div class="forecast-det">
                          <h2>${weekdays(firstForecast.dt_txt)}</h2>
                          <i class="wi ${icon}"></i>
                          <div class="forecast-rain">
                          <h4>${firstForecast.weather[0].main}</h4>
                          <h5>${rainProbability}% rain</h5></div>
                          <h2> ${Math.round(max)}°C / ${Math.round(min)}°C</h2>
                          </div>`;

    forecast.addEventListener("click", () => {
      addingData(day, result);
    });
    tempForecast.appendChild(forecast);
  });
}

function addingData(data, result) {
  temperature.innerHTML = "";
  tempDetails.innerHTML = "";
  tempHours.innerHTML = "";

  refreshBtn.addEventListener("click", () => {
    fetchWeather(result.city.name);
  });

  if (country[result.city.country]) {
    selectCity.innerText =
      result.city.name + ", " + country[result.city.country];
  } else {
    selectCity.innerText = result.city.name;
  }

  let weatherDetails;

  // let isToday = false;

  createWeatherTrend(data, Object.values(result.list));
  data.map((items) => {
    const now = new Date();

    // if (
    //   timeFormate(items.dt_txt).ckt <= timeFormate(now).ckt &&
    //   dateModify(items.dt_txt) === DateForm
    // ) {
    //   isToday = true;
    // }

    if (
      timeFormate(items.dt_txt) <= timeFormate(now) &&
      timeFormate(items.dt_txt).ckt <= timeFormate(now).ckt
    ) {
      weatherDetails = createWeatherDetails(items);
    }
  });

  tempDetails.appendChild(weatherDetails);
}

async function handleSearch(event) {
  event.preventDefault();

  const input = event.target.querySelector("input");
  const city = input.value.trim();

  if (!city) return;

  desktopInput.value = city;
  mobileInput.value = city;

  await fetchWeather(city);
}

desktopInput.value = "Delhi";
mobileInput.value = "Delhi";

desktopForm.addEventListener("submit", handleSearch);
mobileForm.addEventListener("submit", handleSearch);

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

forms.forEach((form) => {
  const input = form.querySelector("input");
  const removeSearch = form.querySelector(".remove-search");

  input.addEventListener("input", () => {
    if (input.value.trim() !== "") {
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
});

setting.addEventListener("click", () => {
  refreshBtn.classList.toggle("show");
});

todayDate();
