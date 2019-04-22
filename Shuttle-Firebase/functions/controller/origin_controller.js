    /**
     * 
     * @module controller
     * 
     * @description Controller all functions about origin object [create, delete, modify and read]
     * 
     * Example to build functions:
     * 
     *  getAllOrigins({});
     *  getOriginByName({origin:{name:"nombre"}});
     *  getOrigin({origin:{id:"nTREdQ19BRPRACy5JBiN"}});
     *  createOrigin({user:{email:"admin@gmail.com",password:"123"},origin:{name:"Barajas T5",coordAlt:123,coordLong:234}});
     *  deleteOrigin({user:{email:"admin@gmail.com",password:"123"},origin:{id:"nTREdQ19BRPRACy5JBiN"}});
     *  modifyOrigin({user:{email:"admin@gmail.com",password:"123"},origin:{id:"...",name:"Barajas T6"}});
     * 
     */

    const functions = require("firebase-functions");
    const index = require("./common");
    const originSA = require("../service_application/origin_SA");

     /**
     * @description Get a list of id and name origins.
     * 
     * @returns {Promise} A promise that return a list of origins.
     */
    exports.getAllOrigins = functions.https.onCall((data, context) => {
        
        return originSA.getAllOrigins() 
        .then(result => { return {origins: result}}, error => error);
    });

    /**
     * @description Get a origin match with name of parameter
     * 
     * @returns {Promise} A promise that return a origin.
     */
    exports.getOriginByName = functions.https.onCall((data, context) => {

        return index.checkData(data)
        .then(() => index.checkData(data.origin))
        .then(() => index.checkData(data.origin.name))
        .then(() => originSA.getOriginByName(data.origin.name))
        .then((origin) => origin, error => error);
    });
  
    /**
     * @description Get all data from an Origin.
     * 
     * @returns {Promise} A promise that returns a data from an Origin.
     */
    exports.getOrigin = functions.https.onCall((data, context) => {

        return index.checkData(data)
        .then(() => checkOrigin(data.origin))
        .then(() => originSA.getOriginById(data.origin.id))
        .then(result => result, error => error);
    });

    /**
     * @description Creates a new origin.
     * 
     * @returns {Promise} A promise with the new id of origin.
     */
    exports.createOrigin = functions.https.onCall((data, context) => {

        return index.checkData(data)
        .then(() => index.checkUser(data.user, "admin"))
        .then(() => index.checkData(data.origin))
        .then(() => index.checkData(data.origin.coordAlt))
        .then(() => index.checkData(data.origin.coordLong))
        .then(() => {

            data.origin.coordinates = String(data.origin.coordAlt) + "," + String(data.origin.coordLong);
            delete data.origin.coordAlt;
            delete data.origin.coordLong;
            return originSA.createOrigin(data.origin);
        })
        .then((id) => { return {id: id} }, error => error);
    });

    /**
     * @description Delete an origin.
     * 
     * @returns {Promise} A promise with conformation about the deletion.
     */
    exports.deleteOrigin = functions.https.onCall((data, context) => {

        return index.checkData(data)
        .then(() => index.checkUser(data.user, "admin"))
        .then(() => checkOrigin(data.origin))
        .then(() => originSA.deleteOriginById(data.origin.id))
        .then(() => { return {deleted: true} }, error => error);
    });
  
    /**
     * @description Modify an origin.
     * 
     * @returns {Promise} A promise with confirmation about the modification.
     */
    exports.modifyOrigin = functions.https.onCall((data, context) => {

        return index.checkData(data)
        .then(() => checkOrigin(data.origin))
        .then(() => index.checkUser(data.user, "admin"))
        .then(() => originSA.modifyOriginById(data.origin.id,data.origin))
        .then((modified) => {return {modified: modified}}, error => error);
    });

    /* *********************************************************************************************** */

    /**
     * @description Check that the input data are not empty
     * 
     * @returns {Promise} A promise with confirmation about the input data are correct or not.
     */
    function checkOrigin(origin){

        return new Promise((resolve, reject) => {

            if(origin == null) reject(ERROR.necessaryDataIsNull);
            else resolve();
        });
    }
  