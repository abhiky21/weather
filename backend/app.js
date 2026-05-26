import express from "express";
import cors from "cors";
import Weatherform from "./DataFormat.js";

const app = express();
app.use(cors());

app.get("/weather", async (req, res) => {
  try {
    const city = req.query.city;

    const result = await Weatherform(city);
    return res.json(result);
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000, () => {
  console.log(`Server running on port 3000`);
});
