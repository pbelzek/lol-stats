import { FastifyInstance } from "fastify";
import { registerHealtzController } from "./modules/healtz/healtz.ctrl";
import { registerRankController } from "./modules/rank/rank.ctrl";
import { registerStatsController } from "./modules/stats/stats.ctrl";

const registerControllers = (app: FastifyInstance) => {
  registerStatsController(app)();
  registerHealtzController(app)();
  registerRankController(app)();
};

export { registerControllers };
