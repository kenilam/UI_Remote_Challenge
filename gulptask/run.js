'use strict';
module.exports.run = function () {
    return {
        app : function (project, environment, dependentTasks, gulp) {
            if (!gulp) {
                gulp = require('gulp');
            }

            var taskName = project + '.' + environment + '.run.app',
                log = require('logger').createLogger();

            gulp.task(taskName, dependentTasks, function () {

                var nodemon = require('gulp-nodemon'),
                    config = {
                        //WARNING: The nodemon CWD flag being set to a different subdirectory appears to
                        //interfere with gulp-watch and/or gulp-changed libs, causing the watch tasks to not
                        //detect changed files while Nodemon is running
                        //cwd: './project/' + project + '/',
                        script:'./project/' + project + '/' + 'app.js',
                        env: (
                            function (env) {
                                var returnVal = env;
                                returnVal.NODE_ENV = environment;
                                return returnVal;
                            }
                        )(process.env),
                        ext: 'js json',
                        verbose: false,
                        execMap: {
                            //js: 'node --harmony --nouse_idle_notification --max_new_space_size=2048000 --max_old_space_size=8192 -max_executable_size=8192'
                            js: 'node --harmony'
                        },
                        watch: [
                            'project/' + project + '/app.js'
                        ],
                        ignore: [
                            '/node_modules/*',
                            '/bower_components/*',
                            '/gulptask/*',
                            '.git',
                            '.idea',
                            'project/**/build/*',
                            'project/**/dev/*',
                            'project/**/src/*'
                        ]
                    };

                nodemon(config)
                    .on('start', function () {
                        console.log('');
                        console.log('=== ==== ==== ==== ');
                        log.info();
                        console.log(project + ' is ready in ' + environment + ' mode');
                        console.log('Watching changes ...');
                        console.log('Hit ctrl + c to cancel');
                        console.log('=== ==== ==== ==== ');
                        console.log('');
                    })
                    .on('restart', function(files){
                        console.log("Nodemon Watched Files Changed: " + files);
                    });
            });

            return taskName;
        }
    }
}