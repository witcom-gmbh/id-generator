var seqConfig = require('../config/generatorconfig');

var settings = {
    host: seqConfig.redisConfig.hostname,
    port: seqConfig.redisConfig.port,
    password:seqConfig.redisConfig.password
};
var logger = console;
//var redis = require("redis");
const asyncRedis = require("async-redis");
var redisClient = asyncRedis.createClient(parseInt(settings.port), settings.host, {} );
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
        logger.error(msg, arguments);
    }
};

var url = 'redis://' + redisClient.address;
redisClient.on('connect'     , infolog('Redis is connecting to ' + url));
redisClient.on('ready'       , infolog('Redis is ready'));
redisClient.on('reconnecting', warnlog('Redis is reconnecting to ' + url));
redisClient.on('error'       , errorlog('Redis error happens'));
redisClient.on('end'         , infolog('Redis is ended'));

module.exports = redisClient;