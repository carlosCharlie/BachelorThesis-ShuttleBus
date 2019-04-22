    /**
     * 
     * @module service_application
     * 
     * @description Apply the logic application about the origins functions.
     * 
     */

    const ERROR = require("../errors/errors");
    const originDAO = require("../data_access/origin_DAO");

    function getAllOrigins(){ return originDAO.getAllOrigins(); }

    function getOriginByName(name) {

        return originDAO.getOriginByName(name)
        .then(origin => {

            if(origin == null) throw ERROR.originDoesntExists;
            else return origin;
        });
    }

    function getOriginById(id) {

        return originDAO.getOriginById(id)
        .then((origin) => {

            if(origin == null) throw ERROR.originDoesntExists;
            else return origin;
        })
    }

    function deleteOriginById(id) {

        return originDAO.getOriginById(id)
        .then((origin) => {

            if(origin == null) throw ERROR.originDoesntExists;
            else return originDAO.deleteOriginById(id);
        });
    }

    function modifyOriginById(id,newData) {

        return checkRequirements(newData)
        .then(() => originDAO.getOriginById(id))
        .then((origin) => {

            if(origin == null) throw ERROR.originDoesntExists;
            else if(origin.name == newData.name) return false;
            else return originDAO.modifyOriginById(id, newData);

        }).then((result) => { return result != false });
    }

    function createOrigin(newOrigin) {

        return checkRequirements(newOrigin)
        .then(() => originDAO.getOriginByName(newOrigin.name))
        .then((origin) => {

            if(origin != null) throw ERROR.originAlreadyExists;
            else return originDAO.insertOrigin(newOrigin);
        })
    }

    /* **************************************************************************************************** */

    /**
     * @description Checks origin requirements.
     *              Should be used when you want to insert or modify new data into the database.
     * 
     * @returns {Promise} A promise with confirmation about input data.
     */
    function checkRequirements(origin){

        return new Promise((resolve,reject) => {

            if(origin == null || origin.name == null || origin.name.length == 0 || 
                origin.coordinates == null || origin.coordinates == "") reject(ERROR.badRequestForm);

            else resolve();
        })
    }

    module.exports = {

        getAllOrigins:getAllOrigins,
        getOriginById:getOriginById,
        deleteOriginById:deleteOriginById,
        modifyOriginById:modifyOriginById,
        createOrigin:createOrigin,
        getOriginByName:getOriginByName
    }
