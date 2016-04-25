const _ = require('lodash');
const Promise = require('bluebird');
const getDb = require('../data');
const winston = require('winston');
const referralModel = require('./referralModel');
const utils = require('./utils');
const bonus = require('./bonus');

const COLLECTION = 'referral_program_referral';

const referrals = {
  /**
   * Get one referral.
   * @param {string} id - Referral user ID
   */
  get(id) {
    winston.debug('referral.get');
    return new Promise((resolve, reject) => {
      getDb(db => {
        db.collection(COLLECTION)
          .find({ id })
          .toArray((err, referral) => {
            if (err) return reject(err);
            if (!referral.length) {
              const error = new Error('No results.');
              winston.error(error);
              return reject(error);
            }

            return resolve(utils.removeMongoIdCollection(referral)[0]);
          });
      });
    });
  },

  /**
   * Add a new Referral.
   */
  insert(params) {
    winston.debug('referral.insert');
    const newReferral = referralModel(params);

    return new Promise(resolve => {
      getDb(db => {
        db.collection(COLLECTION)
          .insert(newReferral);
        return resolve();
      });
    });
  },

  /**
   * Get all referrals by a referrer.
   * @param {string} referrerUserId - Referrer user ID
   */
  getReferralsByReferrer(referrerUserId) {
    winston.debug('referral.getReferralsByReferrer');
    return new Promise((resolve, reject) => {
      getDb(db => {
        db.collection(COLLECTION)
          .find({ referrerUserId })
          .toArray((err, allReferrals) => {
            if (err) return reject(err);
            if (!allReferrals.length) {
              const error = new Error('No results.');
              winston.error(error);
              return reject(error);
            }

            return resolve(utils.removeMongoIdCollection(allReferrals));
          });
      });
    });
  },

  /**
   * Update refferal bonus.
   * @param {string} id - Referral user ID
   */
  updateReferralBonus(id, selectedBonus) {
    winston.debug('referral.updateReferralBonus');
    return new Promise((resolve, reject) => {
      if (!utils.hasMultipleKeys(selectedBonus, ['id', 'type', 'activated', 'data'])) {
        const error = new Error('Missing `id`, `type`, `activated` or/and `data` properties in ' +
          `bonus param: ${JSON.stringify(bonus)}`);
        winston.error(error);
        return reject(error);
      }

      const cleanBonus = _.pick(selectedBonus, ['id', 'type', 'activated', 'data']);

      return bonus.getAll()
        .then(allBonus => {
          const validBonus = !!_.find(allBonus, { id: selectedBonus.id });
          if (!validBonus) {
            const error = new Error(`Wrong \`selectedBonus.id\`: ${selectedBonus.id}.`);
            winston.error(error);
            return reject(error);
          }

          return getDb(db => {
            db.collection(COLLECTION)
              .update({ id }, { $set: { bonus: selectedBonus } });
            return resolve(cleanBonus);
          });
        })
        .catch(reject);
    });
  },

  /**
   * Update Refferal action.
   */
  updateReferralAction(referralUserId, action) {
    winston.debug('referral.updateReferralAction');
    return new Promise((resolve, reject) => {
      if (!referralUserId) {
        const error = new Error('Missing referralUserId param.');
        winston.error(error);
        return reject(error);
      }
      if (!utils.hasMultipleKeys(action, ['date', 'description'])) {
        const error = new Error('Missing `date` or/and `description` properties in action param.');
        winston.error(error);
        return reject(error);
      }

      const cleanAction = _.pick(action, ['date', 'description']);
      return getDb(db => {
        db.collection(COLLECTION)
          .update({ referralUserId }, { $set: { action: cleanAction } });
        return resolve();
      });
    });
  }
};

module.exports = referrals;
