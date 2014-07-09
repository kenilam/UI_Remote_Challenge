'use strict';
module.exports.src = function (project, dependentTasks, gulp) {
    if (!gulp) {
        gulp = require('gulp');
    }
    
    var taskName = project + '.src',

        clean = require('gulp-clean'),

        root = './project/' + project,
        src = root + '/src',
        dev =  root + '/dev',
        build =  root + '/build';


    var libTasks = require('../gulptask/library').library(project, root + '/src', dependentTasks); // gulp [project].library
    gulp.task(taskName, [
        libTasks
    ], function () {
        return gulp.src([dev, build]).pipe(clean());
    });

    gulp.task(taskName + '.noclean', [
        libTasks
    ]);

    return taskName;
};
