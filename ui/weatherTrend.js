import { dateModify, timeFormate } from "./service.js";
import { DateForm, getWeatherIcon } from "./store/data.js";
import { createWeatherDetails } from "./weatherDetails.js";

let trendChart = null;

function getNext24Hours(data, list) {
  if (data.length != 8) {
    let dataLength = 8 - data.length;
    const newData = [...data, ...list[1].slice(0, dataLength)];
    return newData;
  }

  return data;
}

export function createWeatherTrend(data, list) {
  const canvas = document.querySelector("#weather-trend-chart");
  const cardsContainer = document.querySelector("#trend-hours");

  const ctx = canvas.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, 0, 180);

  gradient.addColorStop(0, "rgba(70, 180, 230, 0.45)");
  gradient.addColorStop(1, "rgba(70, 180, 230, 0)");

  if (!canvas || !cardsContainer) return;

  cardsContainer.innerHTML = "";

  const forecast = getNext24Hours(data, list);

  const temperatures = forecast.map((item) => Math.round(item.main.temp));

  const labels = forecast.map((item) => {
    return timeFormate(item.dt_txt).uit;
  });

  if (trendChart) {
    trendChart.destroy();
  }

  trendChart = new Chart(canvas, {
    type: "line",

    data: {
      labels,
      datasets: [
        {
          data: temperatures,
          borderColor: "#79cfff",
          backgroundColor: gradient,
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
          display: false,
        },

        tooltip: {
          enabled: true,

          callbacks: {
            label: function (context) {
              return `${context.raw}`;
            },
          },
        },
      },
      scales: {
        x: {
          display: false,
        },
        y: {
          display: false,
        },
      },
      elements: {
        line: {
          borderJoinStyle: "round",
        },
      },
    },
  });

  const currentTime = new Date();
  let currentIndex = -1;

  forecast.forEach((item, index) => {
    const forecastTime = new Date(item.dt_txt.replace(" ", "T"));

    if (forecastTime <= currentTime) {
      currentIndex = index;
    }
  });

  forecast.forEach((items, index) => {
    const card = document.createElement("div");
    card.className = "hour-list";

    const time = document.createElement("h4");
    time.textContent = timeFormate(items.dt_txt).uit;

    const icon = document.createElement("i");
    icon.className = `wi ${getWeatherIcon(items.weather[0].icon)}`;

    const temperature = document.createElement("h2");
    temperature.textContent = `${Math.round(items.main.temp)}°C`;

    const rain = document.createElement("p");

    const rainProbability = Math.round((items.pop || 0) * 100);

    rain.textContent = `${rainProbability}%`;

    if (index === currentIndex) {
      card.classList.add("current-hour");
      temperature.classList.add("current-temp");
      time.classList.add("current-time");
    }

    card.addEventListener("click", () => {
      const newDetails = createWeatherDetails(items);
      document.querySelector("#temp-det-f")?.replaceWith(newDetails);

      selectedHour(card);
    });

    card.appendChild(time);
    card.appendChild(icon);
    card.appendChild(temperature);
    card.appendChild(rain);

    cardsContainer.appendChild(card);
  });
}

function selectedHour(card) {
  document.querySelectorAll(".hour-list").forEach((item) => {
    item.classList.remove("current-hour");

    item.querySelector("h2")?.classList.remove("current-temp");
    item.querySelector("h4")?.classList.remove("current-time");
  });

  card.classList.add("current-hour");

  card.querySelector("h2")?.classList.add("current-temp");
  card.querySelector("h4")?.classList.add("current-time");
}
