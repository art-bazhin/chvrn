const MarkdownIt = require('markdown-it');
const Intl = require('intl');
const formatter = new Intl.NumberFormat('ru');
const markdown = new MarkdownIt({
  html: true
});

module.exports = {
  markdown:  text => markdown.render(text),
  formatNumber: num => formatter.format(num)
};