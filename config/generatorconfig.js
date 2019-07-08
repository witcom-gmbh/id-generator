require('dotenv').config(); // this loads the defined variables from .env


const idGeneratorConfig = {
    sequenceDefaults : {
        initialCursor: 1, //default start number for a new sequence
        padding: '0',   //default segment width which a sequence apply once
        maxValue: 99999999,    //default prebook point when a sequence start to apply a segment in advance
    },
    sequenceDefinition : [{
        key: 'LINK', //the sequence's name which is store in redis.
        
    },
    {
        key: 'NNI', //the sequence's name which is store in redis.
        
    },
    {
        key: 'PATH', //the sequence's name which is store in redis.
        
    },
    {
        key: 'CIRCUIT', //the sequence's name which is store in redis.
        
    },
    {
        key: 'IS', //the sequence's name which is store in redis.
        
    },
    {
        key: 'SERVICE', //the sequence's name which is store in redis.
        
    },
    {
        key: 'LL', //the sequence's name which is store in redis.
        
    }                
    ],
    redisConfig: {
        hostname:process.env.REDIS_HOST,
        port:process.env.REDIS_PORT,
        password:process.env.REDIS_PASSWORD
    },
    managementDomain:[
    {
        name:'blueplanet MCP',
        id:'A'
    },
    {
        name:'Übergreifend',
        id:'Z'
    },
    {
        name:'EdgeGenie',
        id:'B'
    },
    {
        name:'Adva FSP-NM',
        id:'C'
    },
    {
        name:'Unspezifiziert',
        id:'Y'
    }
    ],
    serviceOwner:[
    {
        name : 'WiTCOM',
        id: 'WIT'
    },
    {
        name : 'Colt',
        id: 'CLT'
    },
    {
        name : 'Verizon',
        id: 'VRZ'
    },
    {
        name : 'Versatel',
        id: 'VER'
    },
    {
        name : 'Vistec',
        id: 'VIS'
    },
    {
        name : 'ESWE Versorgung',
        id: 'ESW'
    }
    ],
    serviceType: [
    {
        name: 'Leased-Line',
        id: 'LL',
        sequenceKey: 'LL',
        type: 'IS-LL',
        prefixTemplate: '##OWNER##-0Y##SEQ##'
    },
    {
        name: 'Telco Link',
        id: 'LINK',
        sequenceKey: 'LINK',
        type: 'IS-TELCO',
        prefixTemplate: '##OWNER##-1##MD####SEQ##'
    },
    {
        name: 'Telco NNI',
        id: 'NNI',
        sequenceKey: 'NNI',
        type: 'IS-TELCO',
        prefixTemplate: '##OWNER##-2Z##SEQ##'
    },
    {
        name: 'Telco Path',
        id: 'PATH',
        sequenceKey: 'PATH',
        type: 'IS-TELCO',
        prefixTemplate: '##OWNER##-4##MD####SEQ##'
    },
    {
        name: 'Telco Circuit',
        id: 'CIRCUIT',
        sequenceKey: 'CIRCUIT',
        type: 'IS-TELCO',
        prefixTemplate: '##OWNER##-6##MD####SEQ##'
    },
    {
        name: 'Infrastruktur-Service',
        id: 'IS',
        sequenceKey: 'IS',
        type: 'IS-SERVICE',
        prefixTemplate: '##OWNER##-7Z##SEQ##'
    },
    {
        name: 'Endkunden-Service',
        id: 'SERVICE',
        sequenceKey: 'SERVICE',
        type: 'CF-SERVICE',
        prefixTemplate: 'S-##SEQ##'
    }   
    ]
};

module.exports = idGeneratorConfig;
