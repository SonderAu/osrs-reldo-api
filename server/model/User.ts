import { DataTypes } from 'sequelize';
import PostgresClient from '../client/postgresClient';

const User = PostgresClient.instance().define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {},
);

await User.sync();

export default User;
