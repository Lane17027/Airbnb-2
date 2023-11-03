'use strict';

const {SpotImage}= require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {


   await SpotImage.bulkCreate([
    {
     spotId: 1,
     url : 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
     preview: true
   },{
    spotId: 2,
    url : 'https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_4:3/stock%2F41a67584c110773eaac2c0219a1d436e6a831053',
    preview: true
  },{
    spotId: 3,
    url : 'https://images.saymedia-content.com/.image/ar_16:9%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:eco%2Cw_1200/MTkxMTY5NTM3Mzg5ODk2OTM5/googleyourhousegoogleastreetviewpictureofyourhomeandstreet.jpg',
    preview: true
  }], {validate:true});

  },

  async down (queryInterface, Sequelize) {
    options.tableName='SpotImages'
    const Op=Sequelize.Op

   return queryInterface.bulkDelete(options, {
    spotId: {[Op.in]: [1,2,3]}
   })

  }
};
