import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import downloadRoutes from "./routes/downloadRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import streamRoutes from "./routes/streamRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", searchRoutes);
app.use("/api", downloadRoutes);
app.use("/api", streamRoutes);

const PORT = process.env.PORT || 3000;

app.get("/health", (req, res) => {
  res.json({ status: "server running" });
});

app.listen(PORT, () => {
  console.log("Server running on port:", PORT);
});
