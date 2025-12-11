import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import routes from "./routes/index";
import cookieParser from "cookie-parser";
import cors from "cors";
//
const app = express();
dotenv.config();
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors());
app.set("query parser", "extended");

app.use("/api", routes);
app.listen(process.env.PORT || 8000, () => {
  console.log(`Server is running on port ${process.env.PORT || 8000}`);
});
