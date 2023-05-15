import { Sequelize } from "sequelize";

export default class PostgresClient {
    static sequelize: Sequelize;

    static init() {
        this.sequelize = new Sequelize(
            `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PW}@${process.env.POSTGRES_HOSTNAME}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DBNAME}`
        );
    }

    static instance() {
        return this.sequelize;
    }
}
