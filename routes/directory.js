/**
 * Dir Browser
 */

var fs = require('fs');
var path = require('path');

var common = require('./common');

var excludeFiles = ['includes'];

module.exports = function directory(req, res, next) {
  fs.readdir(req.reqpath, function (err, files) {
    var results = [];
    files.forEach(function (file) {
      if (excludeFiles.indexOf(file) > -1) {
        return;
      }

      var filepath = path.join(req.reqpath, file);
      results.push({
        name: file.replace(/.md/i, ''),
        image: '/images/articles/thumbnail/' + common.image(file),
        link: path.join(req.url, common.link(file))
      });
    });

    res.locals.results = results;
    res.render('directory');
  });
};
