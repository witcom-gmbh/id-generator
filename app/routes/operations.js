var keycloak   = require('../../config/kc-config');
const generator = require('../GeneratorService');
const logger = require('../../config/applogger');

/**
 * @swagger
 * definitions:
 *   SequencesBackupResponse:
 *     type: array
 *     items:
 *       "$ref": "#/definitions/SequenceWithValue"
 *
 */

/**
 * @swagger
 * definitions:
 *   SequencesRestoreRequest:
 *     type: array
 *     items:
 *       "$ref": "#/definitions/SequenceWithValue"
 *
 */

/**
 * @swagger
 * definitions:
 *   SequencesRestoreResponse:
 *     type: array
 *     items:
 *       "$ref": "#/definitions/SequenceWithValue"
 *
 */


/**
 * @swagger
 * definitions:
 *   SequenceWithValue:
 *     type: object
 *     properties:
 *       sequence:
 *         type: string
 *       value:
 *         type: integer
 */


/**
 * @swagger
 * /api/v1/operations/sequencebackup:
 *   get:
 *     tags:
 *       - Operations
 *     description: create backup of sequence values
 *     operationId: getSequenceBackup
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: List of sequences with value
 *         schema:
 *           $ref: '#/definitions/SequencesBackupResponse'
 *       '400':
 *         description: Sequence-Id could not be retrieved
 */

/**
 * @swagger
 * /api/v1/operations/sequencerestore:
 *   put:
 *     tags:
 *       - Operations
 *     description: Restore sequence values from backup
 *     operationId: restoreSequenceBackup
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
 *           $ref: '#/definitions/SequencesRestoreRequest'
 *     responses:
 *       '200':
 *         description: Sequence value updated
 *         schema:
 *           $ref: '#/definitions/SequencesRestoreResponse'
 *       '400':
 *         description: Sequence-Id could not be updated
 */

 /**
 * @swagger
 * /api/v1/operations/reload:
 *   post:
 *     tags:
 *       - Operations
 *     description: Reload generator-config
 *     operationId: reloadConfig
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: config has been reloaded
 *       '500':
 *         description: config could not be reloaded
 */


module.exports = (app) => {

    let resourceName = 'sequence';

    app.post('/api/v1/operations/reload', (req,res,next) => {
        generator.configReload().then(function(val) {
            res.status(200).json("OK");
        })
        .catch((err)=>{
            logger.error(err);
            res.
            status(500).json(err);
        });

    });

    app.get('/api/v1/operations/sequencebackup', keycloak.enforcer([resourceName+':view'], {
    resource_server_id: process.env.KEYCLOAK_RESOURCE_ID
    }),
    (req,res,next) => {

        generator.getSequenceValues().then(function(val) {
            let mapped = val
            .filter(seq => seq.value != null)
            .map(seq => { let obj = {'sequence':seq.key,'value':seq.value}; return obj});
            //console.log(mapped);
            res.json(mapped);
        })
        .catch((err)=>{
            logger.error(err);
            res.
            status(400).
            json(err);
        });;
    });

    app.put('/api/v1/operations/sequencerestore', keycloak.enforcer([resourceName+':restore'], {
    resource_server_id: process.env.KEYCLOAK_RESOURCE_ID
    }),
    (req,res,next) => {

        if (!req.body){
           res.
           status(400).
           json({message:"Request body is empty"});
           return;
        }

        let obj = req.body;
        let mapped = obj.map(seq => {return {state:{key:seq.sequence},val:seq.value};} );
        generator.setSequenceValues(mapped).then(function(val) {

            let mapped = val
            .filter(seq => seq.value != null)
            .map(seq => { let obj = {'sequence':seq.key,'value':seq.value}; return obj});
            res.json(mapped);
        })
        .catch((err)=>{
            logger.error(err);
            res.
            status(400).
            json(err);
        });;
    });



};