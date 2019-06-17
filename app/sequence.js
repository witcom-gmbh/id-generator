var _extend = function(obj, source) {
    for (var prop in source) {
        obj[prop] = source[prop];
    }
    return obj;
};

/**
 *  SequenceObject
 */
var SequenceObject, so;
SequenceObject = so = function(o){
    this.registry = o.registry;
    this.config = o.config;
    this.store = this.registry.store;
    this.logger = this.registry.logger;

    this.state = {};
    this.state.key = this.config.key;
    this.state.maxValue = this.config.maxValue;
    this.state.padding = this.config.padding;
    this.state.initialCursor = this.config.initialCursor;

};

so.build = function(o){
    var config = _extend({}, so.defaults);
    o.config = _extend(config, o.config);
    
    return new so(o);
};

so.prototype.setval = function(newVal){
    
    return this.store.setval(this.state, newVal)
    .then((res) => {
        if(res.successful){
            return {successful: true,val:res.value};
        } else {
            return Promise.reject({successful: false});
        }
    }
    );
}


so.prototype.next = function(requestSize){
    var state = this.state;
    return this.store.increment(this.state,requestSize)
    .then((res) => {
        if(res.successful){
            let nextVal = res.value;
            if (typeof nextVal == 'number'){
                if (nextVal>state.maxValue){
                    return Promise.reject({successful: false,errMsg:"Next-Val [" + nextVal + "] from Sequence [" + state.key + "] is owerflowing - max number allowed is ["+state.maxValue+"]"});
                }
                //Create an list of sequence numbers. New "End-number" is known, so is the number of requested numbers.
                //So it is easy to calculate the sequences that were generated
                let seqList = [];
                for (i=nextVal-requestSize+1;i<=nextVal;i++){
                    let nextId = i.toString();
                    let nextIdPadded = nextId.padStart(state.maxValue.toString().length, state.padding);
                    seqList.push(nextIdPadded);
                }
                //var nextId = res.value.toString();
                //var nextIdPadded = prefix + nextId.padStart(state.maxValue.toString().length, state.padding);
                return {successful: true,seqList:seqList};
            }
            return Promise.reject({successful: false,errMsg:'Next-Val [' + nextVal + '] from Sequence [' + state.key + '] is not a number'});
        }
        else 
        {
            return Promise.reject({successful: false});
        }
    });
};

module.exports = so;
