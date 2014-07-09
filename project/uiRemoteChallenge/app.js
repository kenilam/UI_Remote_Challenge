var root = __dirname + '/../../',

    appName = 'UI Remote Challenge',
    port    =  '8081',
    debug   = false,
    logger  = require('logger').createLogger(),
    express = require('express'),
    http    = require('http'),

    app     = express(),
    server  = http.createServer(app),
    environment = process.env.NODE_ENV ? process.env.NODE_ENV : "dev";

if(!environment) {
    environment = "build"
}

/**** **** **** **** ****/
/* Express setting */
app.use(express.static(__dirname + '/' + environment));
app.use(function(req, res, next) {
    //Global handler
    return next();
});
app.settings.env = (environment === 'build') ? 'production' : 'development';
/**** **** **** **** ****/

server.listen(port, function(){
    console.log('');
    logger.info();
    console.log(appName, 'listening at port:', port);
    console.log(app.settings.env, 'environment');
});
/**** End of Script ****/

