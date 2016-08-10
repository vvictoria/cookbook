var gulp = require('gulp');
var sass = require('gulp-sass');
var minify = require('gulp-minify-css');
var uglify = require('gulp-uglify');

gulp.task('styles', function() {
    gulp.src('styles/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css/'));
});

gulp.task('watch',function() {
    gulp.watch('styles/*.scss', ['styles']);
});

gulp.task('default', ['styles', 'watch']);