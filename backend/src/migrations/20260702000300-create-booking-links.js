"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("booking_links", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      token: {
        type: Sequelize.STRING(80),
        allowNull: false,
        unique: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.addIndex("booking_links", ["token"], {
      unique: true,
      name: "booking_links_token_idx"
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("booking_links");
  }
};
