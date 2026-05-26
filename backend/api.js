import dotenv from "dotenv";
dotenv.config();

export async function getWeather(city) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.API_KEY}&units=metric`,
    );
    const result = await res.json();

    if (result.cod == 200 && result.cod === "200") {
      return result;
    } else {
      throw new Error("Weather not found.");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

getWeather("delhi");
