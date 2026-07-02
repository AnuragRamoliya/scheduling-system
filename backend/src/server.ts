import { app } from "./app";
import { env } from "./config/env";
import { sequelize } from "./models";

const start = async () => {
  await sequelize.authenticate();
  app.listen(env.port, () => {
    console.log(`Backend listening on port ${env.port}`);
  });
};

start().catch((error) => {
  console.error("Unable to start server", error);
  process.exit(1);
});
