import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async usr => {
      if (usr.password) {
        usr.password_hash = await bcrypt.hash(usr.password, 8);
      }
    });
    return this;
  }

  checkPass(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
