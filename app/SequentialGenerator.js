var util = require('util');
var SequenceRegistry = require('./registry');
var SequenceObject = require('./sequence');

var _extend = function(obj, source) {
    for (var prop in source) {
        obj[prop] = source[prop];
    }
    return obj;
};

var SequenceGenerator, sg;
SequenceGenerator = sg = function(){
    this.initRegistry();
    this.setBuilder(SequenceObject);

};
util.inherits(SequenceGenerator, SequenceRegistry);

sg.prototype.useLogger = function(logger){
    this.logger = logger;
};

sg.prototype.useStore = function(store){
    this.store = store;
};

sg.prototype.useDefaults = function(defaults){
    this.defaults = _extend({}, {
        key: 'global',
        initialCursor: 1,
        padding: '0',
        maxValue: 99999999
    });
    _extend(this.defaults, defaults);
    this.getBuilder().defaults = this.defaults;
};

sg.prototype.configure = function(generatorConfig){
    this.useDefaults(generatorConfig.sequenceDefaults);
    this.putAll(generatorConfig.sequenceDefinition);
    this.generatorConfig = generatorConfig;
}

sg.prototype.generate = function(key,requestSize=1){
    var so = this.registry[key];
    
    if(so){
        return so.next(requestSize);
    }
    else{
        throw new Error('Process ' + process.pid + ': Sequence [' + key + '] is not registered');
    }
};


sg.prototype.init = function(callback){
    
    var sequences = [];
    var registry = this.registry;


    for(var key in registry){
        var so = registry[key];
        sequences.push(so);
    }
    
    callback(true);
    
}

module.exports = sg;
