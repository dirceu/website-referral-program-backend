/**
 * Bonus Model
 * @param {object} bonus - Bonus
 * @param {string} bonus.id - Bonus ID e.g. 'auth0-t-shirt'
 * @param {string} bonus.description - Bonus title e.g. 'Auth0 T-Shirt'
 * @param {string} bonus.type - Bonus type e.g. 'code', 'activate'
 * @param {array} bonus.enabledByActions - List of action that can enable the bonus e.g. ['Paid']
 * @param {string} bonus.activationUrl - URL to get bonus code or activation url
 */
function bonusModel(bonus) {
  if (!bonus.id) throw new Error('Missing bonus.id');
  if (!bonus.description) throw new Error('Missing bonus.description');
  if (!bonus.type) throw new Error('Missing bonus.type');
  if (!bonus.enabledByActions) throw new Error('Missing bonus.enabledByActions');
  if (!bonus.activationUrl) throw new Error('Missing bonus.activationUrl');

  return {
    id: bonus.id,
    description: bonus.description,
    type: bonus.type,
    enabledByActions: bonus.enabledByActions,
    activationUrl: bonus.activationUrl
  };
}

module.exports = bonusModel;
