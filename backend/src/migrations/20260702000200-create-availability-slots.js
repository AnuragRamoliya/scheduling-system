"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("availability_slots", {
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
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      start_time: {
        type: Sequelize.TIME,
        allowNull: false
      },
      end_time: {
        type: Sequelize.TIME,
        allowNull: false
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

    await queryInterface.sequelize.query(
      "ALTER TABLE availability_slots ADD CONSTRAINT availability_slots_start_before_end CHECK (start_time < end_time)"
    );
    await queryInterface.addIndex("availability_slots", ["user_id", "date"]);
    await queryInterface.addIndex("availability_slots", ["user_id", "date", "start_time", "end_time"], {
      unique: true,
      name: "availability_slots_unique_window"
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("availability_slots");
  }
};
