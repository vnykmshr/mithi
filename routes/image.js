/**
 * Image processor
 */

var fs = require('fs');
var mime = require('mime');
var util = require('util');
var path = require('path');
var magickwand = require('magickwand');

var thumbnail = {
  width: 200,
  height: 300,
  autocrop: true
};

var image = {
  thumbnail: function (req, res, next) {
    var file = req.params.image;
    var filepath = getImagePath(file);
    fs.exists(filepath, function (exists) {
      if (exists) {
        magickwand.thumbnail(filepath, thumbnail, function (err, data) {
          if (err || !data) {
            err = err || new Error('no data: ' + file);
          }
          req.imageData = data;
          next(err);
        });
      } else {
        next(new Error('file not found: ' + file));
      }
    });
  },

  render: function (req, res, next) {
    res.setHeader('Content-Type', mime.lookup(req.params.image));
    res.setHeader('Content-Length', req.imageData.length);
    res.end(req.imageData, 'binary');
  },

  errors: function(err, req, res, next) {
    console.log(err);
    res.send(404);
  }
};

function getImagePath(file) {
  return path.join(process.cwd(), 'public', 'images', 'articles', file);
}

module.exports = image;

/** Test Code --------------------------------------------------------------- */
if (require.main === module) {
  (function () {
    var req = {
      params: {
        image: 'test.png'
      }
    };
    var res = {};
    var next = console.log;
    image.thumbnail(req, res, next);
  })();
}
