"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("bookings", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      booking_link_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "booking_links",
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
      visitor_name: {
        type: Sequelize.STRING(120),
        allowNull: false
      },
      visitor_email: {
        type: Sequelize.STRING(180),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM("confirmed", "cancelled"),
        allowNull: false,
        defaultValue: "confirmed"
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
      "ALTER TABLE bookings ADD CONSTRAINT bookings_start_before_end CHECK (start_time < end_time)"
    );
    await queryInterface.addIndex("bookings", ["booking_link_id", "date", "start_time"], {
      unique: true,
      name: "bookings_unique_link_date_start"
    });
    await queryInterface.addIndex("bookings", ["booking_link_id", "date"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("bookings");
  }
};
