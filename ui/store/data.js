export const country = {
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

export function getWeatherIcon(icon) {
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

const newDate = new Date();

export const DateForm =
  newDate.getFullYear() +
  "-" +
  String(newDate.getMonth() + 1).padStart(2, "0") +
  "-" +
  String(newDate.getDate()).padStart(2, "0");
