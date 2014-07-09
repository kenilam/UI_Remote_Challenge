'use strict';
module.exports.build = function (project, dependentTasks, gulp) {
    if (!gulp) {
        gulp = require('gulp');
    }

    var env = 'build',

        dev = 'dev',

        taskName = project + '.' + env,

        run = require('../gulptask/run').run().app,

        addsrc = require('gulp-add-src'),
        clean = require('gulp-clean'),
        changed = require('gulp-changed'),
        concat = require('gulp-concat'),
        debug = require('gulp-debug'),
        filter = require('gulp-filter'),
        less = require('gulp-less'),
        miniHTML = require('gulp-minify-html'),
        miniCSS = require('gulp-minify-css'),
        miniJSON = require('gulp-jsonminify'),
        recess = require('gulp-recess'),
        rename = require('gulp-rename'),
        uglify = require('gulp-uglify'),
        usemin = require('gulp-usemin'),

        copy = {
            file: './project/' + project + '/src/**/*.{js,html}',
            destination: './project/' + project + '/' + dev,

            build: {
                file: './project/' + project + '/src/**/*.{eot,svg,ttf,woff,otf,png,jpg,gif,ico}',
                destination: './project/' + project + '/' + env
            }
        },

        compile = {
            LESS: {
                config: {
                    includePath: ['_import.less'],
                    root: './project/' + project + '/src/less',
                    strictPropertyOrder: false,
                    noOverqualifying: false,
                    zeroUnits: false,
                    noUniversalSelectors: false,
                    noIDs: false
                },
                file: [
                    './project/' + project + '/src/**/*.{less,css}',
                    '!./project/' + project + '/src/**/_*.{less,css}'
                ]
            },
            JSON: {
                file: './project/' + project + '/src/**/*.json'
            },
            HTML: {
                file: [
                    './project/' + project + '/src/**/*.html'
                ]
            }
        },

        bundlify = {
            config: {
                CSS: {
                    keepSpecialComments: 0,
                    benchmark: true,
                    processImport: true,
                    debug: false
                },
                JS: {
                    
                },
                HTML: {
                    empty: true,
                    comments: true,
                    conditionals: true,
                    spare: true,
                    quotes: true
                }
            },
            file: './project/' + project + '/' + dev + '/**/*.html'
        },

        fn = {
            copySrc: function (file, destination, environment) {
                return gulp.src(file)
                    .pipe(rename(function (path) {
                        if (environment === env) {
                            path.dirname = path.dirname.replace('less', '.');
                        } else {
                            path.dirname = path.dirname.replace('less', 'css');
                        }
                    }))
                    .pipe(gulp.dest(destination));
            },
            compileJSON: function () {
                return gulp.src(compile.JSON.file)
                    .pipe(miniJSON())
                    .pipe(gulp.dest(copy.build.destination));
            },
            compileLESS: function () {
                return gulp.src(compile.LESS.file)
                    .pipe(recess(compile.LESS.config))
                    .pipe(less())
                    .pipe(rename(function (path) {
                        path.dirname = path.dirname.replace('less', 'css');
                    }))
                    .pipe(gulp.dest(copy.destination));
            },
            bundlify: function () {
                return gulp.src(bundlify.file)
                    .pipe(usemin(
                        {
                            css: [
                                miniCSS(bundlify.config.CSS),
                                'concat'
                            ],
                            html: [
                                miniHTML(bundlify.config.HTML),
                                'concat'
                            ],
                            js: [
                                uglify(bundlify.config.JS),
                                'concat'
                            ]
                        }
                    ))
                    .pipe(gulp.dest(copy.build.destination));
            }
        };

    gulp.task(taskName + '.clean', dependentTasks, function () { // gulp [project].build.clean
        return gulp.src(copy.destination)
            .pipe(addsrc(copy.build.destination))
            .pipe(clean());
    });

    gulp.task(taskName + '.copy.src', [taskName + '.clean'], function () { // gulp [project].build.copy.src
        return fn.copySrc(copy.file, copy.destination);
    });

    gulp.task(taskName + '.build.src', [taskName + '.copy.src'], function () { // gulp [project].build.build.src
        return fn.copySrc(copy.build.file, copy.build.destination, env);
    });

    gulp.task(taskName + '.compile.JSON', [taskName + '.clean'], function () { // gulp [project].build.compile.LESS
        return fn.compileJSON();
    });

    gulp.task(taskName + '.compile.LESS', [taskName + '.clean'], function () { // gulp [project].build.compile.LESS
        return fn.compileLESS();
    });

    gulp.task(taskName + '.bundlify', [taskName + '.build.src', taskName + '.compile.JSON', taskName + '.compile.LESS'], function () {
        return fn.bundlify();
    });

    run(project, env);                              // gulp [project].build.run.app

    gulp.task(taskName + '.default', [              // gulp [project].build.default
        taskName + '.bundlify'                      // gulp [project].build.bundlify
    ], function () {
        return gulp.start(taskName + '.run.app');   // gulp [project].build.run.app
    });

    gulp.task(taskName, [                           // gulp [project].build
        taskName + '.default'                       // gulp [project].build.default
    ]);

    return taskName + '.default';                   // return this for gulp default tasking
}
