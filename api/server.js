require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
const port = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "ejercicios_db";

app.use(cors({
  origin: process.env.WEB_ORIGIN
    ? [process.env.WEB_ORIGIN, "http://127.0.0.1:5500", "http://localhost:5500"]
    : true
}));
app.use(express.json());

let client;
let items;

app.get("/", (_req, res) => {
  res.json({
    mensaje: "API de los ejercicios 1, 2 y 6",
    estado: "activa",
    endpoints: ["/api/health", "/api/items"]
  });
});

app.get("/api/health", async (_req, res) => {
  try {
    if (!items) return res.status(503).json({
      ok: false,
      api: "activa",
      mongodb: "sin configurar",
      detalle: "Configura MONGODB_URI en las variables de entorno."
    });
    await client.db("admin").command({ ping: 1 });
    res.json({ ok: true, api: "activa", mongodb: "conectado" });
  } catch (error) {
    res.status(500).json({ ok: false, api: "activa", mongodb: "error" });
  }
});

app.get("/api/items", async (_req, res) => {
  if (!items) return res.status(503).json({ error: "MongoDB no está configurado. Revisa MONGODB_URI." });
  try {
    const data = await items.find().sort({ createdAt: -1 }).limit(100).toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "No se pudieron consultar los registros." });
  }
});

app.post("/api/items", async (req, res) => {
  if (!items) return res.status(503).json({ error: "MongoDB no está configurado. Revisa MONGODB_URI." });
  const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
  if (!title || title.length > 120) {
    return res.status(400).json({ error: "El título es obligatorio y debe tener máximo 120 caracteres." });
  }
  try {
    const item = { title, createdAt: new Date() };
    const result = await items.insertOne(item);
    res.status(201).json({ _id: result.insertedId, ...item });
  } catch (error) {
    res.status(500).json({ error: "No se pudo guardar el registro." });
  }
});

async function start() {
  if (uri) {
    client = new MongoClient(uri, {
      serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
    });
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    items = client.db(dbName).collection("items");
    console.log(`Conectado a MongoDB Atlas; base de datos: ${dbName}`);
  } else {
    console.warn("MONGODB_URI no está definida; la API inicia, pero las operaciones de datos no estarán disponibles.");
  }
  app.listen(port, "0.0.0.0", () => console.log(`API escuchando en puerto ${port}`));
}

start().catch((error) => {
  console.error("No se pudo iniciar la API. Revisa MONGODB_URI y la configuración de Atlas.", error.message);
  process.exit(1);
});
