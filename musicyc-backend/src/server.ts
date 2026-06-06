import dotenv from "dotenv";


if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

import "./startup/validateEnv.js";

import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

import downloadRoutes from "./routes/downloadRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import streamRoutes from "./routes/streamRoutes.js";

const app = express();

app.set("trust proxy", 1);

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());

app.use("/api", searchRoutes);
app.use("/api", downloadRoutes);
app.use("/api", streamRoutes);

app.use("/cache", express.static("cache/audio"));

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "server running" });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  res.status(500).json({
    error: "Internal server error",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
