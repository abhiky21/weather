import dotenv from "dotenv";
dotenv.config();

export async function getWeather(city) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.API_KEY}&units=metric`,
    );
    const result = await res.json();
    // console.log("api: ", result.city.name.toLowerCase().replace(/ā/g, "a"));
    if (
      result.cod == 200 &&
      result.cod === "200" &&
      city.toLowerCase() == result.city.name.toLowerCase().replace(/ā/g, "a")
    ) {
      console.log("siwan string");
      return result;
    } else {
      return new Error("Weather not found.");
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

getWeather("delhi");
