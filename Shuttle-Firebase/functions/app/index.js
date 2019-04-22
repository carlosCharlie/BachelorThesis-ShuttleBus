    /**
     * 
     * @module index
     * 
     * @description The controller of application
     * 
     */

    const functions = require("firebase-functions");

    const common = require("./common/common");
    const personSA = require("./service_application/person_SA");
    const originSA = require("./service_application/origin_SA");
    const routeSA = require("./service_application/route_SA");

    /* *********************************************************************************************** */

    /**
     * 
     * Module: account
     * 
     * Functions:
     * 
     *  signin({user:{email:"jose@gmail.com"});
     *  signup({user:{email:"jose@gmail.com", password:"...jk132k4j1kj23h4l...", name:"Jose", surname:"Ramirez", number:123456789, type:"driver", }});
     * 
     */

    /**
     * @description Check the correct login of a user in the application.
     * 
     * @returns {Promise} A promise with user data in the correct case and error in the wrong case.
     */
    exports.signin = functions.https.onCall((data, context) => {

        return common.checkData(data)
        .then(() => common.checkUser(data.user))
        .then(() => personSA.signIn(data.user.email, data.user.password))
        .then(result => result, error => error);
    });
    
    /**
     * @description Signs up a new user if not exists.
     * 
     * @returns {Promise} A promise that returns "signedUp:true" if its correct(it allows client to check if connection goes well) or an error.
     */
    exports.signup = functions.https.onCall((data, context) => {

        return common.checkData(data)
        .then(() => common.checkData(data.user))
        .then(() => personSA.signUp(data.user))
        .then(() => { return {signedUp: true} }, error => error);
    });

    /* *********************************************************************************************** */
    /* *********************************************************************************************** */

    /**
     * 
     * Module: origin
     * 
     * Functions:
     * 
     *  getAllOrigins({});
     *  getOriginByName({origin:{name:"nombre"}});
     *  getOrigin({origin:{id:"nTREdQ19BRPRACy5JBiN"}});
     *  createOrigin({user:{email:"admin@gmail.com",password:"123"},origin:{name:"Barajas T5",coordAlt:123,coordLong:234}});
     *  deleteOrigin({user:{email:"admin@gmail.com",password:"123"},origin:{id:"nTREdQ19BRPRACy5JBiN"}});
     *  modifyOrigin({user:{email:"admin@gmail.com",password:"123"},origin:{id:"...",name:"Barajas T6"}});
     * 
     */

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

        return common.checkData(data)
        .then(() => common.checkData(data.origin))
        .then(() => common.checkData(data.origin.name))
        .then(() => originSA.getOriginByName(data.origin.name))
        .then((origin) => origin, error => error);
    });
  
    /**
     * @description Get all data from an Origin.
     * 
     * @returns {Promise} A promise that returns a data from an Origin.
     */
    exports.getOrigin = functions.https.onCall((data, context) => {

        return common.checkData(data)
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

        return common.checkData(data)
        .then(() => common.checkUser(data.user, "admin"))
        .then(() => common.checkData(data.origin))
        .then(() => common.checkData(data.origin.coordAlt))
        .then(() => common.checkData(data.origin.coordLong))
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

        return common.checkData(data)
        .then(() => common.checkUser(data.user, "admin"))
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

        return common.checkData(data)
        .then(() => checkOrigin(data.origin))
        .then(() => common.checkUser(data.user, "admin"))
        .then(() => originSA.modifyOriginById(data.origin.id,data.origin))
        .then((modified) => {return {modified: modified}}, error => error);
    });

    /* *********************************************************************************************** */
    /* Private function of module origin */

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
    };

    /* *********************************************************************************************** */
    /* *********************************************************************************************** */

    /**
     * 
     * Module: route
     * 
     * Functions:
     * 
     *  getRoutesByUser({user:{email:"driv@gmail.com",password:"123"}}, {headers: {Authorization: 'Bearer $token'}});
     *  getRouteById({user:{email:"admin@gmail.com",password:"123"},{route:{id:"..."}}, {headers: {Authorization: 'Bearer $token'}});
     *  createRoute({user:{email:"driv@gmail.com",password:"123"},route:{max:2,origin:"i9BQCi6ovzC1pdBGoRYm(elOrigenDelId)",destination:"1234(codigoPostal)"}}, {headers: {Authorization: 'Bearer $token'}});
     *  searchRoute({route:{destination:"28008",origin:"loquesea"}}, {headers: {Authorization: 'Bearer $token'}});})
     *  getRoutePoints({user:{email:"driv@gmail.com",password:"123"},route:{id:"CwCBCrWiW2Ty6KrLyIyG"}}, {headers: {Authorization: 'Bearer $token'}});
     *  addToRoute({address:"passenger address",coordinates:"",route:{id:"7ptW7eHRPqtoaHL4SWae"},user:{email:"pass@gmail.com",password:"123"}}, {headers: {Authorization: 'Bearer $token'}});
     *  removeRoute({user:{email:"driv@gmail.com",password:"123"},route:{id:"N6ObwG7HYLpelukKi5qL"}}, {headers: {Authorization: 'Bearer $token'}});
     *  removePassengerFromRoute({user:{email:"pass@gmail.com",password:"123"},route:{id:"N6ObwG7HYLpelukKi5qL"}}, {headers: {Authorization: 'Bearer $token'}});
    */

    /**
     * @description Create a new route.
     * 
     * @returns {Promise} A promise with id of new route.
     */
    exports.createRoute = functions.https.onCall((data, context) => {

        return common.checkData(data)
        .then(() => common.checkData(data.route))
        .then(() => common.checkUser(data.user, "driver"))
        .then((fullUser) => {

        data.route.driver = fullUser.id; 

        return routeSA.createRoute(data.route); 
        })
        .then((id) => { return {id: id} }, error => error);
    });

    /**
     * @description Search a route to match with the parameter.
     * 
     * @returns {Promise} A promise with a list of results routes.
     */
    exports.searchRoute = functions.https.onCall((data, context) => {

        return common.checkData(data)
        .then(() => common.checkData(data.route))
        .then(() => common.checkData(data.route.origin))
        .then(() => common.checkData(data.route.destination))
        .then(() => routeSA.searchRoutes(data.route.origin,data.route.destination))
        .then((routes) => { return {routes: routes}}, error => error);
    });

    /**
     * @description Add user to a existing route.
     * 
     * @returns {Promise} A promise with confirmation that the user added to route or not.
     */
    exports.addToRoute = functions.https.onCall((data, context) => {

        return common.checkData(data)
        .then(() => common.checkData(data.route))
        .then(() => common.checkData(data.address))
        .then(() => common.checkUser(data.user))
        .then(() => common.checkData(data.coordinates))
        .then(() => routeSA.addToRoute(data.user, data.route, data.address, data.coordinates))
        .then(() => { return {added: true} }, error => error);
    });

    /**
     * @description Get a route to match with id.
     * 
     * @returns {Promise} A promise with match route.
     */
    exports.getRouteById = functions.https.onCall((data, context) => {

        return common.checkData(data)
        .then(() => common.checkData(data.route))
        .then(() => common.checkData(data.route.id))
        .then(() => {

        if(data.user != undefined && data.user != null) return common.checkUser(data.user);
        else return null;
        })
        .then(() => routeSA.getRouteById(data.route.id,data.user != undefined && data.user != null ? data.user : null))
        .then((route) => route, error => error);
    });

    /**
     * @description  Delete a user to the selected route.
     * 
     * @returns {Promise} A promise with confirmation about deletion.
     */
    exports.removePassengerFromRoute = functions.https.onCall((data, context) => {

        return common.checkData(data)
        .then(() => common.checkData(data.route))
        .then(() => common.checkUser(data.user,"passenger"))
        .then(() => routeSA.removePassengerFromRoute(data.user,data.route))
        .then(() => { return { removed: true} }, error => error);
    });

    /**
     * @description Delete a route to create for driver user.
     * 
     * @returns {Promise} A promise with confirmation about deletion.
     */
    exports.removeRoute = functions.https.onCall((data, context) => {

        return common.checkData(data)
        .then(() => common.checkData(data.route))
        .then(() => common.checkUser(data.user,"driver"))
        .then(() => routeSA.removeRoute(data.user,data.route))
        .then(() => { return {removed: true} }, error => error);
    });

    /**
     * @description Get the route associate to a user.
     * 
     * @returns {Promise} A promise with list of routes.
     */
    exports.getRoutesByUser = functions.https.onCall((data, context) => {
        
        return common.checkData(data)
        .then(() => common.checkUser(data.user))
        .then(() => routeSA.getRoutesByUser(data.user))
        .then((routes) => { return {routes: routes[0]} }, error => error);
    });

    /**
     * @description Get the coordinates that make up a route.
     * 
     * @returns {Promise} A promise with a list to coordinates.
     */
    exports.getRoutePoints = functions.https.onCall((data, context) => {
        
        return common.checkData(data)
        .then(() => common.checkData(data.route))
        .then(() => common.checkUser(data.user,"driver"))
        .then(() => routeSA.getRoutePoints(data.route,data.user))
        .then((points) => { return {points: points}}, error => error);
    });
 