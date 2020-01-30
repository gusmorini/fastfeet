import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        pass: Sequelize.VIRTUAL,
        pass_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async usr => {
      if (usr.pass) {
        usr.pass_hash = await bcrypt.hash(usr.pass, 8);
      }
    });
    return this;
  }

  checkPass(pass) {
    return bcrypt.compare(pass, this.pass_hash);
  }
}

export default User;
