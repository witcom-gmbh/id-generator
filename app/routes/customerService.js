const generator = require('../GeneratorService');
var keycloak   = require('../../config/kc-config');
const logger = require('../../config/applogger');
/**
 * @swagger
 * definitions:
 *   CustomerIdRequest:
 *     type: object
 *     properties:
 *       serviceType:
 *         type: string
 *       count:
 *         type: integer
 *       required:
 *         - serviceType
 */

/**
 * @swagger
 * /api/v1/cf-service:
 *   post:
 *     tags:
 *       - Generator
 *     description: Generate Service-IDs
 *     summary: Generates customer-facing Service-IDs for a specified service-type
 *     operationId: generateCFServiceIds
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           $ref: '#/definitions/CustomerIdRequest'
 *         required:
 *           - serviceType
 *     responses:
 *       '200':
 *         description: Service-IDs generated
 *         schema:
 *           $ref: '#/definitions/IdResponse'
 *       '400':
 *         description: Service-IDs could not be created
 */

module.exports = (app) => {
    let resourceName = 'cf-service';

    app.post('/api/v1/cf-service', keycloak.enforcer([resourceName+':create'], {
    resource_server_id: process.env.KEYCLOAK_RESOURCE_ID
    }),

    (req,res,next) => {

        if (!req.body){
            logger.error("Request body is empty");
           res.
           status(400).
           json({message:"Request body is empty"});
           return;
        }

        let obj = req.body;

        if (!obj.serviceType){
            logger.error("Request has no serviceType");
            res.status(400).json({message:"Request has no serviceType"});
            return;
        }

        if(!obj.count){
            obj.count=1;
        }

        generator.generate(obj).then(function(values) {
            //console.log(values);
            res.json(values);
        })
        .catch((err)=>{
            logger.error(err);
            res.
            status(400).
            json(err);
        });
    });

};
