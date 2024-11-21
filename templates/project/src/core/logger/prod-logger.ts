import { format, createLogger } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import dayjs from "dayjs";

const { timestamp, combine, errors, json } = format;

function buildProdLogger() {
    const currentMonth = dayjs().format("YYYY-MM");
    return createLogger({
        format: combine(timestamp({ format: "DD/MM/YYYY HH:mm:ss" }), errors({ stack: true }), json()),
        transports: [
            new DailyRotateFile({
                filename: `logs/${currentMonth}/info-%DATE%.log`,
                datePattern: "YYYY-MM-DD",
                zippedArchive: false,
                maxSize: "50m",
                maxFiles: "7d",
                level: "verbose",
            }),
            new DailyRotateFile({
                filename: `logs/${currentMonth}/error-%DATE%.log`,
                datePattern: "YYYY-MM-DD",
                zippedArchive: false,
                maxSize: "20m",
                maxFiles: "30d",
                level: "error",
            }),
        ],
    });
}
export default buildProdLogger;
