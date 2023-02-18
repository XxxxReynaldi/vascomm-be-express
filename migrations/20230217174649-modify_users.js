'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		/**
		 * Add altering commands here.
		 *
		 * Example:
		 * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
		 */
		await queryInterface.addColumn('users', 'status', {
			type: Sequelize.ENUM,
			values: ['pending', 'inactive', 'active'],
			defaultValue: 'pending',
		});
		await queryInterface.addColumn('users', 'refreshToken', { type: Sequelize.STRING });
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */
		await queryInterface.removeColumn('users', 'status');
		await queryInterface.removeColumn('users', 'refreshToken');
	},
};
