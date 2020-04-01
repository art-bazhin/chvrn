const { src, dest, parallel, series, watch } = require('gulp');

const rimraf = require('rimraf');
const zipFolder = require('zip-a-folder');

const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const copy = require('gulp-copy');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

const easyImport = require('postcss-easy-import');
const autoprefixer = require('autoprefixer');
const precss = require('precss');
const cssnano = require('cssnano');

const resize = require('gulp-image-resize');
const sitemap = require('gulp-sitemap');

const SRC = './src/_includes/';
const ROOT = './src/_root/**/*'
const IMG = './src/img/';
const DIST = './dist/';

const COVER_WIDTH = 1200;
const THUMBNAIL_WIDTH = 600;

const BABEL_CONFIG = {
  presets: [
    ['@babel/env', 
      // {
      //   useBuiltIns: 'usage',
      //   corejs: 3
      // }
    ]
  ]
};

const clean = function(cb) {
  rimraf.sync(DIST);
  rimraf.sync('./dist.zip');
  cb();
};

const css = function() {
  return src(SRC + 'styles/main.pcss')
    .pipe(postcss([
      easyImport({ extensions: ['.css', '.pcss'] }), 
      precss, 
      autoprefixer, 
      cssnano
    ]))
    .pipe(rename('style.css'))
    .pipe(dest(DIST));
}

const jsDev = function() {
  return src(SRC + 'blocks/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('script.js'))
    .pipe(babel(BABEL_CONFIG))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(dest(DIST))
}

const js = function() {
  return src(SRC + 'blocks/**/*.js')
    .pipe(concat('script.js'))
    .pipe(babel(BABEL_CONFIG))
    .pipe(uglify())
    .pipe(dest(DIST))
}

const root = function() {
  return src(ROOT)
    .pipe(copy(DIST, {
      prefix: 2
    }));
}

const assets = function() {
  return src(SRC + 'assets/**/*')
    .pipe(copy(DIST, {
      prefix: 2
    }));
}

const covers = function() {
  return src(IMG + 'covers/**/*')
    .pipe(resize({
      width : COVER_WIDTH,
      height : COVER_WIDTH,
      quality: 0.7,
      format: 'jpg'
    }))
    .pipe(dest(DIST + 'img/covers/'));
}

const thumbnails = function() {
  return src(IMG + 'covers/**/*')
    .pipe(resize({
      width : THUMBNAIL_WIDTH,
      height : THUMBNAIL_WIDTH,
      quality: 0.7,
      format: 'jpg'
    }))
    .pipe(dest(DIST + 'img/thumbnails/'));
}

const images = parallel(covers, thumbnails);

const build = series(clean, parallel(css, js, assets, images, root));
const buildDev = series(clean, parallel(css, jsDev, assets, images, root));

const dev = function() {
  buildDev();
  watch([IMG + 'covers/**/*'], images);
  watch([SRC + 'assets/**/*'], assets);
  watch([SRC + '**/*.js'], jsDev);
  watch([SRC + '**/*.pcss', SRC + '**/*.css'], css);
};

const zip = function(cb) {
  zipFolder.zipFolder(DIST, './dist.zip', function(err) {
    if(err) {
      console.log('Failed to zip!', err);
    } else cb();
  });
}

const generateSitemap = function() {
  return src(DIST + '**/*.html', {
    read: false
  })
    .pipe(sitemap({
      siteUrl: 'http:/chvrn.link'
    }))
    .pipe(dest(DIST));
}

// const postprocess = series(generateSitemap, zip);

exports.default = build;
exports.dev = dev;
exports.postprocess = generateSitemap;

