//"use strict";
var SequentialGenerator = require('./SequentialGenerator');
var redisClient = require('./redis');
//var seqConfig = require('../config/generatorconfig');
var idGeneratorConfig = require('../config/generatorconfig');
var SequentialStore = require('./SequentialStore');
//const logger = require('pino')()
const logger = require('../config/applogger');

class GeneratorService {
    
    constructor(){
        
        var idStore = new SequentialStore({
            keyPrefix: 'sequential:id:',
            redis: redisClient,
            logger: logger
        });
        this.initialized=false;
        this.seqStore = idStore;
        this.myGenerator = new SequentialGenerator();
        this.myGenerator.useLogger(logger);
        this.myGenerator.useStore(idStore);

        this.seqConfig = idGeneratorConfig.getConfig();
        
        this.myGenerator.configure(this.seqConfig);
        
        this.myGenerator.init((result) => {
            if(!result){
                throw new Error('generator is not ready');
            }
            //alle sequenzen initialisieren
            logger.info("Sequence-Generator has been initialized");
            this.initialized=true;
            
        });
        
    }

    configReload(){

        try{
            idGeneratorConfig.loadConfig();
            this.seqConfig = idGeneratorConfig.getConfig();
            //this.seqConfig = idGeneratorConfig.getConfig();
            this.myGenerator.configure(this.seqConfig);
            return Promise.resolve({successful: true});
        }catch(e){
            logger.error(e);
            return Promise.reject({successful: false,errMsg:'Unable to reload the config'});
        }

    }

    getSequenceValues(){

        if (!this.initialized){
            logger.error("Sequence-Generator has not been initialized");
            return Promise.reject({successful: false,errMsg:'Generator has not been initialized'});
        }

        return this.seqStore.getvalues(this.seqConfig.sequenceDefinition);

    }

    getSequenceVal(sequenceKey){
        
        if (!this.initialized){
            logger.error("Sequence-Generator has not been initialized");
            return Promise.reject({successful: false,errMsg:'Generator has not been initialized'});
        }
        
        //console.info(this.myGenerator.registry);
        let state = {key:sequenceKey};
        var so = this.myGenerator.registry[sequenceKey];
        if (!so){
            return Promise.reject({'successful':false,"errmsg":'Process ' + process.pid + ': Sequence [' + sequenceKey + '] is not registered'});
        }
        return this.seqStore.getval(state).then(function(res) {
            return res;
        })
        .catch((error) => {
            return Promise.reject({'successful':false,"errmsg":"Failed to get next-seq value"});
        });
    }

    setSequenceValues(request){

        if (!this.initialized){
            logger.error("Sequence-Generator has not been initialized");
            return Promise.reject({successful: false,errMsg:'Generator has not been initialized'});
        }
        
        return this.seqStore.setvalues(request).then(data => {
            return this.seqStore.getvalues(this.seqConfig.sequenceDefinition);
        });
    }
    
    setSequenceVal(request){
        
        if (!this.initialized){
            logger.error("Sequence-Generator has not been initialized");
            return Promise.reject({successful: false,errMsg:'Generator has not been initialized'});
        }
        
        if (!Number.isInteger(request.newVal)){
            return Promise.reject({successful: false,errMsg:'Request newVal ' + request.newVal + ' is not a number'});
        }
        if (request.newVal<=0){
            return Promise.reject({successful: false,errMsg:'Request newVal ' + request.newVal + ' is not a positive number'});
        }
        
        return this.getSequenceVal(request.sequenceKey).
        then((res) => {
            let oldvalue = res.value;
            if (request.newVal < oldvalue){
                logger.error("New value is smaller than current sequence-value");
                return Promise.reject({'successful':false,"errmsg":"New value is smaller than current sequence-value"});
            }
            
            return this.myGenerator.setSequenceValue(request.sequenceKey,request.newVal).then(function(res) {
                return {'successful':true,"val":res.val};
            })
            .catch((error) => {
                return Promise.reject({'successful':false,"errmsg":error.errmsg});
            });
        });
        
                
    }
    
    generate(request){
        if (!this.initialized){
            logger.error("Sequence-Generator has not been initialized");
            return Promise.reject({successful: false,errMsg:'Generator has not been initialized'});
            
        }
        
        //Sanity checks
        let serviceType = this.myGenerator.generatorConfig.serviceType.find(st => st.id === request.serviceType);
        if (!serviceType){
            //throw new Error('Process ' + process.pid + ': No configuration found for service-type [' + key + ']');
            return Promise.reject({successful: false,errMsg:'Requested ServiceType ' + request.serviceType + ' is unknown'});
        }
        if (!serviceType.sequenceKey){
            return Promise.reject({successful: false,errMsg:'Requested ServiceType ' + request.serviceType + ' is not mapped to a sequence-key'});
        }
        
        if (!Number.isInteger(request.count)){
            return Promise.reject({successful: false,errMsg:'Requestcount ' + request.count + ' is not a number'});
        }
        if (request.count<=0){
            return Promise.reject({successful: false,errMsg:'Requestcount ' + request.count + ' is not a positive number'});
        }
        
        //Build Prefix from Template
        let prefix = serviceType.prefixTemplate;
        //Replace Variables
        if (request.serviceOwner){
            //check if definition exists
            if (!this.myGenerator.generatorConfig.serviceOwner.find(so => so.id === request.serviceOwner)){
                return Promise.reject({successful: false,errMsg:'Requested ServiceOwner ' + request.serviceOwner + ' is unknown'});
            }
            prefix=prefix.replace('##OWNER##',request.serviceOwner);
        }
        if (request.md){
            //check if definition exists
            if (!this.myGenerator.generatorConfig.managementDomain.find(so => so.id === request.md)){
                return Promise.reject({successful: false,errMsg:'Requested Management-Domain ' + request.md + ' is unknown'});
            }
            prefix=prefix.replace('##MD##',request.md);
        }
        
        return this.myGenerator.generate(serviceType.sequenceKey,request.count).then(function(res) {
            let serviceIdList=[];
            
            for (let seq of res.seqList) {
                serviceIdList.push(prefix.replace('##SEQ##',seq));
            }
            return {'successful':true,"serviceIds":serviceIdList};
        });
        
    }
    
    
    
    
    
}

module.exports = new GeneratorService();