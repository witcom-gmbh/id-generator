var seqConfig = require('../../config/generatorconfig');
var keycloak   = require('../../config/kc-config');
const generator = require('../GeneratorService');

/**
 * @swagger
 * definitions:
 *   UpdateSequenceValueRequest:
 *     type: object
 *     properties:
 *       newVal:
 *         type: integer
 *         minimum: 1
 *     required:
 *     - newVal
 */

/**
 * @swagger
 * definitions:
 *   UpdateSequenceValueResponse:
 *     type: object
 *     properties:
 *       successful:
 *         type: boolean
 */

/**
 * @swagger
 * definitions:
 *   GetSequenceValueResponse:
 *     type: object
 *     properties:
 *       successful:
 *         type: boolean
 *       value:
 *         type: integer
 */

/**
 * @swagger
 * definitions:
 *   Sequence:
 *     type: object
 *     properties:
 *       key:
 *         type: string
 */


/**
 * @swagger
 * definitions:
 *   GetSequencesResponse:
 *     type: array
 *     items:
 *       "$ref": "#/definitions/Sequence"
 *
 */

/**
 * @swagger
 * /api/v1/sequences:
 *   get:
 *     tags:
 *       - Sequence
 *     description: Get all sequence definitions
 *     summary: Get all sequence definitions
 *     operationId: getSequenceDefinitions
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: Sequence value
 *         schema:
 *           $ref: '#/definitions/GetSequencesResponse'
 *       '400':
 *         description: List of sequences could not be retrieved
 */

/**
 * @swagger
 * /api/v1/sequences/{key}:
 *   get:
 *     tags:
 *       - Sequence
 *     description: Get sequence value
 *     operationId: getSequenceValue
 *     summary: Get sequence value
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: key
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Sequence value
 *         schema:
 *           $ref: '#/definitions/GetSequenceValueResponse'
 *       '400':
 *         description: Sequence-Id could not be retrieved
 *   put:
 *     tags:
 *       - Sequence
 *     description: Set sequnce to a new value
 *     summary: Sets sequence to an new value
 *     operationId: updateSequenceValue
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: key
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: body
 *         in: body
 *         schema:
 *           $ref: '#/definitions/UpdateSequenceValueRequest'
 *     responses:
 *       '200':
 *         description: Sequence value updated
 *         schema:
 *           $ref: '#/definitions/UpdateSequenceValueResponse'
 *       '400':
 *         description: Sequence-Id could not be updated
 */

module.exports = (app) => {


    app.get('/api/v1/sequences', keycloak.protect(),(req,res,next) => {
        res.json(seqConfig.sequenceDefinition);
    });

    app.get('/api/v1/sequences/:key', keycloak.enforcer(['sequence:view'], {
    resource_server_id: process.env.KEYCLOAK_RESOURCE_ID
    }),
    (req,res,next) => {

        if (!req.params){
           res.
           status(400).
           json({errMsg:"Request params are empty"});
           return;
        }
        if (!req.params.key){
           res.
           status(400).
           json({errMsg:"Request has no sequence key"});
           return;
        }

        let  = sequenceKey = req.params.key;

        generator.getSequenceVal(sequenceKey).then(function(val) {
            res.json({"val":val});
        })
        .catch((err)=>{
            console.log(err);
            res.
            status(400).
            json(err);
        });
    });

    app.put('/api/v1/sequences/:key', keycloak.enforcer(['sequence:create'], {
    resource_server_id: process.env.KEYCLOAK_RESOURCE_ID
    }),
    (req,res,next) => {

        if (!req.params){
           res.
           status(400).
           json({errMsg:"Request params are empty"});
           return;
        }
        if (!req.params.key){
           res.
           status(400).
           json({errMsg:"Request has no sequence key"});
           return;
        }

        if (!req.body){
           res.
           status(400).
           json({errMsg:"Request body is empty"});
           return;
        }

        let obj = req.body;

        if (!obj.newVal){
            res.status(400).json({errMsg:"Request has no newVal"});
            return;
        }
        obj.sequenceKey = req.params.key;

        generator.setSequenceVal(obj).then(function(val) {
            res.json({"successful":true});
        })
        .catch((err)=>{
            console.log(err);
            res.
            status(400).
            json(err);
        });
    });


};