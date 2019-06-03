const generator = require('../GeneratorService');

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
 *     name: Generate Service-IDs
 *     summary: Generates customer-facing Service-IDs for a specified service-type
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
 *           type: object
 *           properties:
 *             serviceType:
 *               type: string
 *             count:
 *               type: integer
 *         required:
 *           - serviceType
 *     responses:
 *       '200':
 *         description: Service-IDs generated
 *         schema:
 *           $ref: '#/definitions/IdResponse'
 *       '400':
 *         description: Service-ID could not be created
 */

module.exports = (app) => {
    
    app.post('/api/v1/cf-service',(req,res,next) => {
        
        
        if (!req.body){
           res.
           status(400).
           json({errMsg:"Request body is empty"}); 
           return;
        }
        
        let obj = req.body;
        
        if (!obj.serviceType){
            res.status(400).json({errMsg:"Request has no serviceType"}); 
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
            console.log(err);
            res.
            status(400).
            json(err);
        });
    });

};