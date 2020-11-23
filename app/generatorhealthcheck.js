const health = require('@cloudnative/health');
var redisClient = require('./redis');
const logger = require('../config/applogger');

class GeneratorHealtchCheck {
    
    constructor(){
        this.healthcheck = new health.HealthChecker();


        const livePromise = () => new Promise(function (resolve, _reject) {
        setTimeout(function () {
            console.log('ALIVE!');
            resolve();
        }, 10);
        });
        //let liveCheck = new health.LivenessCheck("liveCheck", livePromise);
        //this.healthcheck.registerLivenessCheck(liveCheck);
        this.registerRedisCheck();

    }

    registerRedisCheck(){

        const livePromise = () => new Promise(function (resolve, reject) {

            let req = redisClient.ping().then((result) => {
                logger.debug("REDIS is alive");
                resolve();

            })
            .catch((error) => {
                logger.warn('Unable to connect to redis-instance ' + error.message);
                reject(new Error(`Failed to ping REDIS: ${error.message}`));
            });

        });

        let liveCheck = new health.LivenessCheck("redisLiveCheck", livePromise);
        this.healthcheck.registerLivenessCheck(liveCheck);

        let readyCheck = new health.ReadinessCheck("redisReadyCheck", livePromise);
        this.healthcheck.registerReadinessCheck(readyCheck);

    }

    getHealthCheck(){
        return this.healthcheck;
    }

}

module.exports = new GeneratorHealtchCheck();

