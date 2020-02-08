import Sequelize from 'sequelize';
import databasecfg from '../config/database';

import User from '../app/models/User';
import Recipient from '../app/models/Recipient';
import File from '../app/models/File';
import Signature from '../app/models/Signature';
import Deliveryman from '../app/models/Deliveryman';

const models = [User, Recipient, File, Deliveryman, Signature];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databasecfg);
    models.map(model => {
      model.init(this.connection);
      // se existe o método associate faça...
      if (model.associate) model.associate(this.connection.models);
    });
  }
}

export default new Database();
