// // logger.js
// /* eslint-disable */

// import winston from "winston";
// import "winston-daily-rotate-file"; // Import winston-daily-rotate-file package for log rotation

// const logFormat = winston.format.combine(
//   winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
//   winston.format.printf(
//     ({ timestamp, level, message }) =>
//       `${timestamp} [${level.toUpperCase()}]: ${message}`
//   )
// );

// // Create and configure the logger
// const logger = winston.createLogger({
//   level: "info",
//   format: logFormat,
//   transports: [
//     new winston.transports.Console(), // Log to console
//     new winston.transports.DailyRotateFile({
//       filename: "logs/application-%DATE%.log",
//       datePattern: "YYYY-MM-DD",
//       maxSize: "20m", // Maximum log file size before rotation
//       maxFiles: "14d", // Number of days to retain log files
//       level: "info",
//     }),
//     new winston.transports.DailyRotateFile({
//       filename: "logs/error-%DATE%.log",
//       datePattern: "YYYY-MM-DD",
//       maxSize: "20m", // Maximum log file size before rotation
//       maxFiles: "14d", // Number of days to retain log files
//       level: "error",
//     }),
//   ],
// });

// // Handle uncaught exceptions
// process.on("uncaughtException", (error) => {
//   logger.error(`Uncaught Exception: ${error.message}`);
//   process.exit(1);
// });

// // Handle unhandled promise rejections
// process.on("unhandledRejection", (reason) => {
//   logger.error(`Unhandled Promise Rejection: ${reason}`);
// });

// export default logger;
