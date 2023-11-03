'use strict';

const {ReviewImage}=require('../models')


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await ReviewImage.bulkCreate([{
      reviewId: 1,
      url: 'https://upload.wikimedia.org/wikipedia/commons/6/62/Downtown_Houston%2C_TX_Skyline_-_2018.jpg'
    },{
      reviewId: 1,
      url: 'https://media.istockphoto.com/id/1328886194/photo/portrait-of-new-homeowners-admiring-their-investment.jpg?s=612x612&w=0&k=20&c=QrQgyTR1TAGLMriWcicG7l1tIChFSI7C9tgb2qcJ8l0='
    },{
      reviewId: 2,
      url: 'https://i.pinimg.com/originals/52/f8/12/52f812773d27bfa9c6567d6052ba556b.jpg'
    },{
      reviewId: 3,
      url: 'https://cdn.thespaces.com/wp-content/uploads/2021/06/Airbnb-1.jpg'
    }],{validate: true})
  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['https://upload.wikimedia.org/wikipedia/commons/6/62/Downtown_Houston%2C_TX_Skyline_-_2018.jpg','https://media.istockphoto.com/id/1328886194/photo/portrait-of-new-homeowners-admiring-their-investment.jpg?s=612x612&w=0&k=20&c=QrQgyTR1TAGLMriWcicG7l1tIChFSI7C9tgb2qcJ8l0=','https://i.pinimg.com/originals/52/f8/12/52f812773d27bfa9c6567d6052ba556b.jpg','https://cdn.thespaces.com/wp-content/uploads/2021/06/Airbnb-1.jpg'] }
    }, {});

  }
};
