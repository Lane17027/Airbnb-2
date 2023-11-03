'use strict';

const {Spot}= require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

      await Spot.bulkCreate([
        {
        ownerId: 1,
        address: '2330 Saddle Court',
        city: 'Idaho Falls',
        state: 'Idaho',
        country: 'United States of America',
        lat: 43.48,
        lng: -112.07,
        name: 'Cozy home',
        description: 'My childhood home that I grew up in Idaho',
        price: 50
      }, {
        ownerId: 1,
        address: '2100 W 1450',
        city: 'Layton',
        state: 'Utah',
        country: 'United States of America',
        lat: 32.01,
        lng: -101.22,
        name: 'Cozy Layton home',
        description: 'Enjoy this beautiful, spacious home',
        price: 33
      },
      {
        ownerId: 2,
        address: '3303 wifes street',
        city: 'Hurricane',
        state: 'Utah',
        country: 'United States of America',
        lat: 38.02,
        lng: 120.03,
        name: 'Wifes Childhood Home',
        description: 'Where my wife grew up next to Zion National Park',
        price: 100
      },
      {
        ownerId: 2,
        address: '2100 N Churchwood Drive',
        city: 'Tooele',
        state: 'Utah',
        country: 'United States of America',
        lat: 69.69,
        lng: 43.34,
        name: 'Tooele Townhouse',
        description: 'Townhouse in Tooele near Lagoon',
        price: 56
      },
      {
        ownerId: 3,
        address: '6300 N Salt Creed RD',
        city: 'Honeyville',
        state: 'Utah',
        country: 'United States of America',
        lat: 22.23,
        lng: 23.34,
        name: 'Honeyville Home',
        description: 'Nice home in HoneyVille',
        price: 73
      }], {validate:true});

  },

  async down (queryInterface, Sequelize) {
     options.tableName='Spots';
     const Op=Sequelize.Op;

     return queryInterface.bulkDelete(options, {
      ownerId: {[Op.in]: [1,2,3]}
     },{})
  }
};
