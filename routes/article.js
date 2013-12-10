/**
 * Process articles
 */
var fs = require('fs');
var markdown = require('./lib/markdown');
var common = require('./common');

module.exports = function article(req, res, next) {
  fs.readFile(req.reqpath, 'utf8', function (err, data) {
    var filename = req.url.substring(1);
    var article = processArticle(data);
    article.filename = req.reqpath;
    article.name = filename.replace(/\.html/gi, '');
    article.image = '/images/articles/' + common.image(article.name);

    res.locals.article = article;
    res.render('article');
  });
};

var delimiter = '\n\n';

function processArticle(data) {
  var article = {};

  var split = data.indexOf(delimiter);
  var headers = data.substring(0, split).split('\n');

  // parse headers
  article.headers = headers;
  headers.forEach(function (h) {
    var split = h.indexOf(':');
    var name = h.substring(0, split);
    if (h[split + 1] === ' ') split++;
    var val = h.substring(split + 1);
    article[name.toLowerCase()] = val;
  });

  // parse date
  article.date = article.date ? new Date(article.date) : null;

  // process the markdown into html
  article.html = markdown(data.substring(split + delimiter.length));

  // the first paragraph as description
  article.desc = article.description || article.html.substring(0, article.html.indexOf('</p>'));

  if (article.tags) {
    article.tags = article.tags.split(',').map(function (s) {
      return s.trim();
    });
  } else {
    article.tags = [];
  }

  if (article.categories) {
    article.categories = article.categories.split(',').map(function (c) {
      return c.trim();
    });
  } else {
    article.categories = [];
  }

  return article;
}
