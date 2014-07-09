'use strict';
module.exports.dev = function (project, dependentTasks, gulp) {
    if (!gulp) {
        gulp = require('gulp');
    }

    var env = 'dev',

        src = 'src',

        taskName = project + '.' + env,

        run = require('../gulptask/run').run().app,

        log = require('logger').createLogger(),

        clean = require('gulp-clean'),
        changed = require('gulp-changed'),
        debug = require('gulp-debug'),
        less = require('gulp-less'),
        recess = require('gulp-recess'),
        rename = require('gulp-rename'),
        util = require('gulp-util'),

        copy = {
            file: [
                './project/' + project + '/src/**/*.{js,eot,svg,ttf,woff,otf,html,png,jpg,gif,ico,json}'
            ],
            destination: './project/' + project + '/' + env,
            source: './project/' + project + '/' + src
        },

        compile = {
            LESS: {
                config: {
                    includePath: ['_*.less'],
                    root: './project/' + project + '/src/less',
                    strictPropertyOrder: false,
                    noOverqualifying: false,
                    zeroUnits: false,
                    noUniversalSelectors: false,
                    noIDs: false,
                    prefixWhitespace: false
                },
                file: [
                    './project/' + project + '/src/**/*.{less,css}',
                    '!./project/' + project + '/src/**/_*.{less,css}'
                ]
            }
        },

        watch = {
            file: [
                './project/' + project + '/src/**/*.{less,css,js,eot,svg,ttf,woff,otf,html,png,jpg,gif,ico,json}',
                '!./project/' + project + '/src/data/*.json',
                './project/' + project + '/src/data/resource.json',
                '!./project/' + project + '/src/lib/',
                '!./project/' + project + '/src/lib/**/*',
                '!./project/' + project + '/src/less/lib/',
                '!./project/' + project + '/src/less/lib/**/*'
            ]
        },

        fn = {
            copySrc: function () {
                return gulp.src(copy.file)
                    .pipe(changed(copy.destination))
                    .pipe(rename(function (path) {
                        path.dirname = path.dirname.replace('less', 'css');
                    }))
                    .pipe(gulp.dest(copy.destination));
            },
            compileLess: function () {
                return gulp.src(compile.LESS.file)
                    .pipe(changed(copy.destination))
                    .pipe(recess(compile.LESS.config).on('error', util.log))
                    .pipe(less())
                    .pipe(rename(function (path) {
                        path.dirname = path.dirname.replace('less', 'css');
                    }))
                    .pipe(gulp.dest(copy.destination));
            }
        };

    gulp.task(taskName + '.clean', dependentTasks, function () { // gulp [project].dev.clean
        return gulp.src(copy.destination).pipe(clean());
    });

    gulp.task(taskName + '.copy.src', [taskName + '.clean'], function () { // gulp [project].dev.copy.src
        return fn.copySrc();
    });

    gulp.task(taskName + '.compile.LESS', [taskName + '.clean'], function () { // gulp [project].dev.compile.LESS
        return fn.compileLess();
    });

    gulp.task(taskName + '.changed.src', function () { // gulp [project].dev.changed.src
        return fn.copySrc();
    });

    gulp.task(taskName + '.changed.LESS', function () { // gulp [project].dev.changed.LESS
        return fn.compileLess();
    });

    gulp.task(taskName + '.watch', function () {
        return gulp.watch(watch.file).on('change',function(event) {
            var isLESS = event.path.substr(event.path.length - 5, event.path.length) === '.less',
                isJS = event.path.substr(event.path.length - 3, event.path.length) === '.js',
                task = '';

            console.log('');
            log.info();
            console.log('file: ' + event.path + ' was ' + event.type);
            console.log('');

            if (isLESS) {
                task = taskName + '.changed.LESS';
            } else {
                task = taskName + '.changed.src';
            }
            gulp.start(task);
        });
    });

    run(project, env, [taskName + '.watch']);       // gulp [project].dev.run.app

    gulp.task(taskName + '.compile', [              // gulp [project].dev.compile
        taskName + '.copy.src',                     // gulp [project].dev.copy.src
        taskName + '.compile.LESS'                  // gulp [project].dev.compile.less
    ]);

	gulp.task(taskName + '.default', [              // gulp [project].dev.default
        taskName + '.compile'                		// gulp [project].dev.compile
    ],
	function () {
        return gulp.start(taskName + '.run.app');   // gulp [project].dev.run.app
    });

    gulp.task(taskName, [                           // gulp [project].dev
        taskName + '.default'                       // gulp [project].dev.default
    ]);
	
    return taskName + '.default';                   // return this for gulp default tasking
}
