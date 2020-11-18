require('dotenv').config(); // this loads the defined variables from .env
const fs = require('fs');

const CONFIGFILE = process.env.CONFIGFILE || './config/generatorconfig.json';

//const idGeneratorConfig = JSON.parse(fs.readFileSync(CONFIGFILE, 'utf-8'));

class GeneratorConfig {
    
    constructor(){
        var idGeneratorConfig;
        this.loadConfig();

    }

    getConfig(){
        return this.idGeneratorConfig;
    }

    loadConfig(){
        console.info("Loading config from " + CONFIGFILE);

        this.idGeneratorConfig = JSON.parse(fs.readFileSync(CONFIGFILE, 'utf-8'));
        
    }
}


module.exports = new GeneratorConfig();
