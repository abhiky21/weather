import dotenv from "dotenv";
dotenv.config();

export async function getWeather(city) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.API_KEY}&units=metric`,
    );
    const result = await res.json();

    if (res.status === 401) {
      throw new Error("Invalid API key.");
    }

    if (res.status === 404) {
      throw new Error(`City "${city}" not found.`);
    }

    if (!res.ok) {
      throw new Error(result.message || "Weather API request failed.");
    }

    if (result.cod !== "200") {
      throw new Error(result.message || "Weather data not found.");
    }

    // Successful response
    if (result.cod === "200") {
      return result;
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

getWeather("delhi");
