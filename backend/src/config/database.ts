import { env } from "./env";

const config = {
  username: env.db.user,
  password: env.db.password,
  database: env.db.name,
  host: env.db.host,
  port: env.db.port,
  dialect: "mysql",
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    underscored: true,
    timestamps: true
  }
};

export = {
  development: config,
  test: {
    ...config,
    database: `${env.db.name}_test`
  },
  production: config
};
