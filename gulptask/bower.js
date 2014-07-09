'use strict';
module.exports.bower = function (gulp) {
    if (!gulp) {
        gulp = require('gulp');
    }

    var taskName = 'bower',

        bower = require('gulp-bower'),
        clean = require('gulp-clean'),
        bowerSrc = require('gulp-bower-src');

    gulp.task('bower.clean', function () {
        return function () {
            try {
                return bowerSrc().pipe(clean());
            } catch (e) {
                return true;
            }
        }
    });

    gulp.task('bower.get', ['bower.clean'], function () {
        return bower();
    });

    gulp.task('bower', ['bower.clean', 'bower.get']);

    return 'bower';
}