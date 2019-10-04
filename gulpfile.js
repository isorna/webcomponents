const fs = require('fs');
const gulp = require('gulp');
const contains = require('gulp-contains');
const nodemon = require('gulp-nodemon');
const del = require('del');
const workboxBuild = require('workbox-build');
const ROOT_DIR = '.';
const SRC_DIR = 'src';
const IMAGES_DIR = 'images';
const DEST_DIR = 'build';

// Cleans the build directory.
gulp.task('clean-build', () => {
  return del(DEST_DIR);
});

// Look for TODO's
gulp.task('todo-list', () => {
  return gulp.src(`${SRC_DIR}/**/*.{js, css}`)
    .pipe(contains({
      search: 'TODO:',
      onFound: function (string, file, cb) {
        fs.writeFile(`${ROOT_DIR}/TODO.md`, file.basename, cb);
      }
    }));
});

// Builds the service-worker.js file.
// CHECK THIS: https://developers.google.com/web/tools/workbox/modules/workbox-build#full_injectmanifest_config
gulp.task('service-worker', () => {
  return workboxBuild.injectManifest({
    swSrc: `${ROOT_DIR}/service-worker.js`,
    swDest: `${SRC_DIR}/service-worker.js`,
    globDirectory: SRC_DIR,
    // Files matching against any of these patterns will be included in the precache manifest.
    globPatterns: [
      '**\/*.{js,css,html,png,ico,svg}',
    ]
  }).then(({count, size, warnings}) => {
    // Optionally, log any warnings and details.
    // warnings.forEach(console.warn);
    console.log(`${count} files will be precached, totaling ${size} bytes.`);
  });
});

// Builds the project before deploying.
gulp.task('pre-publish', () => {
  return gulp.src(`${SRC_DIR}/index.html`)
    // The leading * causes it to set the base at the cwd
    .pipe(gulp.src(`${SRC_DIR}/*css/**/*`))
    .pipe(gulp.src(`${SRC_DIR}/*lib/**/*`))
    .pipe(gulp.src(`${SRC_DIR}/*config/**/*`))
    .pipe(gulp.src(`${SRC_DIR}/*components/**/*`))
    .pipe(gulp.src(`${SRC_DIR}/manifest.json`))
    .pipe(gulp.src(`${SRC_DIR}/service-worker.js`))
    .pipe(gulp.src(`${SRC_DIR}/init.js`))
    .pipe(gulp.src(`./*${IMAGES_DIR}/**/*`))
    .pipe(gulp.dest(`${DEST_DIR}/`));
});

// TODO: Add Babel, etc
// https://www.npmjs.com/package/gulp-babel
// https://medium.com/@kamalyzl/instalando-preset-es6-a-es5-de-babel-con-gulp-f%C3%A1cil-y-r%C3%A1pido-771261b686a1
// gulp.task('compile', gulp.series('service-worker'), () => {
//   return gulp.src(`${SRC_DIR}/**/*.js`)
//     .pipe(babel({
//       presets: ['@babel/env']
//     }))
//     // .pipe(concat('all.js'))
//     // .pipe(sourcemaps.write('.'))
//     .pipe(gulp.dest(DEST_DIR));
// });

// Starts the local server while watching changes through nodemon:
// https://github.com/JacksonGariety/gulp-nodemon
gulp.task('start', (done) => {
  var stream = nodemon({
    script: 'local-serve.js',
    tasks: ['service-worker'],
    ext: 'js html json css',
    ignore: [
      'src/service-worker.js'
    ],
    env: { 'NODE_ENV': 'development' },
    verbose: true,
    done: done
  });
  return stream;
});