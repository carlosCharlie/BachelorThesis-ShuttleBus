    /**
     * 
     * @module controller
     * 
     * @description Contents th main functions that are common in the rest of application.
     * 
     */

    const personSA = require("../service_application/personSA");
    const ERROR = require("../errors/errors");

    /**
     * @description Avoid internal null errors, it should be called at the first line of all exported functions.
     * 
     * @return {Promise} A promise with confirmation about the input data are correct or not.
     */
    function checkData(data){

      return new Promise((resolve, reject) => {

        if(data == null) reject(ERROR.necessaryDataIsNull);
        else resolve();
      });
    }

    /**
     * @description Checks if an user exists and the type if it is indicated.
     * 
     * @return {Promise} A promise with confirmation about the input data are correct or not.
     */
    function checkUser(user, userType = null){ return personSA.checkUser(user, userType); }


    module.exports = {

      checkData: checkData,
      checkUser: checkUser
    }