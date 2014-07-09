'use strict';
module.exports.library = function (project, destination, dependentTasks, gulp) {
    if (!gulp) {
        gulp = require('gulp');
    }

    var taskName = project + '.library',

        bowerSrc = require('gulp-bower-src'),
        changed = require('gulp-changed'),
        clean = require('gulp-clean'),
        filter = require('gulp-filter'),
        rename = require('gulp-rename'),
        addsrc = require('gulp-add-src'),
        debug = require('gulp-debug'),

        file = {
            component: {
                JS: [
                    '**/*.js',
                    'dist/*.js',
                    '!**/*.min.js',
                    '!**/dist/*.min.js',
                    '!d3/**/*.js',
                    '!**/{test,min,bin,lang,lib,support,src,feature-detects}/**/*.js',
                    '!**/{grunt,Gruntfile,,GruntFile}.js'
                ],
                LESS: [
                    '**/*.{less,css}',
                    '**/css/*.css',
                    '!**/*.min.{less,css}',
                    '!**/css/*.min.css',
                    '!**/{support,src,test}/**/*.css',
                    '!font-awesome/{less,src}/**/*.{less,css}',
                    '!angular/*.css'
                ],
                font: '**/fonts/*.{eot,svg,ttf,woff,otf}'
            }
        },

        dir = {
            component: {
                JS: destination + '/lib',
                LESS: destination + '/less/lib',
                font: destination + '/less/fonts'
            }
        };
    
    gulp.task(taskName + '.clean', dependentTasks, function () {
        return gulp.src([
            dir.component.font,
            dir.component.LESS,
            dir.component.JS
        ]).pipe(clean());
    });

    gulp.task(taskName + '.copy.font', [taskName + '.clean'], function () {
        return bowerSrc()
            .pipe(filter(file.component.font))
            .pipe(changed(dir.component.font))
            .pipe(
                rename(function (path) {
                    path.dirname = '.';
                })
            )
            .pipe(gulp.dest(dir.component.font))
    });

    gulp.task(taskName + '.copy.LESS', [taskName + '.clean'], function () {
        return bowerSrc()
            .pipe(filter(file.component.LESS))
            .pipe(changed(dir.component.LESS))
            .pipe(
                rename(function (path) {
                    path.dirname = '.';
                    path.extname = '.less';
                })
            )
            .pipe(gulp.dest(dir.component.LESS));
    });
    
    gulp.task(taskName + '.copy.JS', [taskName + '.clean'], function () {
        return bowerSrc()
            .pipe(filter(file.component.JS))
            .pipe(changed(dir.component.JS))
            .pipe(
                rename(function (path) {
                    path.dirname = '.';
                })
            )
            .pipe(gulp.dest(dir.component.JS));
    });

    gulp.task(taskName + '.copy', [
        taskName + '.copy.font',
        taskName + '.copy.LESS',
        taskName + '.copy.JS'
    ]);

    gulp.task(taskName, [taskName + '.copy']);

    return taskName;
};
