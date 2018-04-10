import gulp from 'gulp';
import yaml from 'gulp-yaml';
import rename from 'gulp-rename';
import merge from 'gulp-merge-json';
import babel from 'gulp-babel';
import copy from 'gulp-copy';

gulp.task('generation', function() {

  const status = gulp
    .src('./data/status/*.yml')
    .pipe(yaml({ space: 2 }))
    .pipe(rename(function (path) {
      // Rename <status>.yml to <status>/tree.json
      path.dirname += '/' + path.basename;
      path.basename = 'tree';
    }))
    .pipe(gulp.dest('./src/status/'));

  const taxes = gulp
    .src('./data/taxes/*.yml')
    .pipe(yaml({ space: 2 }))
    .pipe(merge({
      fileName: 'taxes.json',
      edit: function(json) {
        // Exclude special keys form the output (__defs__)
        ['__defs__'].forEach(exclude => json[exclude] = undefined);
        return json;
      }
    }))
    .pipe(gulp.dest('./src/taxes/'));

  return [ status, taxes ];
});

gulp.task('compilation', [ 'generation' ], function () {
  const es6 = gulp
    .src('src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('dist'));

  const json = gulp
    .src('src/**/*.json')
    .pipe(gulp.dest('dist'));

  return [ es6, json ];
});


gulp.task('default', [ 'generation', 'compilation' ]);
