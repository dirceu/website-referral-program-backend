const _ = require('lodash');

const utils = {
  /**
   * Check if an object has multiple keys.
   * @param {object} object - Object to check
   * @param {array} requiredKeys - Array of key names
   */
  hasMultipleKeys(object, requiredKeys) {
    return _.every(requiredKeys, _.partial(_.has, object));
  },

  /**
   * Remove MongoDB _id field from all items of a collection.
   * @param {array} id - Collection to remove all _id fields of his items
   */
  removeMongoIdCollection(collection) {
    const cleanCollection = collection.map(utils.removeMongoIdItem);

    return cleanCollection;
  },

  /**
   * Remove MongoDB _id field of a object.
   * @param {object} item - Object to remove _id field
   */
  removeMongoIdItem(item) {
    const cleanItem = _.assign({}, item);
    delete cleanItem._id;

    return cleanItem;
  }
};

module.exports = utils;
