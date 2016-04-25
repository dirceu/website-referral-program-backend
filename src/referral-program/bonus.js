const Promise = require('bluebird');
const getDb = require('../data');
const winston = require('winston');
const bonusModel = require('./bonusModel');
const utils = require('./utils');

const COLLECTION = 'referral_program_bonus';

const bonus = {
  /**
   * Get all bonus.
   */
  insert(params) {
    winston.debug('bonus.insert');
    const newBonus = bonusModel(params);

    return new Promise(resolve => {
      getDb(db => {
        db.collection(COLLECTION)
          .insert(newBonus);
        return resolve();
      });
    });
  },

  /**
   * Get all bonus.
   */
  getAll() {
    winston.debug('bonus.getAll');
    return new Promise((resolve, reject) => {
      getDb(db => {
        db.collection(COLLECTION)
          .find()
          .toArray((err, allBonus) => {
            if (err) return reject(err);

            return resolve(utils.removeMongoIdCollection(allBonus));
          });
      });
    });
  }
};

module.exports = bonus;
