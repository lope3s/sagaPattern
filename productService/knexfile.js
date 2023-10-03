import "dotenv/config"

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const knexConfig = {
  development: {
      client: "pg",
      connection: {
          host: process.env["DB_HOST"],
          database: process.env["DB"],
          user: process.env["DB_USER"],
          password: process.env["DB_PASSWORD"],
          port: 5432
      },
    useNullAsDefault: true,
    migrations: {
        directory: "./src/database/migrations"
    }
  },

  testing: {
    client: "sqlite3",
    connection: {
      filename: "./dev.sqlite3"
    },
    useNullAsDefault: true,
    migrations: {
        directory: "./src/database/migrations"
    }
  }
};

export default knexConfig
