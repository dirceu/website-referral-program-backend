'use strict';
/*
 *  Route handler for Todos microservice
 */
const _ = require('lodash');
const express = require('express');
const Promise = require('bluebird');
const request = require('superagent-promise')(require('superagent'), Promise);
const winston = require('winston');
const referralProgram = require('../referral-program');

const referral = referralProgram.referral;
const bonus = referralProgram.bonus;

module.exports = () => {
  const route = express.Router();

  // Get all my referrals
  route.get('/my-referrals', getAllMyReferralsHandler);

  // Activate a bonus
  route.post('/my-referrals/:referralId/bonus/:bonusId/activate', activateBonusHandler);

  // Get all availabe bonus
  route.get('/bonus', getAllAvailableBonusHandler);

  // TEST! FAKE! This will be on another webtask. Bonus code or activation url generator
  route.post('/bonus-fake-activation/:type', (req, res) => {
    if (req.params.type === 'code') {
      return res.status(200).json({ data: '1SHIRTOFFF', error: false });
    }

    return res.status(200).json({
      data: 'https://manage.auth0.com/activate-500-extra-active-users',
      error: false
    });
  });

  return route;
};

/**
 * Get all my referrals
 */

function getAllMyReferralsHandler(req, res) {
  winston.debug('referral program', 'GET api/referral/my-referrals');

  const referrerUserId = req.user.id;
  const getReferrals = referral.getReferralsByReferrer(referrerUserId);
  const getBonus = bonus.getAll();

  Promise.all([getReferrals, getBonus])
    .spread((allReferrals, aBonus) => allReferrals.map(item => tidyReferralsItem(item, aBonus)))
    .then(allReferrals => res.status(200).json({ data: allReferrals, error: false }))
    .catch(err => {
      winston.error(err);
      return res.status(500).json({ data: 'Error getting the referrals.', error: true });
    });
}

function tidyReferralsItem(referralItem, allBonus) {
  const keysToRename = [['referralUserId', 'userId'], ['bonus', 'selectedBonus']];
  const cleanReferralItem = renameKeys(referralItem, keysToRename);
  const availableBonus = [];

  delete cleanReferralItem.referrerUserId;

  allBonus.forEach(bonusItem => {
    bonusItem.enabledByActions.forEach(enabledByAction => {
      if (enabledByAction === cleanReferralItem.action.description) {
        availableBonus.push(bonusItem.id);
      }
    });
  });
  cleanReferralItem.availableBonus = availableBonus.length ? _.uniq(availableBonus) : null;

  return cleanReferralItem;
}

/**
 * Activate a bonus
 */

function activateBonusHandler(req, res) {
  winston.debug(
    'referral program',
    'POST api/referral/my-referrals/:referralId/bonus/:bonusId/activate'
  );

  const referralId = req.params.referralId;
  const bonusId = req.params.bonusId;

  activateBonus(bonusId, referralId)
    .then(activatedBonus => res.status(200).json({ data: activatedBonus, error: false }))
    .catch(err => {
      winston.error(err);
      return res.status(500).json({ data: 'Error activating the bonus.', error: true });
    });
}

function activateBonus(bonusId, referralId) {
  return findBonus(bonusId)
    .then(_bonus => validateBonus(referralId, _bonus))
    .then(validBonus => invokeActivationUrl(validBonus, referralId))
    .then(selectedBonus => referral.updateReferralBonus(referralId, selectedBonus));
}

function findBonus(_bonusId) {
  return bonus.getAll()
    .then(allBonus => allBonus.filter(bonusItem => bonusItem.id === _bonusId)[0])
    .then(_bonus => {
      if (!_bonus) {
        return Promise.reject(`Bonus ${_bonusId} does not exist.`);
      }

      return _bonus;
    });
}

function validateBonus(referralId, _bonus) {
  return referral.get(referralId)
    .then(_referral => {
      if (_bonus.enabledByActions.indexOf(_referral.action.description) === -1) {
        return Promise.reject(`Can't enable bonus ${_bonus.id} for ${referralId}.`);
      }
      if (_referral.bonus.id !== null) {
        return Promise.reject(`${referralId} referral already has a bonus selected.`);
      }

      return _bonus;
    });
}

function invokeActivationUrl(validBonus, referralId) {
  return request.post(validBonus.activationUrl)
    .send({ userId: referralId })
    .then(response => {
      const selectedBonus = {
        id: validBonus.id,
        type: validBonus.type,
        activated: true,
        data: response.body.data
      };

      return selectedBonus;
    });
}

/**
 * Get all availabe bonus
 */

function getAllAvailableBonusHandler(req, res) {
  winston.debug('referral program', 'POST api/referral/bonus');

  bonus.getAll()
    .then(allBonus => res.status(200).json({ data: allBonus, error: false }))
    .catch(err => {
      winston.error(err);
      return res.status(500).json({ data: 'Error getting the bonus.', error: true });
    });
}

/**
 * Utils:
 */

/*
 * Rename a group of object keys.
 * @param {Object} object - Original object
 * @param {Array} renames - List of renames, e.g.: [['keyName', 'newKeyName'], ['house', 'home']]
 * @return {Object} newObject - New object with renamed keys
 */
function renameKeys(object, renames) {
  let newObject = object;
  renames.forEach(renamesItem => {
    newObject = renameKey(newObject, renamesItem[0], renamesItem[1]);
  });

  return newObject;
}

/*
 * Rename a key of an object.
 * @param {Object} object - Original object
 * @param {string} key - Key to rename
 * @param {string} newKeyName - New name of key
 * @return {Object} newObject - New object with renamed key
 */
function renameKey(object, key, newKeyName) {
  const newObject = _.assign({}, object);

  newObject[newKeyName] = newObject[key];
  delete newObject[key];

  return newObject;
}
