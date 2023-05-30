import { Sequelize } from 'sequelize';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class PostgresClient {
  static sequelize: Sequelize;

  static init(): void {
    this.sequelize = new Sequelize(
      `postgres://${process.env.POSTGRES_USER ?? ''}:${
        process.env.POSTGRES_PW ?? ''
      }@${process.env.POSTGRES_HOSTNAME ?? ''}:${
        process.env.POSTGRES_PORT ?? ''
      }/${process.env.POSTGRES_DBNAME ?? ''}`,
    );
  }

  static instance(): Sequelize {
    return this.sequelize;
  }
}
