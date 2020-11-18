//var async = require("async");

var SequentialStore = function(o){
    this.logger = o.logger;
    this.redis = o.redis;
    this.keyPrefix = o.keyPrefix;
};

SequentialStore.prototype.getvalues = async function(sequenceList){
    var logger = this.logger;
    return Promise.all(sequenceList.map(item => this.getvalwithkeyname(item))).then(function(val) {
            
            return val;
    });

}

SequentialStore.prototype.setvalues = async function(sequenceList){
    var logger = this.logger;

    return Promise.all(sequenceList.map(item => this.setval(item.state,item.val))).then(function(val) {
            //console.log(val);
            return val;
    });

}


SequentialStore.prototype.getvalwithkeyname = function(state){
    
    var redis = this.redis;
    var logger = this.logger;
    var redisKey = this.keyPrefix + state.key;
    
    return redis.get(redisKey).then((oldValue) => {
        return {
                        successful: true,
                        value: oldValue,
                        key:state.key
                };
    })
    .catch((error) => {
        logger.error('Process ' + process.pid + ': Fail to get next sequence value: ' + error.message);
        return {
                        successful: false
            };
    });

}


SequentialStore.prototype.getval = function(state){
    
    var redis = this.redis;
    var logger = this.logger;
    var redisKey = this.keyPrefix + state.key;
    
    return redis.get(redisKey).then((oldValue) => {
        return {
                        successful: true,
                        value: oldValue
                };
    })
    .catch((error) => {
        logger.error('Process ' + process.pid + ': Fail to get next sequence value: ' + error.message);
        return {
                        successful: false
            };
    });

}

SequentialStore.prototype.setval = function(state,newVal){
    
    var redis = this.redis;
    var logger = this.logger;
    var redisKey = this.keyPrefix + state.key;
    
    
    
    return redis.set(redisKey, newVal)
    .then((result) => {
                return {
                        successful: true,
                        value: newVal
                };
    })
    .catch((error) => {
            logger.warn('Process ' + process.pid + ': Fail to set sequence value: ' + error.message);
            return {
                        successful: false
                };
    });
}


SequentialStore.prototype.increment = function(state,requestSize){
    
    var redis = this.redis;
    var logger = this.logger;
    var redisKey = this.keyPrefix + state.key;
    return redis.get(redisKey).then((oldValue) => {
        var newValue = null;
        //multi is not workin asynchronous, so do 2 operations
        var multi = redis.multi();
        if(!oldValue){
            newValue = state.initialCursor + requestSize-1;
            return redis.set(redisKey, newValue).then((result) => {
                return {
                        successful: true,
                        value: newValue
                };
            })
            .catch((error) => {
                logger.warn('Process ' + process.pid + ': Fail to get initial sequence value: ' + error.message);
                return {
                        successful: false
                };
            });
        } else {
            return redis.incrby(redisKey,requestSize).then((result) => {
                newValue = result=='OK' ? newValue : result;
                return {
                        successful: true,
                        value: newValue
                };
            })
            .catch((error) => {
                logger.warn('Process ' + process.pid + ': Fail to  get next sequence value: ' + error.message);
                return {
                        successful: false
                };
            });
        }
        /*
        //Not working asyncronously 
        multi.exec().then((result) => {
            
            logger.info(result);
            newValue = result=='OK' ? newValue : result;
            logger.info(newValue);
            return {
                        successful: true,
                        value: newValue
            };
            
        })
        .catch((error) => {
            logger.warn('Process ' + process.pid + ': Fail to  get next sequence value: ' + error.message);
            return {
                        successful: false
            };
        });*/
    })
    .catch((error) => {
        logger.error('Process ' + process.pid + ': Fail to  get next sequence value: ' + error.message);
        return {
                        successful: false
            };
    });
}

module.exports = SequentialStore;
