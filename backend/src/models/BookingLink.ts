import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

export class BookingLink extends Model<InferAttributes<BookingLink>, InferCreationAttributes<BookingLink>> {
  declare id: CreationOptional<string>;
  declare userId: string;
  declare token: string;
  declare isActive: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export const initBookingLinkModel = (sequelize: Sequelize) => {
  BookingLink.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "user_id"
      },
      token: {
        type: DataTypes.STRING(80),
        allowNull: false,
        unique: true
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: "is_active"
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      sequelize,
      modelName: "BookingLink",
      tableName: "booking_links"
    }
  );

  return BookingLink;
};
