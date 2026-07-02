import { Sequelize } from "sequelize";
import { env } from "../config/env";
import { initAvailabilitySlotModel } from "./AvailabilitySlot";
import { initBookingModel } from "./Booking";
import { initBookingLinkModel } from "./BookingLink";
import { initUserModel } from "./User";

export const sequelize = new Sequelize(env.db.name, env.db.user, env.db.password, {
  host: env.db.host,
  port: env.db.port,
  dialect: "mysql",
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    underscored: true,
    timestamps: true
  }
});

export const User = initUserModel(sequelize);
export const AvailabilitySlot = initAvailabilitySlotModel(sequelize);
export const BookingLink = initBookingLinkModel(sequelize);
export const Booking = initBookingModel(sequelize);

User.hasMany(AvailabilitySlot, { foreignKey: "userId", as: "availabilitySlots", onDelete: "CASCADE" });
AvailabilitySlot.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(BookingLink, { foreignKey: "userId", as: "bookingLinks", onDelete: "CASCADE" });
BookingLink.belongsTo(User, { foreignKey: "userId", as: "user" });

BookingLink.hasMany(Booking, { foreignKey: "bookingLinkId", as: "bookings", onDelete: "CASCADE" });
Booking.belongsTo(BookingLink, { foreignKey: "bookingLinkId", as: "bookingLink" });

export const db = {
  sequelize,
  User,
  AvailabilitySlot,
  BookingLink,
  Booking
};
