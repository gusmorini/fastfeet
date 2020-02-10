module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'schedules',
      [
        {
          schedule: '08:00',
        },
        {
          schedule: '09:00',
        },
        {
          schedule: '10:00',
        },
        {
          schedule: '11:00',
        },
        {
          schedule: '12:00',
        },
        {
          schedule: '13:00',
        },
        {
          schedule: '14:00',
        },
        {
          schedule: '15:00',
        },
        {
          schedule: '16:00',
        },
        {
          schedule: '17:00',
        },
        {
          schedule: '18:00',
        },
      ],
      {}
    );
  },

  down: () => { },
};
