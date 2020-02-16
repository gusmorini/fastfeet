import Sequelize from 'sequelize';
import databaseConfig from '../config/database';

import User from '../app/models/User';
import Recipient from '../app/models/Recipient';
import File from '../app/models/File';
import Signature from '../app/models/Signature';
import Deliveryman from '../app/models/Deliveryman';
import Order from '../app/models/Order';
import Schedule from '../app/models/Schedule';
import DeliveryProblems from '../app/models/DeliveryProblems';

const models = [
  User,
  Recipient,
  File,
  Deliveryman,
  Order,
  Signature,
  Schedule,
  DeliveryProblems,
];

class Database {
  constructor() {
    this.init();
    this.associate();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map(model => model.init(this.connection));
  }

  associate() {
    models.map(
      model => model.associate && model.associate(this.connection.models)
    );
  }
}

export default new Database();
