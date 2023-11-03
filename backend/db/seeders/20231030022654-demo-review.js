'use strict';

const {Review}=require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

 await Review.bulkCreate([{
   spotId: 1,
   userId: 2,
   review: 'Very nice and tidy home.',
   stars: 5
 },{
  spotId: 1,
  userId: 3,
  review: 'Could be cleaner but overall very nice!',
  stars: 4
},{
  spotId: 2,
  userId: 1,
  review: 'Not as big as advertized.',
  stars: 3
},{
  spotId: 3,
  userId: 1,
  review: 'Perfect location! Next to downtown, lots of things to do!',
  stars: 5
},{
  spotId: 3,
  userId: 2,
  review: 'Good host, good spot!',
  stars: 4
}], {validate:true});

  },

  async down (queryInterface, Sequelize) {
    options.tableName='Reviews'
    const Op=Sequelize.Op

    return queryInterface.bulkDelete(options, {
      spotId: {[Op.in]: [1,2,3]}
    })

  }
};
