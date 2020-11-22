const logger = require('../config/applogger');

var settings = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password:process.env.REDIS_PASSWORD
};


const asyncRedis = require("async-redis");
settings.port=1234;
var redisClient = asyncRedis.createClient(parseInt(settings.port), settings.host, {connect_timeout: 30000} );
redisClient.auth(settings.password);

var infolog = function (msg) {
    return function() {
        logger.info(msg, arguments);
    }
};
var warnlog = function (msg) {
    return function() {
        logger.warn(msg, arguments);
    }
};
var errorlog = function (msg) {
    return function() {
        //console.log(arguments[0]);
        const redisLogger = logger.child(arguments[0]);
        //const redisLogger = logger.child({ a: 'property' })
        redisLogger.error(msg);
        process.exit();
        
    }
};

var url = 'redis://' + redisClient.address;
redisClient.on('connect'     , infolog('Redis is connecting to ' + url));
redisClient.on('ready'       , infolog('Redis is ready'));
redisClient.on('reconnecting', warnlog('Redis is reconnecting to ' + url));
redisClient.on('error'       , errorlog('Redis error happens'));
redisClient.on('end'         , infolog('Redis is ended'));

module.exports = redisClient;