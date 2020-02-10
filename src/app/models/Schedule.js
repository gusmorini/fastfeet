import Sequelize, { Model } from 'sequelize';

class Schedule extends Model {
  static init(sequelize) {
    super.init(
      {
        schedule: Sequelize.TIME,
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
