/**
 * Referral Model
 * @param {object} referral - Refferal
 * @param {string} referral.id - User ID of referral
 * @param {string} referral.referrerUserId - User ID of referrer
 * @param {string} referral.action.date - ISO 8601 date (`new Date()`)
 * @param {string} referral.action.description - Action description e.g. 'Sign up'
 * @param {string} referral.bonus.id - Bonus ID
 * @param {string} referral.bonus.type - Bonus type
 * @param {boolean} referral.bonus.activated - Is bonus activated?
 * @param {string} referral.bonus.data - Bonus code or activation url
 */

function referralModel(referral) {
  if (!referral.id) throw new Error('Missing referral.id (user ID)');
  if (!referral.referrerUserId) throw new Error('Missing referral.referrerUserId');

  return {
    id: referral.id,
    referrerUserId: referral.referrerUserId,
    action: {
      date: referral.action && referral.action.date ? referral.action.date : new Date(),
      description: referral.action && referral.action.description ?
         referral.action.description
       :
         'Sign up'
    },
    bonus: {
      id: referral.bonus && referral.bonus.id ? referral.bonus.id : null,
      type: referral.bonus && referral.bonus.type ? referral.bonus.type : null,
      activated: referral.bonus && referral.bonus.activated ? referral.bonus.activated : false,
      data: referral.bonus && referral.bonus.data ? referral.bonus.data : null
    }
  };
}

module.exports = referralModel;
