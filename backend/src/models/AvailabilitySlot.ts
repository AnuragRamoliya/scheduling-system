import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

export class AvailabilitySlot extends Model<
  InferAttributes<AvailabilitySlot>,
  InferCreationAttributes<AvailabilitySlot>
> {
  declare id: CreationOptional<string>;
  declare userId: string;
  declare date: string;
  declare startTime: string;
  declare endTime: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export const initAvailabilitySlotModel = (sequelize: Sequelize) => {
  AvailabilitySlot.init(
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
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      sequelize,
      modelName: "AvailabilitySlot",
      tableName: "availability_slots"
    }
  );

  return AvailabilitySlot;
};
