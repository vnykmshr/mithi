/**
 * Main route controller
 */

var home = require('./home');
var image = require('./image');

module.exports = function(app) {
  app.get('/images/articles/thumbnail/:image', image.thumbnail, image.render, image.errors);
  app.get('*', home.browse, home.errors);
};
