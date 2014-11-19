'use strict';

// Load modules
var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    minify = require('gulp-minify-css'),
    prefix = require('gulp-autoprefixer'),
    order = require('gulp-order'),
    del = require('del'),
    chalk = require('chalk');

// Custom variables
var okMsg = chalk.green,
    normMsg = chalk.white,
    dataMsg = chalk.grey,
    errMsg = chalk.red,
    stdMsg = chalk.cyan,
    failMsg = chalk.bold.red,
    paths = {
        scripts: ['js/**/*.js', '!js/vendor/*.js'],
        styles: ['css/**/*.css', '!css/vendor/*.css']
    };

// clean prod
gulp.task('clean', function (callback) {
    del(['prod'], callback);
});

// JavaScript linter
gulp.task('lint', function () {
    return gulp.src('js/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(notify(function (file) {
            if (file.jshint.success) {
                console.log(
                    normMsg('Linting: '),
                    stdMsg('\'' + file.relative + '\''),
                    okMsg(' > lint OK')
                );
                return false;
            }

            console.log(
                normMsg('Linting: '),
                stdMsg('\'' + file.relative + '\''),
                failMsg(' > lint FAILED (' +
                file.jshint.results.length + ' errors)')
            );

            var errors = file.jshint.results.map(function (data) {
                if (data.error) {
                    return dataMsg('  line ' + data.error.line +
                        ' col ' + data.error.character) +
                        errMsg('\t=> ' + data.error.reason);
                }
            }).join('\n');

            console.log(errors + '\n');
            return 'JS BUILD FAILED';
        }))
        .pipe(jshint.reporter('fail'));
});

// Scripts lint, concatonate and uglify
gulp.task('scripts', ['lint'], function () {
    return gulp.src(paths.scripts)
        .pipe(concat('scripts.js'))
        .pipe(uglify())
        .pipe(gulp.dest('../prod/js'))
        .pipe(notify({ message: 'Scripts task complete' }));
});

// Sass compile
gulp.task('sass', function () {
    return gulp.src('sass/**/*.scss');
    // TODO: update
});

// CSS process Sass, concatonate, prefix and minfy
gulp.task('styles', function () {
    return gulp.src('css/**/*.css')
        .pipe(order([
                'vendor/*.css',
                'base.css',
                'grid.css'
            ]))
        .pipe(concat('styles.css'))
        .pipe(prefix({ browsers: ['last 3 versions'], cascade: true }))
        .pipe(minify())
        .pipe(gulp.dest('../prod/css'))
        .pipe(notify({ message: 'Styles task complete' }));
});

// Default runner of all tasks
gulp.task('default', ['clean'], function () {
    gulp.start('styles', 'scripts');
    gulp.watch(paths.styles, ['styles']);
    gulp.watch(paths.scripts, ['scripts']);
});

// Watch
gulp.task('watch', function () {
    gulp.watch('css/**/*.css', ['styles']);
    gulp.watch('js/**/*.js', ['scripts']);

});
