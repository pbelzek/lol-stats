import { FastifyInstance } from "fastify";
import packageJson from "../../../package.json";

const registerHealtzController = (app: FastifyInstance) => () => {
  app.route({
    method: "GET",
    url: "/healtz",
    handler: async (req, reply) => {
      reply.status(200).send(`lol-stats v${packageJson.version}`);
    },
  });
};

export { registerHealtzController };
