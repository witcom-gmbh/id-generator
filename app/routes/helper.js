var seqConfig = require('../../config/generatorconfig');



/**
 * @swagger
 * definitions:
 *   serviceTypeResponse:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       id:
 *         type: string
 *       sequenceKey:
 *         type: string* 
 *       type:
 *         type: string
 *       prefixTemplate:
 *         type: string
 * 
 */

/**
 * @swagger
 * definitions:
 *   serviceOwnerResponse:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       id:
 *         type: string
 * 
 */

/**
 * @swagger
 * definitions:
 *   managementDomainResponse:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       id:
 *         type: string
 * 
 */


/**
 * @swagger
 * /api/v1/is-service-type:
 *   get:
 *     tags:
 *       - Helper
 *     name: Get Infrastructure Service-Types
 *     summary: Get available Infrastructure Service-Types
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
 *     name: Get customer-facing Service-Types
 *     summary: Get available customer-facing Service-Types
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
 *     name: Get service-owners
 *     summary: Get available service-owners for IS-Services
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
 *     name: Get management-domains
 *     summary: Get available management-domains for IS-Services
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

module.exports = (app) => {
    
    app.get('/api/v1/is-service-type',(req,res,next) => {
        //get all service-types starting with IS-
        let isSvcTypes = seqConfig.serviceType.filter(st => st.type.substring(0,3)==='IS-');
        res.json(isSvcTypes);
    });

    app.get('/api/v1/cf-service-type',(req,res,next) => {
        //get all service-types starting with CF-
        let cfSvcTypes = seqConfig.serviceType.filter(st => st.type.substring(0,3)==='CF-');
        res.json(cfSvcTypes);
    });
    
    app.get('/api/v1/service-owner',(req,res,next) => {
        res.json(seqConfig.serviceOwner);
    });

    app.get('/api/v1/management-domain',(req,res,next) => {
        res.json(seqConfig.managementDomain);
    });



};
