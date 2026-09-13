import { getWeatherIcon } from "./store/data.js";

const temperature = document.querySelector(".temperature");

function createDetailCard(className, title, value, secondary = "") {
  const card = document.createElement("div");
  card.className = className;

  const titleElement = document.createElement("h3");
  titleElement.textContent = title;

  const valueElement = document.createElement("h2");
  valueElement.textContent = value;

  card.appendChild(titleElement);
  card.appendChild(valueElement);

  return card;
}

export function createWeatherDetails(items) {
  const container = document.createElement("div");

  container.id = "temp-det-f";
  container.className = "temp-det";

  container.innerHTML = "";
  temperature.innerHTML = "";

  const weatherIcon = getWeatherIcon(items.weather[0].icon);

  const dayType = document.createElement("div");
  dayType.className = "day-type";
  dayType.innerHTML = `<i class="wi ${weatherIcon}"></i>`;

  const dayText = document.createElement("h5");
  dayText.textContent = items.weather[0].description;

  dayType.appendChild(dayText);

  const tempDiv = document.createElement("div");
  tempDiv.className = "temp-feels";

  const tempTitle = document.createElement("h1");

  tempTitle.textContent = Math.round(items.main.temp);

  const span = document.createElement("span");
  span.textContent = "°C";

  const feelsLike = document.createElement("h3");
  feelsLike.textContent = "Feels like ";

  const tempFeel = document.createElement("span");
  tempFeel.textContent = Math.round(items.main.feels_like) + "°C";

  const maxTemp = Math.round(items.main.temp_max);
  const minTemp = Math.round(items.main.temp_min);

  const increaseDecrease = document.createElement("p");

  // Up arrow
  const incIcon = document.createElement("i");
  incIcon.className = "fa-solid fa-arrow-up fa-sm";
  incIcon.style.color = "rgb(244, 112, 112)";

  // Max temperature
  const incSpan = document.createElement("span");
  incSpan.textContent = `${maxTemp}°`;

  // Down arrow
  const desIcon = document.createElement("i");
  desIcon.className = "fa-solid fa-arrow-down fa-sm";
  desIcon.style.color = "rgb(116, 192, 252)";

  // Min temperature
  const desSpan = document.createElement("span");
  desSpan.textContent = `${minTemp}°`;

  // Add to your temperature div

  // Humidity
  const humidity = createDetailCard(
    "humidityData",
    "HUMIDITY",
    `${items.main.humidity}%`,
  );

  // Wind
  const windSpeed = (items.wind.speed * 3.6).toFixed(1);

  const wind = createDetailCard("windData", "WIND VECTOR", `${windSpeed} km/h`);

  // Barometer
  const barometer = createDetailCard(
    "barometerData",
    "BAROMETER",
    `${items.main.pressure} hPa`,
  );

  // Visibility
  const visibilityKm = (items.visibility / 1000).toFixed(1);

  const visibility = createDetailCard(
    "visibilityData",
    "VISIBILITY",
    `${visibilityKm} km`,
  );

  temperature.appendChild(dayType);
  tempTitle.appendChild(span);
  temperature.appendChild(tempDiv);
  tempDiv.appendChild(tempTitle);

  increaseDecrease.appendChild(incIcon);
  increaseDecrease.appendChild(incSpan);
  increaseDecrease.appendChild(document.createTextNode(" • "));
  increaseDecrease.appendChild(desIcon);
  increaseDecrease.appendChild(desSpan);

  feelsLike.appendChild(tempFeel);
  feelsLike.appendChild(increaseDecrease);
  tempDiv.appendChild(feelsLike);

  container.appendChild(humidity);
  container.appendChild(wind);
  container.appendChild(barometer);
  container.appendChild(visibility);

  return container;
}
