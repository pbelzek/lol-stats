import fastify from "fastify";
import { registerControllers } from "./controllers";
import { logger } from "./logger";

const setupApp = async () => {
  const app = await fastify({ logger });
  registerControllers(app);
  return app;
};

export { setupApp };
