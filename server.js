const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "*"
}));

app.get("/api/classify", async (req, res) => {
  try {
    const { name } = req.query;

    // Missing name
    if (!name || name.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Name query parameter is required"
      });
    }

    // Non-string validation
    if (typeof name !== "string") {
      return res.status(422).json({
        status: "error",
        message: "Name must be a string"
      });
    }

    // Call Genderize API
    const response = await axios.get(
      `https://api.genderize.io?name=${name}`
    );

    const { gender, probability, count } = response.data;

    // Edge case: no prediction
    if (!gender || count === 0) {
      return res.status(422).json({
        status: "error",
        message:
          "No prediction available for the provided name"
      });
    }

    const sample_size = count;

    const is_confident =
      probability >= 0.7 &&
      sample_size >= 100;

    const processed_at = new Date().toISOString();

    return res.json({
      status: "success",
      data: {
        name,
        gender,
        probability,
        sample_size,
        is_confident,
        processed_at
      }
    });

  } catch (error) {

    return res.status(502).json({
      status: "error",
      message: "External API request failed"
    });

  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
