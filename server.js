require('dotenv').config(); // this loads the defined variables from .env
const health = require('@cloudnative/health-connect');
const healthcheck = require ('./app/generatorhealthcheck');
var keycloak   = require('./config/kc-config');
var cors = require('cors');
const http = require('http');
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var swaggerJSDoc = require('swagger-jsdoc');
var swaggerUi = require( 'swagger-ui-express');
const logger = require('./config/applogger');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 3000;
const devMode = (process.env.DEVMODE === 'true') || false;

var securityDefinition = {};
if (devMode){

    app.options('*', cors())
    app.use(cors());

    securityDefinition = {
      type: 'apiKey',
      name: 'Authorization',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
    };

} else {

    securityDefinition ={
      type: 'oauth2',
      flow: 'application',
      authorizationUrl: process.env.KEYCLOAK_SERVER_URL + '/realms/'+process.env.KEYCLOAK_REALM+'/protocol/openid-connect/auth',
      tokenUrl: process.env.KEYCLOAK_SERVER_URL + '/realms/'+process.env.KEYCLOAK_REALM+'/protocol/openid-connect/token',
      scopes: {},
    };

}

const swaggerDefinition = {
  info: {
    title: 'Service-ID Generator',
    version: '1.2.3',
    description: 'Endpoints for Service-ID Generation',
  },
  host: "",
  basePath: '/',
  securityDefinitions: {
    bearerAuth: securityDefinition
  },
};

//keycloak configuration
//let keycloak = new Keycloak({},kcConfig);
app.use( keycloak.middleware() );


const options = {
  swaggerDefinition,
  apis: ['./app/routes/*.js'],
};
const swaggerSpec = swaggerJSDoc(options);

app.get('/api/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
if (devMode){
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
var router = express.Router();

router.get('/', function(req, res) {
    res.json({ message: 'Welcome to the WiTCOM-Sequence-Generator api!' });
});

require('./app/routes/infrastructureService')(app);
require('./app/routes/customerService')(app);
require('./app/routes/helper')(app);
require('./app/routes/sequence')(app);
require('./app/routes/operations')(app);

app.use('/api', router);

//health endpoints
app.use('/-/live', health.LivenessEndpoint(healthcheck.getHealthCheck()))
app.use('/-/ready', health.ReadinessEndpoint(healthcheck.getHealthCheck()))

app.listen(port);

logger.info('WiTCOM Sequenz-Generator running on port '+ port)


