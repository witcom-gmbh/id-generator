var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var swaggerJSDoc = require('swagger-jsdoc');
var swaggerUi = require( 'swagger-ui-express');



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

const swaggerDefinition = {
  info: {
    title: 'Service-ID Generator',
    version: '1.0.0',
    description: 'Endpoints for Service-ID Generation',
  },
  host: 'localhost:3000',
  basePath: '/',
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      scheme: 'bearer',
      in: 'header',
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./app/routes/*.js'],
};
const swaggerSpec = swaggerJSDoc(options);

app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

var router = express.Router();              

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

require('./app/routes/infrastructureService')(app);
require('./app/routes/customerService')(app);
require('./app/routes/helper')(app);

app.use('/api', router);
app.listen(port);
console.log('WiTCOM Sequenz-Generator running on port ' + port);