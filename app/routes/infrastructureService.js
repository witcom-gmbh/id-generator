const generator = require('../GeneratorService');
var keycloak   = require('../../config/kc-config');

/**
 * @swagger
 * definitions:
 *   ISIdRequest:
 *     type: object
 *     properties:
 *       serviceOwner:
 *         type: string
 *       serviceType:
 *         type: string
 *       md:
 *         type: string
 *       count:
 *         type: integer
 *       required:
 *         - serviceOwner
 *         - serviceType
 *         - md
 */

/**
 * @swagger
 * definitions:
 *   IdResponse:
 *     type: object
 *     properties:
 *       successful:
 *         type: boolean
 *       serviceIds:
 *         type: array
 *         items:
 *           type: string
 */

/**
 * @swagger
 * /api/v1/is-service:
 *   post:
 *     tags:
 *       - Generator
 *     description: Generate Infrastructure Service-IDs
 *     summary: Generates Infrastrukture Service-IDs for a specified service-type
 *     operationId: generateISServiceIds
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
 *           $ref: '#/definitions/ISIdRequest'
 *         required:
 *           - serviceOwner
 *           - serviceType
 *           - md
 *     responses:
 *       '200':
 *         description: IS Service-IDs created
 *         schema:
 *           $ref: '#/definitions/IdResponse'
 *       '400':
 *         description: Service-IDs could not be created
 */

module.exports = (app) => {

    app.post('/api/v1/is-service', keycloak.enforcer(['is-service:create'], {
    resource_server_id: process.env.KEYCLOAK_RESOURCE_ID
    }),

    (req,res,next) => {

        if (!req.body){
           res.
           status(400).
           json({errMsg:"Request body is empty"});
           return;
        }

        let obj = req.body;

        if (!obj.serviceOwner){
            res.status(400).json({errMsg:"Request has no serviceOwner"});
            return;
        }
        if (!obj.serviceType){
            res.status(400).json({errMsg:"Request has no serviceType"});
            return;
        }

        if (!obj.md){
            res.status(400).json({errMsg:"Request has no managementDomain"});
            return;
        }
        if(!obj.count){
            obj.count=1;
        }

        generator.generate(obj).then(function(values) {
            res.json(values);
        })
        .catch((err)=>{
            console.log(err);
            res.
            status(400).
            json(err);
        });
    });

};
