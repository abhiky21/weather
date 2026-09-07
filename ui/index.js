import { timeClear, dateModify, weekdays, timeFormate } from "./service.js";

const input = document.getElementById("search-city");
let selectCity = document.querySelector(".city");
const form = document.getElementById("form");
const navDate = document.querySelector(".nav-date");
const temperature = document.querySelector(".temperature");
const tempDetails = document.querySelector("#temp-det-f");
const tempDet = document.querySelector("#temp-det-s");
const tempHours = document.querySelector(".temp-hours");
const tempForecast = document.querySelector(".temp-forecast");
// const tempSecondCard = document.querySelector(".temp-card");
const navMain = document.querySelector(".nav-main");
const daysForecast = document.querySelector(".day-forecast");

const weatherError = document.querySelector("#weather-error");
const weatherContent = document.querySelector("#weather-content");
const loadingOverlay = document.getElementById("loading-overlay");

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

  tempHours.innerHTML = "";

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
      timeFormate(items.dt_txt).ckt <= timeFormate(now).ckt &&
      items.dt_txt.split(" ")[0] == DateForm
    ) {
      isToday = true;
      isSunrise = true;
    }

    htn = `<span class="hour-list">
      <h4>${timeFormate(items.dt_txt).uit}</h4>
      <i class="fa-solid fa-circle-dot" style="color: ${isToday ? "blue" : "black"}"></i>
      <i class="wi wi-cloudy"></i>
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
  // temperature.appendChild(h1);

  const dayType = document.createElement("span");
  dayType.className = "day-type";
  dayType.innerHTML = `<i class="wi wi-day-sunny"></i>`;

  if (dayt) {
    dayType.appendChild(dayt);
  }

  temperature.appendChild(dayType);

  // tempDetails.appendChild(h3f);
  // tempDetails.appendChild(h3s);
  // tempDetails.appendChild(h3t);
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

// Object.values(result.list).map((dat) => {
//   forecastData(Object.values(result.list), result);
// });
