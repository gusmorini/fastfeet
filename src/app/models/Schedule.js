import Sequelize, { Model } from 'sequelize';

class Schedule extends Model {
  static init(sequelize) {
    super.init(
      {
        schedule: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'schedules',
        timestamps: false,
      }
    );
    return this;
  }
}

export default Schedule;
