import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

export class Booking extends Model<InferAttributes<Booking>, InferCreationAttributes<Booking>> {
  declare id: CreationOptional<string>;
  declare bookingLinkId: string;
  declare date: string;
  declare startTime: string;
  declare endTime: string;
  declare visitorName: string;
  declare visitorEmail: string;
  declare status: CreationOptional<"confirmed" | "cancelled">;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export const initBookingModel = (sequelize: Sequelize) => {
  Booking.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      bookingLinkId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "booking_link_id"
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      startTime: {
        type: DataTypes.TIME,
        allowNull: false,
        field: "start_time"
      },
      endTime: {
        type: DataTypes.TIME,
        allowNull: false,
        field: "end_time"
      },
      visitorName: {
        type: DataTypes.STRING(120),
        allowNull: false,
        field: "visitor_name"
      },
      visitorEmail: {
        type: DataTypes.STRING(180),
        allowNull: false,
        field: "visitor_email",
        validate: { isEmail: true }
      },
      status: {
        type: DataTypes.ENUM("confirmed", "cancelled"),
        allowNull: false,
        defaultValue: "confirmed"
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      sequelize,
      modelName: "Booking",
      tableName: "bookings"
    }
  );

  return Booking;
};
