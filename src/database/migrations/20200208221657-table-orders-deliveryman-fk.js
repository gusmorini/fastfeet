module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('orders', 'deliveryman_id', {
      type: Sequelize.INTEGER,
      references: { model: 'deliveryman', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('orders', 'deliveryman_id');
  },
};
