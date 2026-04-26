const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
app.get("/", (req, res) => {
  res.send("RapidAid Backend Running");
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "RapidAid Backend",
    time: new Date()
  });
});

app.get("/emergencies", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("emergencies")
      .select("*")
      .order("id", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

app.post("/emergencies", async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        error: "Name and Type required"
      });
    }

    const { data, error } = await supabase
      .from("emergencies")
      .insert([
        {
          name,
          type,
          status: "Pending"
        }
      ])
      .select();

    if (error) throw error;

    res.json({
      success: true,
      data
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

app.put("/emergencies/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    const { data, error } = await supabase
      .from("emergencies")
      .update({ status })
      .eq("id", id)
      .select();

    if (error) throw error;

    res.json({
      success: true,
      data
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`RapidAid Backend running on port ${PORT}`);
});