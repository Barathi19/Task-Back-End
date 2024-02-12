import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./router/index.js";
import morgan from "morgan";
import errorHandler from "./middleware/error.js";
dotenv.config();

const app = express();

const PORT = process.env.PORT || "5000";

app.use(cors({ origin: "*" }));

app.use(express.json());

app.use(errorHandler);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

router(app);

app.get("/", (_, res) => {
  res.send("connected!");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB is connected!");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
