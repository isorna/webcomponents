import { writeFile, appendFile, appendFileSync, createWriteStream } from 'fs';
import { task, src, dest } from 'gulp';
import contains from './lib/gulp-contains.js';
// import contains from 'gulp-contains';
import nodemon from 'gulp-nodemon';
import del from 'del';
import { injectManifest } from 'workbox-build';
import { generateImages } from 'pwa-asset-generator';
import { mode, baseUrl } from './config/environment.js'

const MODE = `${mode}`;
const BASE_URL = `${baseUrl}`;
const ROOT_DIR = '.';
const SRC_DIR = 'src';
const CONFIG_DIR = 'src';
const IMAGES_DIR = 'images';
const DEST_DIR = 'build';// TODO: use 'dist'?

// Cleans the build directory.
task('clean-build', () => {
  return del(DEST_DIR);
});

// Generate PWA Icons
// Options
//     -b --background             Page background to use when image source is provided: css value  [default: transparent]
//     -o --opaque                 Making screenshots to be saved with a background color  [default: true]
//     -p --padding                Padding to use when image source provided: css value  [default: "10%"]
//     -s --scrape                 Scraping Apple Human Interface guidelines to fetch splash screen specs  [default: true]
//     -m --manifest               Web app manifest file path to automatically update manifest file with the generated icons
//     -i --index                  Index html file path to automatically put splash screen and icon meta tags in
//     -a --path                   Path prefix to prepend for href links generated for meta tags
//     -t --type                   Image type: png|jpeg  [default: png]
//     -q --quality                Image quality: 0...100 (Only for JPEG)  [default: 100]
//     -h --splash-only            Only generate splash screens  [default: false]
//     -c --icon-only              Only generate icons  [default: false]
//     -l --landscape-only         Only generate landscape splash screens  [default: false]
//     -r --portrait-only          Only generate portrait splash screens  [default: false]
//     -g --log                    Logs the steps of the library process  [default: true]
// More info at:
// https://itnext.io/pwa-splash-screen-and-icon-generator-a74ebb8a130
// https://www.npmjs.com/package/pwa-asset-generator
// TODO: REMEMBER TO ADD MSICON x144 after generating them all
// TODO: Create a configuration file!!!
task('pwa-icons', () => {
  return generateImages(
    './pwa/icon.nobg.svg',
    './images/manifest',
    {
      background: "#000028",
      manifest: './pwa/manifest.json',
      index: './pwa/index.html',
      path: BASE_URL
    });
});

// Look for TODO's
task('to-do-list', (cb) => {
  // use {flags: 'a'} to append and {flags: 'w'} to erase and write a new file
  var stream = createWriteStream(`${ROOT_DIR}/TODO.md`, { flags: 'w' });
  stream.write(`# TODO:`);
  src(`${SRC_DIR}/**/*.{js, css}`)
    .pipe(contains({
      search: new RegExp(/TODO: (.+)\r/g),
      onFound: function (string, file, cb) {
        stream.write(`
## ${file.basename}
* ${string.join(`
* `)}`, () => { console.log(`TODO found: ${file.basename}`) });
        return false;
      }
    }));
  cb();
});

// Builds the service-worker.js file.
// LINK: https://developers.google.com/web/tools/workbox/modules/workbox-build#full_injectmanifest_config
task('service-worker', () => {
  return injectManifest({
    swSrc: `${CONFIG_DIR}/service-worker.BLUEPRINT.js`,
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
task('pre-publish', () => {
  return src(`${SRC_DIR}/index.html`)
    // The leading * causes it to set the base at the cwd
    .pipe(src(`${SRC_DIR}/*css/**/*`))
    .pipe(src(`${SRC_DIR}/*lib/**/*`))
    .pipe(src(`${SRC_DIR}/*config/**/*`))
    .pipe(src(`${SRC_DIR}/*components/**/*`))
    .pipe(src(`${SRC_DIR}/manifest.json`))
    .pipe(src(`${SRC_DIR}/service-worker.js`))
    .pipe(src(`${SRC_DIR}/init.js`))
    .pipe(src(`./*${IMAGES_DIR}/**/*`))
    .pipe(dest(`${DEST_DIR}/`));
});

// TODO: Add Babel, etc
// LINK: https://www.npmjs.com/package/gulp-babel
// LINK: https://medium.com/@kamalyzl/instalando-preset-es6-a-es5-de-babel-con-gulp-f%C3%A1cil-y-r%C3%A1pido-771261b686a1
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
task('start', (done) => {
  var stream = nodemon({
    script: 'lib/local-serve.js',
    tasks: ['service-worker'],
    ext: 'js html json css',
    ignore: [
      'src/service-worker.js'
    ],
    env: { 'NODE_ENV': MODE },
    verbose: true,
    done: done
  });
  return stream;
});