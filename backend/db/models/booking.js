'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(models.User, {
        foreignKey: 'id'
      }),

      Booking.belongsTo(models.Spot, {
        foreignKey:'spotId'
      })
    }
  }
  Booking.init({
    spotId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    startDate: {
      type:DataTypes.DATEONLY,
      unique:true,
      validate: {
        isDate: true,
        isBeforeEndDate(value) {
          if (value >= this.endDate) {
            throw new Error('Start date must be before the end date');
          }
        },
      },
    },
    endDate:{
      type:DataTypes.DATEONLY,
      unique:true,
      validate: {
        isDate: true,
        isAfterStartDate(value) {
          if (value <= this.startDate) {
            throw new Error('End date must be after the start date');
          }
        },
      },
    },

  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};
