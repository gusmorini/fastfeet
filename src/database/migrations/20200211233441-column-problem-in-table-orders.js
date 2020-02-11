module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('orders', 'problem', {
      type: Sequelize.BOOLEAN,
      defaultValue: null,
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('orders', 'problem');
  },
};
