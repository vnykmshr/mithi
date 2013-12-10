/**
 * Common utils
 */

var common = {
  image: function (file) {
    return encodeURIComponent(file.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/.md/i, '') + '.png');
  },

  link: function (file) {
    return encodeURIComponent(file.toLowerCase().replace(/.md/i, '.html'));
  }
};

module.exports = common;
