import buildDevLogger from "./dev-logger";
import buildProdLogger from "./prod-logger";
import dotenv from "dotenv";
import { Logger } from 'winston';

dotenv.config();

let logger: Logger;

if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
    logger = buildDevLogger();
} else {
    logger = buildProdLogger();
}

export default logger;
