import { setupApp } from "./app";
import { env } from "./env";

main();

async function main() {
  try {
    const app = await setupApp();
    await app.listen(env.PORT, env.HOST);
  } catch (err) {
    process.exit(1);
  }
}
