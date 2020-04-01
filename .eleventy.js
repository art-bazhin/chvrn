const cacheBuster = require('@mightyplow/eleventy-plugin-cache-buster');
const Typograf = require('typograf');
const typograf = new Typograf({locale: ['en-US']});

typograf.addSafeTag('<no-typography>', '</no-typography>');
typograf.addSafeTag('<title>', '</title>');

module.exports = function(eleventyConfig) {
  const cacheBusterOptions = {
    outputDirectory: 'dist'
  };

  eleventyConfig.addTransform('typograf', function(input) {
    return typograf.execute(input);
  })

  eleventyConfig.addPlugin(cacheBuster(cacheBusterOptions));

  eleventyConfig.addCollection('releases', function(collection) {
    return collection.getAllSorted()
      .filter(el => el.data.release)
      .sort((a, b) => (new Date(a.data.releaseDate).valueOf() - new Date(b.data.releaseDate).valueOf()));
  });

  return {
    dir: {
      output: 'dist',
      input: 'src',
      layouts: '_includes/layouts'
    }
  }
}