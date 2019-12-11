require('dotenv').config(); // this loads the defined variables from .env
const fs = require('fs');

const idGeneratorConfig = JSON.parse(fs.readFileSync('./config/generatorconfig.json', 'utf-8'));

module.exports = idGeneratorConfig;
