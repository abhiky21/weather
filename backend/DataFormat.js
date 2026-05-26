import { getWeather } from "./api.js";

async function WeatherForm(city) {
  const weather = await getWeather(city);

  const result = weather.list.reduce((acc, item) => {
    const date = DateFormater(item.dt_txt);

    if (!acc[date]) {
      acc[date] = [];
    }

    acc[date].push(item);

    return acc;
  }, {});
  const data = {
    cod: weather.cod,
    message: weather.message,
    cnt: weather.cnt,
    list: result,
    city: weather.city,
  };
  return data;
}

export default WeatherForm;

// WeatherForm("delhi");

function DateFormater(dt) {
  const [date] = dt.split(" ");
  return date;
}
