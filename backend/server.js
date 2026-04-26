require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.get("/", (req, res) => {
  res.send("RapidAid Backend Running");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/emergencies", async (req, res) => {
  const { data, error } = await supabase
    .from("emergencies")
    .select("*")
    .order("id", { ascending: false });

  if (error) return res.status(500).json(error);

  res.json(data);
});

app.post("/emergency", async (req, res) => {
  const { name, type } = req.body;

  const { data, error } = await supabase
    .from("emergencies")
    .insert([{ name, type }])
    .select()
    .single();

  if (error) return res.status(500).json(error);

  io.emit("newEmergency", data);

  res.json({ success: true, data });
});

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("updateStatus", async ({ id, status }) => {
    await supabase
      .from("emergencies")
      .update({ status })
      .eq("id", id);

    io.emit("statusChanged", { id, status });
  });
});

server.listen(process.env.PORT || 5000, () => {
  console.log("Backend running on port 5000");
});