import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;
  const CONFIG_PATH = path.join(__dirname, "config.json");
  const DB_PATH = path.join(__dirname, "database.sqlite");

  app.use(cors());
  app.use(express.json());

  // Database Initialization
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');

  // API: Check if system is installed
  app.get("/api/system/status", (req, res) => {
    const installed = fs.existsSync(CONFIG_PATH);
    res.json({ installed });
  });

  // API: Save installation config & Initialize DB
  app.post("/api/system/install", (req, res) => {
    try {
      const config = req.body;
      
      // 1. Create Tables
      db.exec(`
        CREATE TABLE IF NOT EXISTS patients (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          patient_no TEXT UNIQUE,
          age INTEGER,
          gender TEXT,
          phone TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS inventory (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          item_name TEXT NOT NULL,
          sku TEXT UNIQUE,
          quantity INTEGER DEFAULT 0,
          price REAL,
          category TEXT
        );

        CREATE TABLE IF NOT EXISTS iot_data (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          device_id TEXT NOT NULL,
          sensor_type TEXT,
          value REAL,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS billing (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          patient_id INTEGER,
          amount REAL,
          status TEXT DEFAULT 'Pending',
          description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(patient_id) REFERENCES patients(id)
        );
      `);

      // 2. Seed some initial data if empty
      const patientCount = db.prepare("SELECT COUNT(*) as count FROM patients").get() as any;
      if (patientCount.count === 0) {
        db.prepare("INSERT INTO patients (name, patient_no, age, gender) VALUES (?, ?, ?, ?)").run("John Doe", "P-001", 35, "Male");
        db.prepare("INSERT INTO inventory (item_name, sku, quantity, price, category) VALUES (?, ?, ?, ?, ?)").run("Paracetamol", "MED-001", 500, 5.50, "Pharmacy");
      }

      // 3. Save config
      fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
      res.json({ success: true, message: "Installation successful" });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // API: Patients
  app.get("/api/patients", (req, res) => {
    const patients = db.prepare("SELECT * FROM patients ORDER BY created_at DESC").all();
    res.json(patients);
  });

  // API: IoT Data Simulation
  app.post("/api/iot/push", (req, res) => {
    const { device_id, sensor_type, value } = req.body;
    db.prepare("INSERT INTO iot_data (device_id, sensor_type, value) VALUES (?, ?, ?)").run(device_id, sensor_type, value);
    res.json({ success: true });
  });

  app.get("/api/iot/latest", (req, res) => {
    const data = db.prepare("SELECT * FROM iot_data ORDER BY timestamp DESC LIMIT 20").all();
    res.json(data);
  });

  // API: Get system info
  app.get("/api/system/info", (req, res) => {
    if (fs.existsSync(CONFIG_PATH)) {
      const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
      res.json(config);
    } else {
      res.status(404).json({ message: "System not configured" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
