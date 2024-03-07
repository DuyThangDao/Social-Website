import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv, { config } from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { register } from "./controllers/authControllers.js";
import authRoutes from "./routes/authRoutes.js";
import usersRoutes from "./routes/usesrRoutes.js";
import postsRoutes from "./routes/postsRoutes.js";
import { verifyToken } from "./middlewares/auth.js";
import { createPost } from "./controllers/postsControllers.js";

/* Configurations */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* Routes */
app.post("/auth/register", register);
app.post("/posts", verifyToken, createPost);
app.use("/auth", authRoutes);
app.use("/user", usersRoutes);
app.use("/posts", postsRoutes);
/* Mongoose setup */
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Successfully connected to DB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`DB_ERROR: ${error}`);
  });
