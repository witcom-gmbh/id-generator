//var seqConfig = require('../../config/generatorconfig');
var idGeneratorConfig = require('../../config/generatorconfig');
var keycloak   = require('../../config/kc-config');
const logger = require('../../config/applogger');

/**
 * @swagger
 * definitions:
 *   serviceType:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       id:
 *         type: string
 *       sequenceKey:
 *         type: string
 *       type:
 *         type: string
 *       prefixTemplate:
 *         type: string
 *     required:
 *     - name
 *
 *
 */

/**
 * @swagger
 * definitions:
 *   serviceTypeResponse:
 *     type: array
 *     items:
 *       "$ref": "#/definitions/serviceType"
 *
 */

/**
 * @swagger
 * definitions:
 *   serviceOwner:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       id:
 *         type: string
 *     required:
 *     - name
 *
 *
 */

/**
 * @swagger
 * definitions:
 *   serviceOwnerResponse:
 *     type: array
 *     items:
 *       "$ref": "#/definitions/serviceOwner"
 *
 */

/**
 * @swagger
 * definitions:
 *   managementDomain:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       id:
 *         type: string
 *     required:
 *     - name
 *
 *
 */

/**
 * @swagger
 * definitions:
 *   managementDomainResponse:
 *     type: array
 *     items:
 *       "$ref": "#/definitions/managementDomain"
 *
 */

/**
 * @swagger
 * definitions:
 *   serviceTemplate:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       id:
 *         type: string
 *       type:
 *         type: string
 *         enum: [IS, CF]
 *       template:
 *         type: object
 *         properties:
 *           serviceOwner:
 *             type: string
 *           serviceType:
 *             type: string
 *           md:
 *             type: string
 *     required:
 *     - name
 *
 */

/**
 * @swagger
 * definitions:
 *   serviceTemplateResponse:
 *     type: array
 *     items:
 *       "$ref": "#/definitions/serviceTemplate"
 *
 */


/**
 * @swagger
 * /api/v1/is-service-type:
 *   get:
 *     tags:
 *       - Helper
 *     description: Get Infrastructure Service-Types
 *     summary: Get available Infrastructure Service-Types
 *     operationId: getIsServiceTypes
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: List of infrastructure service-types
 *         schema:
 *           $ref: '#/definitions/serviceTypeResponse'
 *       '400':
 *         description: List of infrastructure service-types could not be retrieved
 */

/**
 * @swagger
 * /api/v1/cf-service-type:
 *   get:
 *     tags:
 *       - Helper
 *     description: Get customer-facing Service-Types
 *     summary: Get available customer-facing Service-Types
 *     operationId: getCFServiceTypes
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: List of customer-facing service-types
 *         schema:
 *           $ref: '#/definitions/serviceTypeResponse'
 *       '400':
 *         description: List of customer-facing service-types could not be retrieved
 */

/**
 * @swagger
 * /api/v1/service-owner:
 *   get:
 *     tags:
 *       - Helper
 *     description: Get service-owners
 *     summary: Get available service-owners for IS-Services
 *     operationId: getServiceOwners
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: List of service-owners
 *         schema:
 *           $ref: '#/definitions/serviceOwnerResponse'
 *       '400':
 *         description: List of service-owners could not be retrieved
 */

/**
 * @swagger
 * /api/v1/management-domain:
 *   get:
 *     tags:
 *       - Helper
 *     description: Get management-domains
 *     summary: Get available management-domains for IS-Services
 *     operationId: getManagementDomains
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: List of management-domains
 *         schema:
 *           $ref: '#/definitions/managementDomainResponse'
 *       '400':
 *         description: List of management-domains could not be retrieved
 */

/**
 * @swagger
 * /api/v1/service-template:
 *   get:
 *     tags:
 *       - Helper
 *     description: Get service-templates
 *     summary: Get service-templates for predefines use-cases
 *     operationId: getServiceTemplates
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: List of service-Templates
 *         schema:
 *           $ref: '#/definitions/serviceTemplateResponse'
 *       '400':
 *         description: List of service-templates could not be retrieved
 */


module.exports = (app) => {

    

    app.get('/api/v1/is-service-type', keycloak.protect(),(req,res,next) => {
        //get all service-types starting with IS-
        let seqConfig=idGeneratorConfig.getConfig();
        let isSvcTypes = seqConfig.serviceType.filter(st => st.type.substring(0,3)==='IS-');
        res.json(isSvcTypes);
    });

    app.get('/api/v1/cf-service-type', keycloak.protect(),(req,res,next) => {
        //get all service-types starting with CF-
        let seqConfig=idGeneratorConfig.getConfig();
        let cfSvcTypes = seqConfig.serviceType.filter(st => st.type.substring(0,3)==='CF-');
        res.json(cfSvcTypes);
    });

    app.get('/api/v1/service-owner', keycloak.protect(),(req,res,next) => {
        let seqConfig=idGeneratorConfig.getConfig();
        res.json(seqConfig.serviceOwner);
    });

    app.get('/api/v1/management-domain', keycloak.protect(),(req,res,next) => {
        let seqConfig=idGeneratorConfig.getConfig();
        res.json(seqConfig.managementDomain);
    });

    app.get('/api/v1/service-template', keycloak.protect(),(req,res,next) => {
        let seqConfig=idGeneratorConfig.getConfig();
        res.json(seqConfig.serviceTemplate);
    });

    

};
