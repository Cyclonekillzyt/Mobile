import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv"
import downloadRoutes from "./routes/downloadRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import streamRoutes from "./routes/streamRoutes.js";


dotenv.config();

console.log("YT Key:", process.env.PORT);

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", searchRoutes);
app.use("/api", downloadRoutes);
app.use("/api", streamRoutes);


const PORT = process.env.PORT || 3000;

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
);

app.get("/health", (req, res) => {
  res.json({ status: "server running" });
});

app.listen(PORT, () => {
  console.log("Server running on port:", PORT);
});



