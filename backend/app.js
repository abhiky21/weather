import express from "express";
import cors from "cors";
import Weatherform from "./DataFormat.js";

const app = express();
app.use(cors());

app.get("/weather", async (req, res) => {
  try {
    const city = req.query.city;

    const result = await Weatherform(city);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Backend error:", error.message);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
