import Sequelize, { Model } from 'sequelize';

class Schedule extends Model {
  static init(sequelize) {
    super.init(
      {
        squedule: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'schedules',
      }
    );
    return this;
  }
}

export default Schedule;
