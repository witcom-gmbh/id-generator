require('dotenv').config(); // this loads the defined variables from .env
//var Keycloak = require('keycloak-connect');
var keycloak   = require('./config/kc-config');
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var swaggerJSDoc = require('swagger-jsdoc');
var swaggerUi = require( 'swagger-ui-express');



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 3000;
const swaggerhost = process.env.APIHOST || 'localhost:3000'
const swaggerDefinition = {
  info: {
    title: 'Service-ID Generator',
    version: '1.0.0',
    description: 'Endpoints for Service-ID Generation',
  },
  host: swaggerhost,
  basePath: '/',
  securityDefinitions: {
    bearerAuth: {
      type: 'oauth2',
      flow: 'password',
      authorizationUrl: 'http://FQDN',
      tokenUrl: 'FQDN',
      scopes: {'open-id':"default-scope"},
    },
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

app.get('/api/swagger.json', keycloak.protect(), (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

var router = express.Router();

router.get('/', function(req, res) {
    res.json({ message: 'Welcome to the WiTCOM-Sequence-Generator api!' });
});

require('./app/routes/infrastructureService')(app);
require('./app/routes/customerService')(app);
require('./app/routes/helper')(app);
require('./app/routes/sequence')(app);

app.use('/api', router);
app.listen(port);
console.log('WiTCOM Sequenz-Generator running on port ' + port);
