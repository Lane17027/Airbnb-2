'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.belongsTo(models.User, {
        foreignKey: 'id'
      }),
      Review.belongsTo(models.Spot, {
        foreignKey:'spotId'
      }),
      Review.hasMany(models.ReviewImage, {
        foreignKey: 'reviewId',
        onDelete:'CASCADE',
        hooks:true
      })
    }
  }
  Review.init({
    spotId: {
      type:DataTypes.INTEGER,
    },
    userId: DataTypes.INTEGER,
    review: {
      type:DataTypes.STRING,
      //added null
      allowNull:false
    },
    stars: {
      type:DataTypes.INTEGER,
      //added validate
      validate : {
        min:1,
        max:5
      }
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
