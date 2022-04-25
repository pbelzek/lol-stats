import pinoPretty from "pino-pretty";
import pino from "pino";

export { logger };
export type { Logger };

interface Logger {
  child(bindings: pino.Bindings): Logger;

  fatal: pino.LogFn;
  error: pino.LogFn;
  warn: pino.LogFn;
  info: pino.LogFn;
  debug: pino.LogFn;
  trace: pino.LogFn;
}

const logLevel =
  process.env.NODE_ENV === "test" ? "warn" : process.env.LOG_LEVEL ?? "info";

const logger =
  process.env.NODE_ENV === "production"
    ? pino({ level: logLevel })
    : pino(
        { level: logLevel },
        pinoPretty({
          levelFirst: true,
          colorize: true,
          translateTime: "yyyy-mm-dd HH:MM:ss",
        })
      );
