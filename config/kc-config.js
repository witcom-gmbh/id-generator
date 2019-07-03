require('dotenv').config(); // this loads the defined variables from .env
var Keycloak = require('keycloak-connect');

let kcConfig = {
  "realm": process.env.KEYCLOAK_REALM,
  "bearer-only": true,
  "auth-server-url": process.env.KEYCLOAK_SERVER_URL,
  "ssl-required": "external",
  "resource": process.env.KEYCLOAK_RESOURCE_ID,
  "credentials": {
    "secret": process.env.KEYCLOAK_SECRET
  },  
  "verify-token-audience": true,
  "use-resource-role-mappings": true,
  "confidential-port": 0
}
console.log('Configured Keycloak with Host ' + kcConfig['auth-server-url'] + ' and realm ' + kcConfig['realm']);
let keycloak = new Keycloak({},kcConfig);

module.exports = keycloak;
