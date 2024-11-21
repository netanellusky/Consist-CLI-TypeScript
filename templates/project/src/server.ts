import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes";
import errorMiddleware from "./middleware/errorMiddleware";
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use("/api", router);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`))