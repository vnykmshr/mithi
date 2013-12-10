/**
 * Home controller
 */

var fs = require('fs');
var path = require('path');
var debug = require('debug')('home');

var onArticle = require('./article');
var onDirectory = require('./directory');

var ARTICLES_PATH = path.join(process.cwd(), 'articles');

var home = {
  index: function index(req, res, next) {
    res.locals.title = 'Home';
    res.render('index');
  },

  browse: function browse(req, res, next) {
    debug('serve: ' + req.url);
    req.reqpath = path.join(ARTICLES_PATH, req.url).replace(/.html/i, '.md');
    fs.exists(req.reqpath, function (exists) {
      if (exists) {
        var stats = fs.statSync(req.reqpath);
        var browse = stats.isFile() ? onArticle : onDirectory;
        browse(req, res, next);
      } else {
        next(new Error('file not found: ' + req.url));
      }
    });
  },

  errors: function (err, req, res, next) {
    console.log(err);
    res.send(404);
  }
};

module.exports = home;
