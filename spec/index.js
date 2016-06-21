/**
 * @module test
 */

const test = require('tape');
const glob = require('glob');
const path = require('path');

/*
 * @private
 * @function
 *
 * Wraps the tape functionality (no more .end() at the end =))
 *
 * @param {string} title - the title of the test.
 * @param {Function} callback - the actual test code.
 */
function executor (title, callback) {
  test(title, function (assert) {
    if (callback(assert) === void 0) {
      assert.end();
    }
  });
}

// get all spec files and parse them
glob('spec/**/*.js', { 'realpath': true, 'ignore': 'spec/index.js' }, function (err, files) {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  var suite;
  var library;
  var segments;

  files && files.forEach(function (filename) {
    suite = require(filename);
    if (suite && 'default' in suite) {
      suite = suite['default'];
      segments = path.basename(filename, '.js').split('@');
      library = path.relative(
        __dirname,
        path.join('lib',
          path.relative(
            __dirname,
            path.dirname(filename)
          ),
          segments.length === 1 ? segments[0] : segments[1]
        )
      );

      library = require(library);
      if (segments.length === 2) {
        suite(executor, library[segments[0]]);
      } else if (segments.length === 1 && 'default' in library) {
        suite(executor, library.default);
      } else {
        suite(executor, library);
      }
    }
  });
});
