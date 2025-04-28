
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mysql = require("mysql2");
const path = require("path");

dotenv.config();

const app = express();

// Enable CORS for frontend requests
const corsOptions = {
  origin: 'http://192.168.190.122', // Adjust this to your frontend's URL or IP
  methods: ['GET', 'POST'],
};
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files (optional, useful if you have static assets)
app.use(express.static(path.join(__dirname, 'public')));

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "An@300305",  // Update with your MySQL password
  database: "esp32db",
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection error:", err.message);
  } else {
    console.log("✅ Connected to MySQL database");
  }
});

// Store latest sensor data in memory (optional)
let latestSensorData = {};

// Endpoint to receive sensor data from ESP32 and store it in DB

app.post("/sensordata", (req, res) => {
  const { temperature, humidity, airQuality } = req.body;

  // Input validation
  if (temperature == null || humidity == null || airQuality == null) {
    console.error("❌ Incomplete sensor data received:", req.body);
    return res.status(400).json({ message: "Missing required fields" });
  }

  const query = "INSERT INTO sensor_data (temperature, humidity, airQuality) VALUES (?, ?, ?)";
  const values = [temperature, humidity, airQuality];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("❌ Error inserting data:", err.message);
      return res.status(500).send("Database insert failed");
    }
    console.log("✅ Data inserted:", values);
    latestSensorData = { temperature, humidity, airQuality };  // Update the in-memory data
    res.status(200).send("Data received and stored");
  });
});

// Endpoint to get the latest sensor data from memory
app.get("/sensordata", (req, res) => {
  res.json(latestSensorData);
});

// Endpoint to get the most recent sensor entry from MySQL
app.get("/latest", (req, res) => {
  const query = "SELECT * FROM sensor_data ORDER BY id DESC LIMIT 1";

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching latest data:", err.message);
      return res.status(500).json({ message: "Server error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }
    res.json(results[0]);
  });
});

// Root route
app.get("/", (req, res) => {
  res.send("✅ ESP32 Sensor Backend with MySQL!");
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
