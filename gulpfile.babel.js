import gulp from 'gulp';
import yaml from 'gulp-yaml';
import rename from 'gulp-rename';
import merge from 'gulp-merge-json';
import babel from 'gulp-babel';

gulp.task('status', function() {
  return gulp
    .src('./data/status/*.yml')
    .pipe(yaml({ space: 2 }))
    .pipe(rename(function (path) {
      // Rename <status>.yml to <status>/tree.json
      path.dirname += '/' + path.basename;
      path.basename = 'tree';
    }))
    .pipe(gulp.dest('./src/status/'));
});

gulp.task('taxes', function() {
  return gulp
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
});

gulp.task('babel', function () {
  return gulp
    .src('src/**/*.{js,json}')
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});


gulp.task('default', [ 'status', 'taxes', 'babel' ]);
